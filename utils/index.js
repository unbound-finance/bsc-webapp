import { ethers } from 'ethers'
import Axios from 'axios'

import { CHAIN_ID, ETHERSCAN_HOST, UNBOUND_LLC_ABI } from '~/constants'
import { getProvider } from '~/plugins/web3provider'

// get nonce from Uniswap for the permit()s
export const getNonce = async (poolTokenAddress, signer) => {
  const userAddress = await signer.getAddress()
  const abi = ['function nonces(address) view returns (uint256)']
  const PoolTokenContract = new ethers.Contract(poolTokenAddress, abi, signer)
  try {
    const nonce = await PoolTokenContract.nonces(userAddress)
    return parseInt(nonce)
  } catch (error) {
    throw new Error('Something went wrong getting nonce.', error)
  }
}

// generating and EIP Signature
// https://github.com/ethereum/EIPs/blob/8a34d644aacf0f9f8f00815307fd7dd5da07655f/EIPS/eip-2612.md
export const getEIP712Signature = (
  poolTokenAddress,
  spender,
  userAddress,
  amount,
  nonce,
  deadline
) => {
  const Permit = [
    {
      name: 'owner',
      type: 'address',
    },
    {
      name: 'spender',
      type: 'address',
    },
    {
      name: 'value',
      type: 'uint256',
    },
    {
      name: 'nonce',
      type: 'uint256',
    },
    {
      name: 'deadline',
      type: 'uint256',
    },
  ]
  const EIP712Domain = [
    {
      name: 'name',
      type: 'string',
    },
    {
      name: 'version',
      type: 'string',
    },
    {
      name: 'chainId',
      type: 'uint256',
    },
    {
      name: 'verifyingContract',
      type: 'address',
    },
  ]
  const message = {
    owner: userAddress,
    spender,
    value: amount,
    nonce,
    deadline,
  }
  const domain = {
    name: 'Uniswap V2',
    version: '1',
    chainId: parseInt(CHAIN_ID),
    verifyingContract: poolTokenAddress,
  }
  const data = JSON.stringify({
    types: {
      Permit,
      EIP712Domain,
    },
    primaryType: 'Permit',
    domain,
    message,
  })

  return data
}

export const dynamicsort = (property, order) => {
  let sortOrder = 1
  if (order === 'desc') {
    sortOrder = -1
  }
  return function (a, b) {
    // a should come before b in the sorted order
    if (a[property] < b[property]) {
      return -1 * sortOrder
      // a should come after b in the sorted order
    } else if (a[property] > b[property]) {
      return 1 * sortOrder
      // a and b are the same
    } else {
      return 0 * sortOrder
    }
  }
}

export function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    const e = parseInt(x.toString().split('e-')[1])
    if (e) {
      x *= Math.pow(10, e - 1)
      x = '0.' + new Array(e).join('0') + x.toString().substring(2)
    }
  } else {
    let e = parseInt(x.toString().split('+')[1])
    if (e > 20) {
      e -= 20
      x /= Math.pow(10, e)
      x += new Array(e + 1).join('0')
    }
  }
  return x
}

export function countDecimals(value) {
  if (!value) return ''
  const text = value.toString()
  let val = value

  if (typeof value === 'string') {
    val = Number(value)
  }

  // verify if number 0.000005 is represented as "5e-6"
  if (text.includes('e-')) {
    // eslint-disable-next-line no-unused-vars
    const [base, trail] = text.split('e-')
    const deg = parseInt(trail, 10)
    return deg
  }
  // count decimals for number in representation like "0.123456"
  if (Math.floor(val) !== val) {
    return val.toString().split('.')[1].length || 0
  }
  return 0
}

const getBlockLimit = async (llcAddress) => {
  const { SIGNER } = getProvider()
  const llcContract = new ethers.Contract(llcAddress, UNBOUND_LLC_ABI, SIGNER)
  const blockLimit = await llcContract.blockLimit()
  return blockLimit || 0
}

const getCurrentBlock = async () => {
  try {
    const params = {
      module: 'proxy',
      action: 'eth_blockNumber',
    }
    const { data } = await Axios.get(ETHERSCAN_HOST, { params })
    return data.result.toString()
  } catch (error) {
    throw new Error(error)
  }
}

const isPending = (llcAddress, userAddress) => {
  try {
    const txStatus = JSON.parse(localStorage.getItem('txStatus'))
    if (
      txStatus &&
      txStatus.pending &&
      txStatus.llcAddress.toLowerCase() === llcAddress &&
      txStatus.userAddress.toLowerCase() === userAddress.toLowerCase()
    )
      return true
    else return false
  } catch (error) {
    throw new Error(error)
  }
}

export const isBlocktimeReached = async (llcAddress) => {
  try {
    const { SIGNER } = getProvider()
    const userAddress = await SIGNER.getAddress()
    const pending = isPending(llcAddress, userAddress)
    if (pending)
      return {
        pending: true,
        targetBlockNumber: 0,
      }
    const llcBlockLimit = await getBlockLimit(llcAddress)
    const currentBlock = await getCurrentBlock()
    const startBlock = currentBlock - llcBlockLimit
    const params = {
      module: 'account',
      action: 'txlist',
      address: userAddress,
      sort: 'desc',
      startBlock,
      apiKey: 'HUWMR5VJHDQ7EEZYEUWQAAHBNMURE1R1CH',
    }
    const { data } = await Axios.get(ETHERSCAN_HOST, { params })
    const txList = data.result || []
    // checking for llc address presence in specified last block numbers
    const txs = txList.find((tx) => tx.to === llcAddress)
    if (txs) {
      const blockNumber = txs.blockNumber
      return {
        pending: true,
        targetBlockNumber: Number(blockNumber) + Number(llcBlockLimit),
      }
    } else
      return {
        pending: false,
        targetBlockNumber: 0,
      }
  } catch (error) {
    throw new Error(error)
  }
}

export function getRealtimeCurrentBlock() {
  const { PROVIDER } = getProvider()
  PROVIDER.on('block', (blockNumber) => {
    this.$store.commit('SET_CURRENT_BLOCK', blockNumber)
  })
}
