import { ethers } from 'ethers'
import { UNBOUND_VALUATOR_ABI, contracts } from '~/constants'

const getLLC = async (llcAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  // get LLC details like feeRate and LTV
  const valuator = new ethers.Contract(
    contracts.valuator,
    UNBOUND_VALUATOR_ABI,
    signer
  )

  const getLLCStruct = await valuator.getLLCStruct(llcAddress)

  return {
    fee: getLLCStruct.fee.toString(),
    loanRate: getLLCStruct.loanrate.toString(),
  }
}

export { getLLC }
