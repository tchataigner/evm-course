import {
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig,
} from 'wagmi'
import {
  ReadContractResult,
  WriteContractMode,
  PrepareWriteContractResult,
} from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TokenBox
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tokenBoxABI = [
  { stateMutability: 'nonpayable', type: 'constructor', inputs: [] },
  { type: 'error', inputs: [], name: 'AccessControlBadConfirmation' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'neededRole', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'AccessControlUnauthorizedAccount',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidApprover',
  },
  {
    type: 'error',
    inputs: [
      { name: 'idsLength', internalType: 'uint256', type: 'uint256' },
      { name: 'valuesLength', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InvalidArrayLength',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidSender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1155MissingApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Redeem',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'TransferBatch',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransferSingle',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'URI',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'MINTER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'REDEEMER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'amountRedeemed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfBatch',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tokenUri', internalType: 'string', type: 'string' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'allocated', internalType: 'address[]', type: 'address[]' },
      { name: 'allocations', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'allocationsRedeemed', internalType: 'bool[]', type: 'bool[]' },
    ],
    name: 'mintAndAllocate',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'minterOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'nextId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'redeem',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'redeemedSupplyOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'callerConfirmation', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'supplyOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'uri',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
] as const

export const tokenBoxAddress =
  '0x5FbDB2315678afecb367f032d93F642f64180aa3' as const

export const tokenBoxConfig = {
  address: tokenBoxAddress,
  abi: tokenBoxABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenBoxABI}__.
 */
export function useTokenBoxRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof tokenBoxABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > = {} as any,
) {
  return useContractRead({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    ...config,
  } as UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`.
 */
export function useTokenBoxDefaultAdminRole<
  TFunctionName extends 'DEFAULT_ADMIN_ROLE',
  TSelectData = ReadContractResult<typeof tokenBoxABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'DEFAULT_ADMIN_ROLE',
    ...config,
  } as UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"MINTER_ROLE"`.
 */
export function useTokenBoxMinterRole<
  TFunctionName extends 'MINTER_ROLE',
  TSelectData = ReadContractResult<typeof tokenBoxABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'MINTER_ROLE',
    ...config,
  } as UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"REDEEMER_ROLE"`.
 */
export function useTokenBoxRedeemerRole<
  TFunctionName extends 'REDEEMER_ROLE',
  TSelectData = ReadContractResult<typeof tokenBoxABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'REDEEMER_ROLE',
    ...config,
  } as UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"amountRedeemed"`.
 */
export function useTokenBoxAmountRedeemed<
  TFunctionName extends 'amountRedeemed',
  TSelectData = ReadContractResult<typeof tokenBoxABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'amountRedeemed',
    ...config,
  } as UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useTokenBoxBalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof tokenBoxABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"balanceOfBatch"`.
 */
export function useTokenBoxBalanceOfBatch<
  TFunctionName extends 'balanceOfBatch',
  TSelectData = ReadContractResult<typeof tokenBoxABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'balanceOfBatch',
    ...config,
  } as UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"getRoleAdmin"`.
 */
export function useTokenBoxGetRoleAdmin<
  TFunctionName extends 'getRoleAdmin',
  TSelectData = ReadContractResult<typeof tokenBoxABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'getRoleAdmin',
    ...config,
  } as UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"hasRole"`.
 */
export function useTokenBoxHasRole<
  TFunctionName extends 'hasRole',
  TSelectData = ReadContractResult<typeof tokenBoxABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'hasRole',
    ...config,
  } as UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"isApprovedForAll"`.
 */
export function useTokenBoxIsApprovedForAll<
  TFunctionName extends 'isApprovedForAll',
  TSelectData = ReadContractResult<typeof tokenBoxABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'isApprovedForAll',
    ...config,
  } as UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"minterOf"`.
 */
export function useTokenBoxMinterOf<
  TFunctionName extends 'minterOf',
  TSelectData = ReadContractResult<typeof tokenBoxABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'minterOf',
    ...config,
  } as UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"nextId"`.
 */
export function useTokenBoxNextId<
  TFunctionName extends 'nextId',
  TSelectData = ReadContractResult<typeof tokenBoxABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'nextId',
    ...config,
  } as UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"redeemedSupplyOf"`.
 */
export function useTokenBoxRedeemedSupplyOf<
  TFunctionName extends 'redeemedSupplyOf',
  TSelectData = ReadContractResult<typeof tokenBoxABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'redeemedSupplyOf',
    ...config,
  } as UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"supplyOf"`.
 */
export function useTokenBoxSupplyOf<
  TFunctionName extends 'supplyOf',
  TSelectData = ReadContractResult<typeof tokenBoxABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'supplyOf',
    ...config,
  } as UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"supportsInterface"`.
 */
export function useTokenBoxSupportsInterface<
  TFunctionName extends 'supportsInterface',
  TSelectData = ReadContractResult<typeof tokenBoxABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'supportsInterface',
    ...config,
  } as UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"uri"`.
 */
