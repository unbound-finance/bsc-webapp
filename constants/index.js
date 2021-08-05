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
  dai: '0xb4b085E895396a076e784F148949c309cCAB7792',
  eth: '0x9187BEF12f16E7B40E0446f4cD7821e68149223f',
  liquidityPoolToken: '0x6dBf98C35ad5f51E538270C6F48acB5A80b2E4Ff',
  unboundDai: '0xE30e3BaC7123c99a6B927b551368f6b9d95Be7FC',
  unboundEth: '0xC692bF3B0525FdfCD52982075D22269de0BcA609',
  liquidityLock: '0x816101D8eb1860512a0d79820AE0E432155F3171',
  unboundStaking: '0x339004Ea6d1F74B94A905a314B52211f0DdeC00F',
  UNDUniswapPool: '0xa5c638db7a286b722406f03eaf5c8a8178927a19',
  uETHUniswapPool: '0x1ab39c83bab36c8ecbafba448748c50f5eb4db2a',
  pancakeRouter: '0xcfCd8D4d37C4a7F9632d0C729e640ba69F1eF5B3',
  valuator: '0xDE26455c5728912e80438f77BA51A4d370a65ED2',
}
export const uToken = {
  UND: '0xE30e3BaC7123c99a6B927b551368f6b9d95Be7FC',
}
// Chain ID
export const CHAIN_ID = 80001

// SAFU fund address
export const SAFU_FUND = '0xf493178109469c6a11D80497B67218735C2b44B7'

// Dev fund address
export const DEV_FUND = '0x2Fa2B98B091A5f641fa5dA4e5154F52250870235'

// Faucet address
export const FAUCET = '0x455a230341Fa33F6a6a17f9bd3141C641cB4950a'

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
