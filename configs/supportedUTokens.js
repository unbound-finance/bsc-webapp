import { uToken } from '~/constants'

export default [
  {
    name: 'UND',
    address: uToken.UND,
    icon: 'und.webp',
    lptAddress: '0x5CCfA024bddF529885f1EeE52C07ccDB5546e9B3',
    token: {
      name: 'DAI',
      exchange: 'Uniswap',
      address: '0xb4b085E895396a076e784F148949c309cCAB7792',
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
