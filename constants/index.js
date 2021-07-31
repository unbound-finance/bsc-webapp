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
  dai: '0x8149383796Be8a788B6e89821BC2012890C6C074',
  eth: '0x961ba0F09960E037A62b2E34f369f5cB08494f70',
  liquidityPoolToken: '0x25ab0fa41dd67f8323d7f02b5f94a3824769eb3f',
  unboundDai: '0x4045f69cD2AfA168B2C81F467d38Acd4D98bcfe6',
  unboundEth: '0x9e752025e3D3a3F11A7809D52bf9015664DD615f',
  liquidityLock: '0x5A9c643C3d04FEe228faa64C787Da8505E39Ba87',
  unboundStaking: '0x339004Ea6d1F74B94A905a314B52211f0DdeC00F',
  UNDUniswapPool: '0x4dc5c2b346de93df66d5f73cda0725e296a09a75',
  uETHUniswapPool: '0x1ab39c83bab36c8ecbafba448748c50f5eb4db2a',
  pancakeRouter: '0x5846E20e4601584186c9fe54511D50e462A23bF7',
  valuator: '0x878987120CAe465fdEd23E7Af8919dd7bbea9BF4',
}
export const uToken = {
  UND: '0x4045f69cD2AfA168B2C81F467d38Acd4D98bcfe6',
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
