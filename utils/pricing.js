/**
 * @info
 * - Calculates loan ratio and fee for minting.
 * - Calculates the uToken to be burned based on collatralization ratio.
 */

import { ethers } from 'ethers'
import { getDecimals } from './ERC20'
import { getProvider } from '~/plugins/web3provider'
import { getCR, getLockedLPT, checkLoan } from '~/data'

// import ABIs and contract addresses
import { UNISWAP_LPT_ABI, UNBOUND_VALUATOR_ABI, contracts } from '~/constants'

// get LLC details
const getLLC = async (llcAddress) => {
  const { SIGNER } = getProvider()
  const valuator = new ethers.Contract(
    contracts.valuator,
    UNBOUND_VALUATOR_ABI,
    SIGNER
  )
  const getLLCStruct = await valuator.getLLCStruct(llcAddress)
  return {
    fee: getLLCStruct.fee.toString(),
    loanRate: getLLCStruct.loanrate.toString(),
  }
}

// calculate loan ratio to mint LPTs
export const loanRatioPerLPT = async (poolToken) => {
  const { SIGNER } = getProvider()
  const contract = new ethers.Contract(
    poolToken.address,
    UNISWAP_LPT_ABI,
    SIGNER
  )

  // parallely running ERC20 and LLC functions 🚀
  const [reserve, LPTTotalSupply, tokens, llc] = await Promise.all([
    contract.getReserves(),
    contract.totalSupply(),
    Promise.all([contract.token0(), contract.token1()]),
    getLLC(poolToken.llcAddress),
  ])

  const llcDetails = {
    loanRate: llc.loanRate,
    fee: llc.fee,
    loanRatioPerLPT: '',
  }

  const crDetails = {
    cr: null,
    currentLoan: null,
    LPTValue: null,
    minValue: null,
  }

  const reserveIndex =
    tokens[0].toLowerCase() === poolToken.stablecoin.toLowerCase() ? 0 : 1

  const stablecoinDecimal = await getDecimals(tokens[reserveIndex])
  let difference
  let totalValueInDai
  totalValueInDai = reserve[reserveIndex].toString() * 2
  // first case: tokenDecimal is smaller than 18
  // for stablecoins with less than 18 decimals
  if (stablecoinDecimal < '18' && stablecoinDecimal >= '0') {
    // calculate amount of decimals under 18
    difference = 18 - stablecoinDecimal
    totalValueInDai = totalValueInDai * 10 ** difference
  } else if (stablecoinDecimal > '18') {
    // caclulate amount of decimals over 18
    difference = stablecoinDecimal - 18
    // removes decimals to match 18
    totalValueInDai = totalValueInDai / 10 ** difference
  }

  console.log({ totalValueInDai, LPTTotalSupply, loanRate: llc.loanRate })
  llcDetails.loanRatioPerLPT =
    ((totalValueInDai / LPTTotalSupply) * llc.loanRate) / 1e6

  const currentLoan = await checkLoan(
    poolToken.llcAddress,
    poolToken.uToken.address
  )
  const LPTPrice = totalValueInDai / LPTTotalSupply
  const lockedLPT = await getLockedLPT(poolToken.llcAddress)

  const targetCR = await getCR(poolToken.llcAddress)
  crDetails.cr = targetCR
  crDetails.LPTValue = LPTPrice * lockedLPT.raw
  crDetails.currentLoan = currentLoan.rawBalance

  // calculate min value needed to unlock if c-ratio is below target CR
  const currentCR = (crDetails.LPTValue / crDetails.currentLoan) * 10000
  // condition: CR-target > CR-now
  if (crDetails.cr > currentCR) {
    crDetails.minValue =
      (crDetails.currentLoan - crDetails.LPTValue / (crDetails.cr / 10000)) /
      1e18
  } else {
    crDetails.minValue = 0
  }

  console.log({
    ...llcDetails,
    ...crDetails,
    currentCR,
    LPTPrice,
    targetCR: crDetails.cr.toString(),
  })

  return {
    ...llcDetails, // loanRate, fee, loanRatioPerLPT
    ...crDetails, // c-ratio, LPTValue, currentLoan, minValue
    currentCR,
    LPTPrice,
    lockedLPT,
  }
}
