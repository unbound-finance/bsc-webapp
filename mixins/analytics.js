import { ethers } from 'ethers'
import config from '@/configs/config'
import UniswapLPTABI from '~/configs/abi/UniswapLPTABI'

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

export const getTotalLiquidity = async () => {
  const contract = await new ethers.Contract(
    config.contracts.UNDUniswapPool,
    UniswapLPTABI,
    signer
  )
  const token0 = await contract.token0()
  const reserve = await contract.getReserves()

  // checking for stablecoin address
  if (token0.toLowerCase() === config.contracts.unboundDai) {
    return (ethers.BigNumber.from(reserve[0]) * 2) / 1e18
  } else {
    return (ethers.BigNumber.from(reserve[1]) * 2) / 1e18
  }
}

export const getTotalLockedLPT = async (lptAddress, llcAddress) => {
  const contract = await new ethers.Contract(lptAddress, UniswapLPTABI, signer)
  const lockedLPT = await contract.balanceOf(llcAddress)
  return lockedLPT / 1e18
}

export const getDailyVolume = async () => {}

export const getMintingFees = async () => {}

export const getCRatio = async () => {}

export const getFeesAccrued = async () => {}
