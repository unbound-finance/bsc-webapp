export default [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'valuingAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'LPTaddress',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'LPTamt',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'tokenNum',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'extraTime',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'lockLPT',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'LPTamt',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'tokenNum',
        type: 'uint8',
      },
    ],
    name: 'lockLPT1',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'LPToken',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'tokenNum',
        type: 'uint8',
      },
    ],
    name: 'unlockLPT',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isOwner',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newOwner',
        type: 'address',
      },
    ],
    name: 'setOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newValuing',
        type: 'address',
      },
    ],
    name: 'setValuingAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
