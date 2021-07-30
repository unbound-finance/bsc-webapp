import { ethers } from 'ethers'

export function getProvider() {
  try {
    const PROVIDER = new ethers.providers.Web3Provider(window.ethereum)
    const SIGNER = PROVIDER.getSigner()
    return { PROVIDER, SIGNER }
  } catch (error) {
    console.warn(error)
    return {}
  }
}

export default function (_, inject) {
  inject('getProvider', getProvider)
}
