import { uToken } from '~/constants'

export default [
  {
    name: 'UND',
    address: uToken.UND,
    icon: 'und.webp',
    lptAddress: '0xa5c638db7a286b722406f03eaf5c8a8178927a19',
    token: {
      name: 'DAI',
      exchange: 'Uniswap',
      address: '0x9CD539Ac8Dca5757efAc30Cd32da20CD955e0f8B',
      icon:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
    },
  },
  {
    name: 'uETH',
    address: '0xC692bF3B0525FdfCD52982075D22269de0BcA609',
    icon: 'uEth.svg',
    lptAddress: '0x1ab39c83bab36c8ecbafba448748c50f5eb4db2a',
    token: {
      name: 'ETH',
      exchange: 'Uniswap',
      address: '0x24Cc33eBd310f9cBd12fA3C8E72b56fF138CA434',
      icon: 'https://uniswap.info/static/media/eth.73dabb37.png',
    },
  },
]
