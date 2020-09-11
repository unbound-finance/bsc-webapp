import { ethers } from 'ethers'

import UniswapRouterABI from '~/configs/abi/UniswapRouter'
import config from '~/configs/config'

const addLiquidity = async (tokenA, tokenB, amountA, amountB) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
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

export { addLiquidity }
