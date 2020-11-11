import { ethers } from 'ethers'
import Axios from 'axios'

import ERC20ABI from '~/configs/abi/ERC20'
import UnboundDollarABI from '~/configs/abi/UnboundDai'
import UnboundLLCABI from '~/configs/abi/UnboundLLCABI'
import UniswapLPTABI from '~/configs/abi/UniswapLPTABI'

import { getDecimals } from '~/mixins/ERC20'

const getBalanceOfToken = async (tokenAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contract = await new ethers.Contract(tokenAddress, ERC20ABI, signer)
  const userAddress = signer.getAddress()
  const getBalance = await contract.balanceOf(userAddress)
  const balance = ethers.utils.formatEther(getBalance.toString())
  const formattedBalance = parseFloat(balance).toFixed(4).slice(0, -1)
  return formattedBalance
}

const checkLoan = async (LLCAddress, uTokenAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
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
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(LPTAddress, UnboundLLCABI, signer)
  const userAddress = signer.getAddress()
  const getLocked = await contract.tokensLocked(userAddress)
  const locked = ethers.utils.formatEther(getLocked.toString())
  return locked
}

const getTotalLockedLPT = async (LPTAddress, LLCAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  try {
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
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
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

const getUniswapTvl = async (address) => {
  try {
    const data = JSON.stringify({
      query: `
          query($id: String!) {
            pair(id: $id) {
              token0 {
                symbol
                name
              }
            token1 {
                symbol
                name
            }
            reserve0
            reserve1
            reserveUSD
            }
          }
        `,
      variables: {
        id: address,
      },
    })
    const config = {
      method: 'post',
      url: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    }

    try {
      const { data } = await Axios(config)
      if (!data.data.pair) {
        return 0
      }
      return data.data.pair.reserveUSD
    } catch (e) {
      return 0
    }
  } catch (error) {
    throw new Error('Something went wrong', error)
  }
}

const getTotalVolume = async () => {
  try {
    const data = JSON.stringify({
      query: `
          query {
              alls {
               mintTotal
               burnTotal
              }
          }
        `,
    })
    const config = {
      method: 'post',
      url: 'https://api.thegraph.com/subgraphs/name/furuta/und-kovan',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    }

    try {
      const { data } = await Axios(config)
      if (!data.data) {
        return 0
      }
      return (
        (Number(data.data.alls[0].mintTotal) +
          Number(data.data.alls[0].burnTotal)) /
        1e18
      )
    } catch (e) {
      return 0
    }
  } catch (error) {
    throw new Error('Something went wrong', error)
  }
}

const getDailyVolume = async () => {
  try {
    const data = JSON.stringify({
      query: `
          query($count: Int!) {
            dailies(first: $count) {
              mintTotal
              burnTotal
            }
          }
        `,
      variables: {
        count: 1,
      },
    })
    const config = {
      method: 'post',
      url: 'https://api.thegraph.com/subgraphs/name/furuta/und-kovan',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    }

    try {
      const { data } = await Axios(config)
      if (!data.data) {
        return 0
      }
      return (
        (Number(data.data.dailies[0].mintTotal) +
          Number(data.data.dailies[0].burnTotal)) /
        1e18
      )
    } catch (e) {
      return 0
    }
  } catch (error) {
    throw new Error('Something went wrong', error)
  }
}

export {
  getBalanceOfToken,
  checkLoan,
  getLockedLPT,
  getTotalLockedLPT,
  getERC20Price,
  getLPTPrice,
  getUniswapTvl,
  getTotalVolume,
  getDailyVolume,
}
