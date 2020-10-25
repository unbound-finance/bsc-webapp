import { ethers } from 'ethers'
import Axios from 'axios'

import ERC20ABI from '~/configs/abi/ERC20'
import UnboundDollarABI from '~/configs/abi/UnboundDai'
import UnboundLLCABI from '~/configs/abi/UnboundLLCABI'
import UniswapLPTABI from '~/configs/abi/UniswapLPTABI'

import { getDecimals } from '~/mixins/ERC20'

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

const getBalanceOfToken = async (tokenAddress) => {
  const contract = await new ethers.Contract(tokenAddress, ERC20ABI, signer)
  const userAddress = signer.getAddress()
  const getBalance = await contract.balanceOf(userAddress)
  const balance = ethers.utils.formatEther(getBalance.toString())
  const formattedBalance = parseFloat(balance).toFixed(4).slice(0, -1)
  return formattedBalance
}

const checkLoan = async (LLCAddress, uTokenAddress) => {
  const contract = await new ethers.Contract(
    uTokenAddress,
    UnboundDollarABI,
    signer
  )
  const userAddress = signer.getAddress()
  const getBalance = await contract.checkLoan(userAddress, LLCAddress)
  const balance = ethers.utils.formatEther(getBalance.toString())
  const formattedBalance = parseFloat(balance).toFixed(4).slice(0, -1)
  return formattedBalance
}

const getLockedLPT = async (LPTAddress) => {
  const contract = new ethers.Contract(LPTAddress, UnboundLLCABI, signer)
  const userAddress = signer.getAddress()
  const getLocked = await contract.tokensLocked(userAddress)
  const locked = ethers.utils.formatEther(getLocked.toString())
  const formatted = parseFloat(locked).toFixed(4).slice(0, -1)
  return formatted
}

const getTotalLockedLPT = async (LPTAddress, LLCAddress) => {
  try {
    console.log('main func', LLCAddress)
    const contract = await new ethers.Contract(
      LPTAddress,
      UniswapLPTABI,
      signer
    )
    const getLocked = await contract.balanceOf(LLCAddress)
    const locked = ethers.utils.formatEther(getLocked)
    const formatted = parseFloat(locked).toFixed(4).slice(0, -1)
    return formatted
  } catch (error) {
    console.log(error)
  }
}

const getLPTPrice = async (poolToken) => {
  const contract = await new ethers.Contract(
    poolToken.address,
    UniswapLPTABI,
    signer
  )

  const reserve = await contract.getReserves()
  const LPTTotalSupply = await contract.totalSupply()
  const token0 = await contract.token0()
  const token1 = await contract.token1()

  if (token0.toLowerCase() === poolToken.stablecoin.toLowerCase()) {
    const stablecoinDecimal = await getDecimals(token0)
    let difference
    let totalValue

    totalValue = reserve[0].toString() * 2
    // first case: tokenDecimal is smaller than 18
    // for stablecoins with less than 18 decimals
    if (stablecoinDecimal < '18' && stablecoinDecimal >= '0') {
      // calculate amount of decimals under 18
      difference = 18 - stablecoinDecimal
      totalValue = totalValue * 10 ** difference
    } else if (stablecoinDecimal > '18') {
      // caclulate amount of decimals over 18
      difference = stablecoinDecimal - 18
      // removes decimals to match 18
      totalValue = totalValue / 10 ** difference
    }

    if (poolToken.uToken.symbol === 'uETH') {
      const ethPrice = await getERC20Price('ethereum')
      return (totalValue / LPTTotalSupply).toFixed(4).slice(0, -1) * ethPrice
    } else {
      return (totalValue / LPTTotalSupply).toFixed(4).slice(0, -1)
    }
  } else {
    const stablecoinDecimal = await getDecimals(token1)
    let difference
    let totalValue

    totalValue = reserve[1].toString() * 2
    // first case: tokenDecimal is smaller than 18
    // for stablecoins with less than 18 decimals
    if (stablecoinDecimal < '18' && stablecoinDecimal >= '0') {
      // calculate amount of decimals under 18
      difference = 18 - stablecoinDecimal
      totalValue = totalValue * 10 ** difference
    } else if (stablecoinDecimal > '18') {
      // caclulate amount of decimals over 18
      difference = stablecoinDecimal - 18
      // removes decimals to match 18
      totalValue = totalValue / 10 ** difference
    }

    if (poolToken.uToken.symbol === 'uETH') {
      const ethPrice = await getERC20Price('ethereum')
      return (totalValue / LPTTotalSupply).toFixed(4).slice(0, -1) * ethPrice
    } else {
      return (totalValue / LPTTotalSupply).toFixed(4).slice(0, -1)
    }
  }
}

const getERC20Price = async (id) => {
  // id: 'ethereum'
  try {
    const { data } = await Axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`
    )
    const { usd } = data[id]
    return usd
  } catch (error) {
    throw new Error('Error fetching price.')
  }
}

export {
  getBalanceOfToken,
  checkLoan,
  getLockedLPT,
  getTotalLockedLPT,
  getERC20Price,
  getLPTPrice,
}