export function useTokenBoxUri<
  TFunctionName extends 'uri',
  TSelectData = ReadContractResult<typeof tokenBoxABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'uri',
    ...config,
  } as UseContractReadConfig<typeof tokenBoxABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenBoxABI}__.
 */
export function useTokenBoxWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenBoxABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof tokenBoxABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof tokenBoxABI, TFunctionName, TMode>({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"grantRole"`.
 */
export function useTokenBoxGrantRole<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenBoxABI,
          'grantRole'
        >['request']['abi'],
        'grantRole',
        TMode
      > & { functionName?: 'grantRole' }
    : UseContractWriteConfig<typeof tokenBoxABI, 'grantRole', TMode> & {
        abi?: never
        functionName?: 'grantRole'
      } = {} as any,
) {
  return useContractWrite<typeof tokenBoxABI, 'grantRole', TMode>({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'grantRole',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"mintAndAllocate"`.
 */
export function useTokenBoxMintAndAllocate<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenBoxABI,
          'mintAndAllocate'
        >['request']['abi'],
        'mintAndAllocate',
        TMode
      > & { functionName?: 'mintAndAllocate' }
    : UseContractWriteConfig<typeof tokenBoxABI, 'mintAndAllocate', TMode> & {
        abi?: never
        functionName?: 'mintAndAllocate'
      } = {} as any,
) {
  return useContractWrite<typeof tokenBoxABI, 'mintAndAllocate', TMode>({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'mintAndAllocate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"redeem"`.
 */
export function useTokenBoxRedeem<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenBoxABI,
          'redeem'
        >['request']['abi'],
        'redeem',
        TMode
      > & { functionName?: 'redeem' }
    : UseContractWriteConfig<typeof tokenBoxABI, 'redeem', TMode> & {
        abi?: never
        functionName?: 'redeem'
      } = {} as any,
) {
  return useContractWrite<typeof tokenBoxABI, 'redeem', TMode>({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'redeem',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"renounceRole"`.
 */
export function useTokenBoxRenounceRole<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenBoxABI,
          'renounceRole'
        >['request']['abi'],
        'renounceRole',
        TMode
      > & { functionName?: 'renounceRole' }
    : UseContractWriteConfig<typeof tokenBoxABI, 'renounceRole', TMode> & {
        abi?: never
        functionName?: 'renounceRole'
      } = {} as any,
) {
  return useContractWrite<typeof tokenBoxABI, 'renounceRole', TMode>({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'renounceRole',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"revokeRole"`.
 */
export function useTokenBoxRevokeRole<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenBoxABI,
          'revokeRole'
        >['request']['abi'],
        'revokeRole',
        TMode
      > & { functionName?: 'revokeRole' }
    : UseContractWriteConfig<typeof tokenBoxABI, 'revokeRole', TMode> & {
        abi?: never
        functionName?: 'revokeRole'
      } = {} as any,
) {
  return useContractWrite<typeof tokenBoxABI, 'revokeRole', TMode>({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'revokeRole',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"safeBatchTransferFrom"`.
 */
export function useTokenBoxSafeBatchTransferFrom<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenBoxABI,
          'safeBatchTransferFrom'
        >['request']['abi'],
        'safeBatchTransferFrom',
        TMode
      > & { functionName?: 'safeBatchTransferFrom' }
    : UseContractWriteConfig<
        typeof tokenBoxABI,
        'safeBatchTransferFrom',
        TMode
      > & {
        abi?: never
        functionName?: 'safeBatchTransferFrom'
      } = {} as any,
) {
  return useContractWrite<typeof tokenBoxABI, 'safeBatchTransferFrom', TMode>({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'safeBatchTransferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"safeTransferFrom"`.
 */
export function useTokenBoxSafeTransferFrom<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenBoxABI,
          'safeTransferFrom'
        >['request']['abi'],
        'safeTransferFrom',
        TMode
      > & { functionName?: 'safeTransferFrom' }
    : UseContractWriteConfig<typeof tokenBoxABI, 'safeTransferFrom', TMode> & {
        abi?: never
        functionName?: 'safeTransferFrom'
      } = {} as any,
) {
  return useContractWrite<typeof tokenBoxABI, 'safeTransferFrom', TMode>({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'safeTransferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"setApprovalForAll"`.
 */
export function useTokenBoxSetApprovalForAll<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenBoxABI,
          'setApprovalForAll'
        >['request']['abi'],
        'setApprovalForAll',
        TMode
      > & { functionName?: 'setApprovalForAll' }
    : UseContractWriteConfig<typeof tokenBoxABI, 'setApprovalForAll', TMode> & {
        abi?: never
        functionName?: 'setApprovalForAll'
      } = {} as any,
) {
  return useContractWrite<typeof tokenBoxABI, 'setApprovalForAll', TMode>({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'setApprovalForAll',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenBoxABI}__.
 */
export function usePrepareTokenBoxWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenBoxABI, TFunctionName>,
    'abi' | 'address'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenBoxABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"grantRole"`.
 */
export function usePrepareTokenBoxGrantRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenBoxABI, 'grantRole'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'grantRole',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenBoxABI, 'grantRole'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"mintAndAllocate"`.
 */
export function usePrepareTokenBoxMintAndAllocate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenBoxABI, 'mintAndAllocate'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'mintAndAllocate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenBoxABI, 'mintAndAllocate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"redeem"`.
 */
export function usePrepareTokenBoxRedeem(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenBoxABI, 'redeem'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'redeem',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenBoxABI, 'redeem'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"renounceRole"`.
 */
export function usePrepareTokenBoxRenounceRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenBoxABI, 'renounceRole'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'renounceRole',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenBoxABI, 'renounceRole'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"revokeRole"`.
 */
export function usePrepareTokenBoxRevokeRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenBoxABI, 'revokeRole'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'revokeRole',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenBoxABI, 'revokeRole'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"safeBatchTransferFrom"`.
 */
export function usePrepareTokenBoxSafeBatchTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenBoxABI, 'safeBatchTransferFrom'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'safeBatchTransferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof tokenBoxABI,
    'safeBatchTransferFrom'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"safeTransferFrom"`.
 */
export function usePrepareTokenBoxSafeTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenBoxABI, 'safeTransferFrom'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'safeTransferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenBoxABI, 'safeTransferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenBoxABI}__ and `functionName` set to `"setApprovalForAll"`.
 */
export function usePrepareTokenBoxSetApprovalForAll(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenBoxABI, 'setApprovalForAll'>,
    'abi' | 'address' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    functionName: 'setApprovalForAll',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenBoxABI, 'setApprovalForAll'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenBoxABI}__.
 */
export function useTokenBoxEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof tokenBoxABI, TEventName>,
    'abi' | 'address'
  > = {} as any,
) {
  return useContractEvent({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    ...config,
  } as UseContractEventConfig<typeof tokenBoxABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenBoxABI}__ and `eventName` set to `"ApprovalForAll"`.
 */
export function useTokenBoxApprovalForAllEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenBoxABI, 'ApprovalForAll'>,
    'abi' | 'address' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    eventName: 'ApprovalForAll',
    ...config,
  } as UseContractEventConfig<typeof tokenBoxABI, 'ApprovalForAll'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenBoxABI}__ and `eventName` set to `"Redeem"`.
 */
export function useTokenBoxRedeemEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenBoxABI, 'Redeem'>,
    'abi' | 'address' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    eventName: 'Redeem',
    ...config,
  } as UseContractEventConfig<typeof tokenBoxABI, 'Redeem'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenBoxABI}__ and `eventName` set to `"RoleAdminChanged"`.
 */
export function useTokenBoxRoleAdminChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenBoxABI, 'RoleAdminChanged'>,
    'abi' | 'address' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    eventName: 'RoleAdminChanged',
    ...config,
  } as UseContractEventConfig<typeof tokenBoxABI, 'RoleAdminChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenBoxABI}__ and `eventName` set to `"RoleGranted"`.
 */
export function useTokenBoxRoleGrantedEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenBoxABI, 'RoleGranted'>,
    'abi' | 'address' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    eventName: 'RoleGranted',
    ...config,
  } as UseContractEventConfig<typeof tokenBoxABI, 'RoleGranted'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenBoxABI}__ and `eventName` set to `"RoleRevoked"`.
 */
export function useTokenBoxRoleRevokedEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenBoxABI, 'RoleRevoked'>,
    'abi' | 'address' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    eventName: 'RoleRevoked',
    ...config,
  } as UseContractEventConfig<typeof tokenBoxABI, 'RoleRevoked'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenBoxABI}__ and `eventName` set to `"TransferBatch"`.
 */
export function useTokenBoxTransferBatchEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenBoxABI, 'TransferBatch'>,
    'abi' | 'address' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    eventName: 'TransferBatch',
    ...config,
  } as UseContractEventConfig<typeof tokenBoxABI, 'TransferBatch'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenBoxABI}__ and `eventName` set to `"TransferSingle"`.
 */
export function useTokenBoxTransferSingleEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenBoxABI, 'TransferSingle'>,
    'abi' | 'address' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    eventName: 'TransferSingle',
    ...config,
  } as UseContractEventConfig<typeof tokenBoxABI, 'TransferSingle'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenBoxABI}__ and `eventName` set to `"URI"`.
 */
export function useTokenBoxUriEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenBoxABI, 'URI'>,
    'abi' | 'address' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: tokenBoxABI,
    address: tokenBoxAddress,
    eventName: 'URI',
    ...config,
  } as UseContractEventConfig<typeof tokenBoxABI, 'URI'>)
}
