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
  dai: '0xa6610F1ba3523352d5Da5FB2e25c0D8859da4007',
  eth: '0x15B984826Ecf47594a75170e47C5f5dB174d258e',
  liquidityPoolToken: '0x26d35673AF4501b744f80D3ECc159De6408F1bbD',
  unboundDai: '0x464BA425f82cd20AD4F8e6274978B0bebc562FAd',
  unboundEth: '0x9e752025e3D3a3F11A7809D52bf9015664DD615f',
  liquidityLock: '0xEf4F716F777DefD44300fdCF8893a98056Ed6e7f',
  unboundStaking: '0x339004Ea6d1F74B94A905a314B52211f0DdeC00F',
  UNDUniswapPool: '0xe0c4e7d305c2c7c6f6c7989098b4712013f808c1',
  uETHUniswapPool: '0x1ab39c83bab36c8ecbafba448748c50f5eb4db2a',
  pancakeRouter: '0xAa9B44e412bBFf4899020Af33C4285Bc5B8cAA8B',
  valuator: '0x877161A635e645c882288eB8BB68AAC38409d84F',
}
export const uToken = {
  UND: '0x464BA425f82cd20AD4F8e6274978B0bebc562FAd',
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
