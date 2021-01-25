/**
 * @info
 * - Calculates loan ratio and fee for minting.
 * - Calculates the uToken to be burned based on collatralization ratio.
 */

import { ethers } from 'ethers'
import { getDecimals } from './ERC20'
import { getProvider } from '~/plugins/web3provider'

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
  llcDetails.loanRatioPerLPT =
    ((totalValueInDai / LPTTotalSupply) * llc.loanRate) / 1e6
  const LPTPrice = (totalValueInDai / LPTTotalSupply).toFixed(4).slice(0, -1)

  return {
    ...llcDetails, // loanRate, fee, loanRatioPerLPT
    LPTPrice,
  }
}
