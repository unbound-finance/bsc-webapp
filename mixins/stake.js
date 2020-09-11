import { ethers } from 'ethers'

import UniswapRouterABI from '~/configs/abi/UniswapRouter'
import UniswapLPTABI from '~/configs/abi/UniswapLPTABI'
import config from '~/configs/config'

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

const addLiquidity = async (tokenA, tokenB, amountA, amountB) => {
  const contract = await new ethers.Contract(
    config.contracts.uniswapRouter,
    UniswapRouterABI,
    signer
  )
  const formatAmountA = ethers.utils.parseEther(amountA).toString()
  const formatAmountB = ethers.utils.parseEther(amountB).toString()

  const amountADesired = formatAmountB
  const amountBDesired = formatAmountB
  const amountAMin = (formatAmountA - (formatAmountA * 10) / 100).toString()
  const amountBMin = (formatAmountB - (formatAmountB * 10) / 100).toString()
  const to = await signer.getAddress()
  const deadline = +new Date() + 5000

  const transaction = await contract.addLiquidity(
    tokenA,
    tokenB,
    amountADesired,
    amountBDesired,
    amountAMin,
    amountBMin,
    to,
    deadline
  )
  return transaction
}

const removeLiquidity = async (tokenA, tokenB, amountA, amountB) => {
  // const poolTokenBalance = await getPoolTokenBalance()
  // // const poolTokenReserves = await getPoolTokenReserves()
  // const poolTokenTotalSupply = await getPoolTokenTotalSupply()

  const contract = await new ethers.Contract(
    config.contracts.uniswapRouter,
    UniswapRouterABI,
    signer
  )
  const formatAmountA = ethers.utils.parseEther(amountA).toString()
  const formatAmountB = ethers.utils.parseEther(amountB).toString()

  const liquidity = Math.sqrt(formatAmountA * formatAmountB)

  const amountAMin = (formatAmountA - (formatAmountA * 10) / 100).toString()
  const amountBMin = (formatAmountB - (formatAmountB * 10) / 100).toString()
  const to = await signer.getAddress()
  const deadline = +new Date() + 5000

  console.log({
    tokenA,
    tokenB,
    liquidity,
    amountAMin,
    amountBMin,
    to,
    deadline,
  })

  const transaction = await contract.removeLiquidity(
    tokenA,
    tokenB,
    liquidity,
    amountAMin,
    amountBMin,
    to,
    deadline
  )
  return transaction
}

const getPoolTokenBalance = async () => {
  const userAddress = signer.getAddress()
  const poolTokenContract = await new ethers.Contract(
    config.contracts.uDaiUniswapPool,
    UniswapLPTABI,
    signer
  )
  const balance = poolTokenContract.balanceOf(userAddress)
  return balance
}

const getPoolTokenReserves = async () => {
  const poolTokenContract = new ethers.Contract(
    config.contracts.uDaiUniswapPool,
    UniswapLPTABI,
    signer
  )
  const reserves = await poolTokenContract.getReserves()
  return {
    reserve0: reserves[0].toString(),
    reserve1: reserves[1].toString(),
  }
}

const getPoolTokenTotalSupply = async () => {
  const poolTokenContract = new ethers.Contract(
    config.contracts.uDaiUniswapPool,
    UniswapLPTABI,
    signer
  )
  const totalSupply = await poolTokenContract.totalSupply()
  return totalSupply
}

const getAmountOfLockedTokens = async () => {
  const poolTokenTotalSupply = await getPoolTokenTotalSupply()
  const poolTokenBalance = await getPoolTokenTotalSupply()
  const poolTokenReserves = await getPoolTokenReserves()
  const poolTokenRatio =
    poolTokenBalance.toString() / poolTokenTotalSupply.toString()
  return {
    token0: (poolTokenReserves.reserve0 * poolTokenRatio) / 1e18,
    token1: (poolTokenReserves.reserve0 * poolTokenRatio) / 1e18,
    poolShare: poolTokenRatio * 100,
  }
}

export {
  addLiquidity,
  removeLiquidity,
  getPoolTokenBalance,
  getPoolTokenReserves,
  getPoolTokenTotalSupply,
  getAmountOfLockedTokens,
}
