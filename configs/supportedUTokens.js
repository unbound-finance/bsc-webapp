import { uToken } from '~/constants'

export default [
  {
    name: 'UND',
    address: uToken.UND,
    icon: 'und.webp',
    lptAddress: '0xe0c4e7d305c2c7c6f6c7989098b4712013f808c1',
    token: {
      name: 'DAI',
      exchange: 'Uniswap',
      address: '0xa6610F1ba3523352d5Da5FB2e25c0D8859da4007',
      icon:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
    },
  },
  // {
  //   name: 'uETH',
  //   address: '0xC692bF3B0525FdfCD52982075D22269de0BcA609',
  //   icon: 'uEth.svg',
  //   lptAddress: '0x1ab39c83bab36c8ecbafba448748c50f5eb4db2a',
  //   token: {
  //     name: 'ETH',
  //     exchange: 'Uniswap',
  //     address: '0x24Cc33eBd310f9cBd12fA3C8E72b56fF138CA434',
  //     icon: 'https://uniswap.info/static/media/eth.73dabb37.png',
  //   },
  // },
]
