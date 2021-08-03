// ABIs
import ERC20_ABI from './abis/ERC20'
import UNBOUND_DOLLAR_ABI from './abis/UnboundDollar'
import UNBOUND_FAUCET_ABI from './abis/UnboundFaucet'
import UNBOUND_LLC_ABI from './abis/UnboundLLCABI'
import UNBOUND_STAKING_ABI from './abis/UnboundStaking'
import UNBOUND_VALUATOR_ABI from './abis/UnboundValuator'
import UNISWAP_LPT_ABI from './abis/UniswapLPTABI'
import UNISWAP_ROUTER_ABI from './abis/UniswapRouter'
import ORACLE_ABI from './abis/Oracle'

export const contracts = {
  dai: '0x10895Ca6157CCF0d6516dd365A4E9f53D92689Ff',
  eth: '0x8A42863f8C880CBE257a0bAd503A9EBDA43ab411',
  liquidityPoolToken: '0x81c82a8Cf97085925a56B0Bee1A8bD315A6445D9',
  unboundDai: '0x10895Ca6157CCF0d6516dd365A4E9f53D92689Ff',
  unboundEth: '0xC692bF3B0525FdfCD52982075D22269de0BcA609',
  liquidityLock: '0x94406511ab87d4d15B6a3bE179AA37f324499A08',
  unboundStaking: '0x339004Ea6d1F74B94A905a314B52211f0DdeC00F',
  UNDUniswapPool: '0xa5c638db7a286b722406f03eaf5c8a8178927a19',
  uETHUniswapPool: '0x1ab39c83bab36c8ecbafba448748c50f5eb4db2a',
  pancakeRouter: '0xa7F3bb34d5dBD1d32166fb2f9FBE37DCE208E566',
  valuator: '0xfFd0Fd5C432F8aBe976Df1ea390da68ff689d29c',
}
export const uToken = {
  UND: '0x041Ae7a3BfF7095B158d998c63727cE7742A6C61',
}
// Chain ID
export const CHAIN_ID = 80001

// SAFU fund address
export const SAFU_FUND = '0xcc729a114aa8f572971d4d85B21e661E265Df20C'

// Dev fund address
export const DEV_FUND = '0xeA6439DdaB48bF67e8e067b124Cf16d5bFBA8CDB'

// Faucet address
export const FAUCET = '0x7FCc135CA31746aeed9a32bC7314347f6ec039C2'

// Etherscan API host (kovan)
export const ETHERSCAN_HOST = 'https://api-kovan.etherscan.io/api'

export {
  ERC20_ABI,
  UNBOUND_DOLLAR_ABI,
  UNBOUND_FAUCET_ABI,
  UNBOUND_LLC_ABI,
  UNISWAP_LPT_ABI,
  UNBOUND_STAKING_ABI,
  UNBOUND_VALUATOR_ABI,
  UNISWAP_ROUTER_ABI,
  ORACLE_ABI,
}
