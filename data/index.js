import { ethers } from 'ethers'
import { getProvider } from '~/plugins/web3provider'

import { UNBOUND_DOLLAR_ABI, UNBOUND_LLC_ABI } from '~/constants'

const checkLoan = async (LLCAddress, uTokenAddress) => {
  const { SIGNER } = getProvider()
  const contract = await new ethers.Contract(
    uTokenAddress,
    UNBOUND_DOLLAR_ABI,
    SIGNER
  )
  const userAddress = SIGNER.getAddress()
  const getBalance = await contract.checkLoan(userAddress, LLCAddress)
  const balance = ethers.utils.formatEther(getBalance.toString())
  const formattedBalance = parseFloat(balance).toFixed(4).slice(0, -1)
  return { formattedBalance, rawBalance: getBalance }
}

const getLockedLPT = async (LLCAddress) => {
  const { SIGNER } = getProvider()
  try {
    const contract = new ethers.Contract(LLCAddress, UNBOUND_LLC_ABI, SIGNER)
    const userAddress = SIGNER.getAddress()
    const getLocked = await contract.tokensLocked(userAddress)
    const locked = ethers.utils.formatEther(getLocked.toString())
    return {
      formatted: locked,
      raw: getLocked,
    }
  } catch (error) {
    console.log(error)
  }
}

const getCR = async (LLCAddress) => {
  const { SIGNER } = getProvider()
  try {
    const contract = new ethers.Contract(LLCAddress, UNBOUND_LLC_ABI, SIGNER)
    const getCR = await contract.CREnd()
    return getCR
  } catch (error) {
    console.log(error)
  }
}

export { checkLoan, getLockedLPT, getCR }
