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
  dai: '0xAFde04218D9B64CA8B83B3d2006b294176f7cE96',
  eth: '0x9e752025e3D3a3F11A7809D52bf9015664DD615f',
  liquidityPoolToken: '0x7ec314edb873a5f12bc854c5f3f57ef02b44d2c0',
  unboundDai: '0xAFde04218D9B64CA8B83B3d2006b294176f7cE96',
  unboundEth: '0x9e752025e3D3a3F11A7809D52bf9015664DD615f',
  liquidityLock: '0xee9a5129b7a913946B96ee76F67cd70EFb8Cc781',
  unboundStaking: '0x339004Ea6d1F74B94A905a314B52211f0DdeC00F',
  UNDUniswapPool: '0xa5c638db7a286b722406f03eaf5c8a8178927a19',
  uETHUniswapPool: '0x1ab39c83bab36c8ecbafba448748c50f5eb4db2a',
  pancakeRouter: '0xe0EA5CB7F0412e09f9F7f1e5E8E5dC9d739078B5',
  valuator: '0x44a0d3e0ef0dFF4d902fB8D7134df8a83042E483',
}
export const uToken = {
  UND: '0xFA2595b6e266D2Aeb2701A992251E93Dd387e1be',
}
// Chain ID
export const CHAIN_ID = 1666700000

// SAFU fund address
export const SAFU_FUND = '0xf493178109469c6a11D80497B67218735C2b44B7'

// Dev fund address
export const DEV_FUND = '0x2Fa2B98B091A5f641fa5dA4e5154F52250870235'

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
