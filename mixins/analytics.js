import { ethers } from 'ethers'
import config from '@/configs/config'
import UniswapLPTABI from '~/configs/abi/UniswapLPTABI'
import UnboundDai from '~/configs/abi/UnboundDai'

import { getERC20Price, getLPTPrice, getTotalLockedLPT } from '~/mixins/info'

import supportedPoolTokens from '~/configs/supportedPoolTokens'

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

export const getTotalLiquidity = async () => {
  const und = await new ethers.Contract(
    config.contracts.UNDUniswapPool,
    UniswapLPTABI,
    signer
  )
  const ueth = await new ethers.Contract(
    config.contracts.uETHUniswapPool,
    UniswapLPTABI,
    signer
  )
  const undReserve = await und.getReserves()
  const uethReserve = await ueth.getReserves()

  const undLiquidity = (ethers.BigNumber.from(undReserve[0]) * 2) / 1e18
  const uethLiquidity = (ethers.BigNumber.from(uethReserve[0]) * 2) / 1e18

  const ethPrice = await getERC20Price('ethereum')
  const uethLiquidityInUsd = Number(uethLiquidity * ethPrice)

  return {
    total: Number(undLiquidity + uethLiquidityInUsd),
    undLiquidity: Number(undLiquidity),
    uethLiquidity: Number(uethLiquidity),
    uethLiquidityInUsd: Number(uethLiquidityInUsd),
  }
}

export const getDailyVolume = async () => {}

export const getMintingFees = async () => {}

export const getCRatio = async () => {
  // Get total UND and uETH minted
  const und = await new ethers.Contract(
    config.contracts.unboundDai,
    UnboundDai,
    signer
  )

  const ueth = await new ethers.Contract(
    config.contracts.unboundEth,
    UnboundDai,
    signer
  )

  const totalUND = await und.totalSupply()
  const totalUETH = await ueth.totalSupply()
  const ethPrice = await getERC20Price('ethereum')

  const totalUTokensMinted = totalUND / 1e18 + (totalUETH / 1e18) * ethPrice

  // Get total value of locked LPT's
  const totalLockedLPTValue = (
    await Promise.all(
      supportedPoolTokens.map(async (poolToken) => {
        const LPTPrice = await getLPTPrice(poolToken)
        const lockedLPT = await getTotalLockedLPT(
          poolToken.address,
          poolToken.llcAddress
        )
        return Number(LPTPrice * lockedLPT)
      })
    )
  ).reduce((a, b) => a + b || 0, 0)

  // Calculate Collatralization Percentage
  return Number((totalLockedLPTValue / totalUTokensMinted) * 100).toFixed(2)
}

export const getFeesAccrued = async () => {}
