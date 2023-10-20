import { getEthHttpUriEnv, getTokenBoxAddressEnv } from '../utils/env';
import recMarketplace from '../config/tokenBox';
import { ethers } from 'ethers';
import { Contract } from 'ethers';
import { handleGrantRole, handleRevokeRole } from './handle-roles';
import { PrismaClient } from '@prisma/client';
import { sleep } from '../utils/sleep';
import * as util from "util";

type RoleGrantedArgs = {
    role: string;
    account: string;
    sender: string;
};

type RoleRevokedArgs = {
    role: string;
    account: string;
    sender: string;
};

export const searchNewBlock = async (prisma: PrismaClient) => {
    const tokenBoxAddress = getTokenBoxAddressEnv();
    const provider = ethers.getDefaultProvider(getEthHttpUriEnv());

    const utils = await prisma.utils
        .findUnique({
            where: {
                id: 1,
            },
        })
        .catch(() => {
            console.error(`could not find data utils`);
        });

    if (!utils) {
        throw Error('Utils table should be properly initialize before searching for a new block');
    }

    console.info(`looking for valid transaction in block ${utils.ethereumBlockHeight}`);

    provider
        .getBlockWithTransactions(parseInt(utils.ethereumBlockHeight, 10))
        .then(async block => {
            if(!block) {
                await sleep(3000);
                void searchNewBlock(prisma);
                return
            }
            console.info(`found block ${utils.ethereumBlockHeight}`);

            const contract = new Contract(tokenBoxAddress, recMarketplace.abi, provider);

            // Loop through all transactions in the block
            for (const transaction of block.transactions) {
                // Check if the transaction was to the contract
                if (transaction.to !== tokenBoxAddress) {
                    continue;
                }

                console.info(`[ETHEREUM] Found transaction ${transaction.hash} in block ${block.number}`);
                // Get the receipt
                const receipt = await provider.getTransactionReceipt(transaction.hash);

                // Parse the logs with the contract interface
                for (const log of receipt.logs) {
                    const parsedLog = contract.interface.parseLog(log);
                    // Check if it's events we're interested in
                    switch (parsedLog.name) {
                        case 'RoleGranted':
                        {
                            const { role, account, sender }: RoleGrantedArgs =
                                parsedLog.args as unknown as RoleGrantedArgs;

                            console.info(
                                `[ETHEREUM] Received 'RoleGranted' event: [role=${role}, account=${account}, sender=${sender}]`,
                            );
                            handleGrantRole(
                                prisma,
                                block.number,
                                transaction.hash,
                                log.logIndex,
                                role,
                                account,
                                sender,
                            ).catch((err: Error) =>
                                console.warn(
                                    `could not handle grant role ${role} event for address ${account}: ${err.message}`,
                                ),
                            );
                        }
                            break;

                        case 'RoleRevoked':
                            {
                                const { role, account, sender }: RoleRevokedArgs =
                                    parsedLog.args as unknown as RoleRevokedArgs;

                                console.info(
                                    `[ETHEREUM] Received 'RoleRevoked' event: [role=${role}, account=${account}, sender=${sender}]`,
                                );
                                await handleRevokeRole(
                                    prisma,
                                    block.number,
                                    transaction.hash,
                                    log.logIndex,
                                    role,
                                    account,
                                    sender,
                                ).catch((err: Error) => {
                                    console.warn(
                                        `could not handle revoke role ${role} event for address ${account}: ${err.message}`,
                                    );
                                });
                            }
                            break;

                        default:
                            break;
                    }
                }
            }

            await prisma.utils
                .update({
                    where: { id: utils.id },
                    data: { ethereumBlockHeight: (block.number + 1).toString() },
                })
                .catch((err: Error) => {
                    throw Error(
                        `could not update chain utils in DB after handling block ${block.number}: ${err.message}`,
                    );
                });

            await sleep(3000);
            void searchNewBlock(prisma);
        })
        .catch(async (err: Error) => {
            if (!err.message.includes('requested a future epoch')) {
                console.warn(
                    `error while looking for valid transaction in block ${utils.ethereumBlockHeight}: ${err.message}`,
                );
            }

            if (err.message.includes('requested epoch was a null round')) {
                await prisma.utils
                    .update({
                        where: { id: utils.id },
                        data: { ethereumBlockHeight: (parseInt(utils.ethereumBlockHeight, 10) + 1).toString() },
                    })
                    .catch((err: Error) => {
                        throw Error(
                            `could not update chain utils in DB after handling block is a null round: ${err.message}`,
                        );
                    });
            }

            await sleep(3000);
            void searchNewBlock(prisma);
        });
};
