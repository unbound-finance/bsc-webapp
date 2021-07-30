import { uToken } from '~/constants'

export default [
  {
    name: 'ETH-DAI',
    exchange: 'Uniswap v2',
    category: 'ETH-Stablecoin',
    address: '0x7ec314edb873a5f12bc854c5f3f57ef02b44d2c0',
    llcAddress: '0xee9a5129b7a913946B96ee76F67cd70EFb8Cc781',
    oracleAddress: '0x10cDaF6363fd8789F7ea4321cc193E80dffA8766',
    uniswapAddress: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
    currencyOneLogo:
      'https://raw.githubusercontent.com/Uniswap/uniswap-interface/main/src/assets/images/ethereum-logo.png',
    currencyTwoLogo:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
    stablecoin: '0xAFde04218D9B64CA8B83B3d2006b294176f7cE96',
    uToken: {
      displayName: 'Unbound Dollar',
      address: uToken.UND,
      symbol: 'UND',
      icon: 'und.webp',
    },
  },
  // {
  //   name: 'BUSD-USDC',
  //   exchange: 'PancakeSwap',
  //   category: 'Stablecoins',
  //   address: '0x138136E466A586ccfDb3B5a8510332C3D61c6d0b',
  //   llcAddress: '0x2Ed817094da6E150f9E07cA908F94E4c48C28C2a',
  //   oracleAddress: '0xbf38202b309e929292c86Ab3abB77060a8372b8e',
  //   uniswapAddress: '0xae461ca67b15dc8dc81ce7615e0320da1a9ab8d5',
  //   currencyOneLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/BUSD-BD1/logo.png',
  //   currencyTwoLogo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
  //   stablecoin: '0x78299cff6dCd659DD038E0a0C01f8795ED9f74e7',
  //   uToken: {
  //     displayName: 'Unbound Dollar',
  //     address: uToken.UND,
  //     symbol: 'UND',
  //     icon: 'und.webp',
  //   },
  // },
  // {
  //   name: 'BUSD-USDT',
  //   exchange: 'PancakeSwap',
  //   category: 'Stablecoins',
  //   address: '0xd810Ca81306Ec87c73ad935F7334b2C2F6ce0171',
  //   llcAddress: '0x71C0Dc35307ee03409B80dEB7D21c33A4AbD8441',
  //   oracleAddress: '0x26f1731bB21B3308B1433962A5bb67C35AA3515B',
  //   uniswapAddress: '0x3041cbd36888becc7bbcbc0045e3b1f144466f5f',
  //   currencyOneLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/BUSD-BD1/logo.png',
  //   currencyTwoLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  //   stablecoin: '0xD105fABf3db502525b3277F24572A26204912CaF',
  //   uToken: {
  //     displayName: 'Unbound Dollar',
  //     address: uToken.UND,
  //     symbol: 'UND',
  //     icon: 'und.webp',
  //   },
  // },
  // {
  //   name: 'BUSD-DAI',
  //   exchange: 'PancakeSwap',
  //   category: 'Stablecoins',
  //   address: '0xf47aaEc9a32D84f7a0990Be064482FD8E3b22Dd9',
  //   llcAddress: '0xd9B3051627959589640718e40F3d311b7fd69392',
  //   oracleAddress: '0x5f618132E760Fc14BF39F6D47C0bC038eaf448c4',
  //   uniswapAddress: '0x3041cbd36888becc7bbcbc0045e3b1f144466f5f',
  //   currencyOneLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/BUSD-BD1/logo.png',
  //   currencyTwoLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  //   stablecoin: '0xBc1975906ACb85F31d57E125877a1bD1d09a329a',
  //   uToken: {
  //     displayName: 'Unbound Dollar',
  //     address: uToken.UND,
  //     symbol: 'UND',
  //     icon: 'und.webp',
  //   },
  // },
  // {
  //   name: 'DAI-USDC',
  //   exchange: 'PancakeSwap',
  //   category: 'Stablecoins',
  //   address: '0x9283F695Cd5ac9aC33f8C99e8208F864F91aCb89',
  //   llcAddress: '0x55639a2F6133c296d8733f3d14d0dc0C998C293A',
  //   oracleAddress: '0xe4bf6df7e224aCd89c6b249782f1960229ecB5FB',
  //   uniswapAddress: '0xae461ca67b15dc8dc81ce7615e0320da1a9ab8d5',
  //   currencyOneLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  //   currencyTwoLogo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
  //   stablecoin: '0xBc1975906ACb85F31d57E125877a1bD1d09a329a',
  //   uToken: {
  //     displayName: 'Unbound Dollar',
  //     address: uToken.UND,
  //     symbol: 'UND',
  //     icon: 'und.webp',
  //   },
  // },
  // {
  //   name: 'USDC-USDT',
  //   exchange: 'PancakeSwap',
  //   category: 'Stablecoins',
  //   address: '0xD2114bb17232644f572CF4E7d329F09B3Ec7363f',
  //   llcAddress: '0xb440bB59A8D7ECe4FF332794CF33dAd0854F697d',
  //   oracleAddress: '0xb440bB59A8D7ECe4FF332794CF33dAd0854F697d',
  //   uniswapAddress: '0x3041cbd36888becc7bbcbc0045e3b1f144466f5f',
  //   currencyOneLogo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
  //   currencyTwoLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  //   stablecoin: '0x78299cff6dCd659DD038E0a0C01f8795ED9f74e7',
  //   uToken: {
  //     displayName: 'Unbound Dollar',
  //     address: uToken.UND,
  //     symbol: 'UND',
  //     icon: 'und.webp',
  //   },
  // },
  // {
  //   name: 'ETH-DAI',
  //   exchange: 'PancakeSwap',
  //   category: 'ETH-Stablecoin',
  //   address: '0xac473048ac22d70d2f5838be037f405e4a9566e0',
  //   llcAddress: '0x8868Ec695022d313b1Ae2067DBC337919568e28d',
  //   oracleAddress: '0x8F50Cbc393fC76FEA965DF27a0EF4dBEb524FA40',
  //   uniswapAddress: '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11',
  //   currencyOneLogo:
  //     'https://raw.githubusercontent.com/Uniswap/uniswap-interface/main/src/assets/images/ethereum-logo.png',
  //   currencyTwoLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  //   stablecoin: '0xBc1975906ACb85F31d57E125877a1bD1d09a329a',
  //   uToken: {
  //     displayName: 'Unbound Dollar',
  //     address: uToken.UND,
  //     symbol: 'UND',
  //     icon: 'und.webp',
  //   },
  // },
  // {
  //   name: 'BNB-DAI',
  //   exchange: 'PancakeSwap',
  //   category: 'BNB-Stablecoin',
  //   address: '0x19D4aB103eD6fd0D81E75427fa07EdCDDE8fcd89',
  //   llcAddress: '0x64AE60E7A183AE7161141F0Ed4d8eBcAbb33f784',
  //   oracleAddress: '0x700CeBdF715431c68a49f68Cd8cE1cc2a8c184D5',
  //   uniswapAddress: '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11',
  //   currencyOneLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB8c77482e45F1F44dE1745F52C74426C631bDD52/logo.png',
  //   currencyTwoLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  //   stablecoin: '0xBc1975906ACb85F31d57E125877a1bD1d09a329a',
  //   uToken: {
  //     displayName: 'Unbound Dollar',
  //     address: uToken.UND,
  //     symbol: 'UND',
  //     icon: 'und.webp',
  //   },
  // },
  // {
  //   name: 'BNB-USDT',
  //   exchange: 'PancakeSwap',
  //   category: 'BNB-Stablecoin',
  //   address: '0x93A88114FD9e5bd25AB4b9017E7891DcC4B06d0c',
  //   llcAddress: '0xbe4432aC10d3E3e4757a0d2813E5db747A802E40',
  //   oracleAddress: '0x3c9334Ce2E096dB5ff480215b3499886DE231a50',
  //   uniswapAddress: '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11',
  //   currencyOneLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB8c77482e45F1F44dE1745F52C74426C631bDD52/logo.png',
  //   currencyTwoLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  //   stablecoin: '0xD105fABf3db502525b3277F24572A26204912CaF',
  //   uToken: {
  //     displayName: 'Unbound Dollar',
  //     address: uToken.UND,
  //     symbol: 'UND',
  //     icon: 'und.webp',
  //   },
  // },
  // {
  //   name: 'BNB-USDC',
  //   exchange: 'PancakeSwap',
  //   category: 'BNB-Stablecoin',
  //   address: '0xe7Fd4AbfcaF6323e77c5072d1c12947fE9A21b25',
  //   llcAddress: '0xA5B7F1B7D588A9a6886F1F8F3e325072663d779d',
  //   oracleAddress: '0xdd1a51C30c32dF9312aa859B6869A4F34Eba308e',
  //   uniswapAddress: '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11',
  //   currencyOneLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB8c77482e45F1F44dE1745F52C74426C631bDD52/logo.png',
  //   currencyTwoLogo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
  //   stablecoin: '0x78299cff6dCd659DD038E0a0C01f8795ED9f74e7',
  //   uToken: {
  //     displayName: 'Unbound Dollar',
  //     address: uToken.UND,
  //     symbol: 'UND',
  //     icon: 'und.webp',
  //   },
  // },
  // {
  //   name: 'ETH-USDT',
  //   exchange: 'Uniswap v2',
  //   category: 'ETH-Stablecoin',
  //   address: '0xa338ae6943c03c48f6fb6c7bff012d9206c28558',
  //   llcAddress: '0xa613DC9eBCf5B96E797e9e0D2E7e940b0DA44967',
  //   oracleAddress: '0x08a2deC7B988F5A9e2206f8C575F9e7fD55649D7',
  //   uniswapAddress: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
  //   currencyOneLogo: 'https://uniswap.info/static/media/eth.73dabb37.png',
  //   currencyTwoLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  //   stablecoin: '0xc1d7957dDdA47b0B50C57cfD2A8cc34F655E77c1',
  //   uToken: {
  //     displayName: 'Unbound Dollar',
  //     address: uToken.UND,
  //     symbol: 'UND',
  //     icon: 'und.webp',
  //   },
  // },
  // {
  //   name: 'ETH-USDC',
  //   exchange: 'Uniswap v2',
  //   category: 'ETH-Stablecoin',
  //   address: '0xd9628d193fd57fe1222b5c533f40d60fc0275c78',
  //   llcAddress: '0x0fC85f81D826F35E68c05C9dcd97Cd55B5789F11',
  //   oracleAddress: '0xB5a74715f8247B62A67b6B7fC1E7eB6734EC253e',
  //   uniswapAddress: '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc',
  //   currencyOneLogo: 'https://uniswap.info/static/media/eth.73dabb37.png',
  //   currencyTwoLogo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
  //   stablecoin: '0xFB841B3f7a33999692e498Cac36D358632de93e8',
  //   uToken: {
  //     displayName: 'Unbound Dollar',
  //     address: uToken.UND,
  //     symbol: 'UND',
  //     icon: 'und.webp',
  //   },
  // },
  // {
  //   name: 'ENJ-USDT',
  //   exchange: 'Uniswap v2',
  //   category: 'ERC20-Stablecoin',
  //   address: '0xe1fdf0958759b8023ae6234d795f9bb95f1e685e',
  //   llcAddress: '0x365E53365E0Fa448b6feE5Aa00157394C57A5DDd',
  //   oracleAddress: '0x9122de2D6c736edC9E3d86B790D4Df53856f2126',
  //   uniswapAddress: '0xd677b2d0dd5c8f71ce22ccdb700dffc6558fd1d1',
  //   currencyOneLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c/logo.png',
  //   currencyTwoLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  //   stablecoin: '0xc1d7957dDdA47b0B50C57cfD2A8cc34F655E77c1',
  //   uToken: {
  //     displayName: 'Unbound Dollar',
  //     address: '0xa729D5cA5BcE0d275B69728881f5bB86511EA70B',
  //     symbol: 'UND',
  //     icon: 'und.webp',
  //   },
  // },
  // {
  //   name: 'TOMOE-USDT',
  //   exchange: 'Uniswap',
  //   category: 'ERC20-Stablecoin',
  //   address: '0x2142eb92e8d346893bbbd3ca713d2234bf7431ba',
  //   llcAddress: '0x7A6Fa5464953990B87285Afa05F097D4B8C910D1',
  //   uniswapAddress: '',
  //   currencyOneLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x05D3606d5c81EB9b7B18530995eC9B29da05FaBa/logo.png',
  //   currencyTwoLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  //   stablecoin: '0xc1d7957dDdA47b0B50C57cfD2A8cc34F655E77c1',
  //   uToken: {
  //     displayName: 'Unbound Dollar',
  //     address: '0xa729D5cA5BcE0d275B69728881f5bB86511EA70B',
  //     symbol: 'UND',
  //     icon: 'und.webp',
  //   },
  // },
  // {
  //   name: 'FRONT-UND',
  //   exchange: 'Uniswap',
  //   category: 'ERC20-Stablecoin',
  //   address: '0xfef9e7747985661670dfc8ab994d12453a3506b4',
  //   llcAddress: '0xEbaA212a9D645b1fd37015d6c3d5d94954732C32',
  //   uniswapAddress: '',
  //   currencyOneLogo:
  //     'https://assets.coingecko.com/coins/images/12479/large/frontier_logo.png',
  //   currencyTwoLogo: 'https://i.ibb.co/5RqCxhD/unbound-logo.png',
  //   stablecoin: '0xa729D5cA5BcE0d275B69728881f5bB86511EA70B',
  //   uToken: {
  //     displayName: 'Unbound Dollar',
  //     address: '0xa729D5cA5BcE0d275B69728881f5bB86511EA70B',
  //     symbol: 'UND',
  //     icon: 'und.webp',
  //   },
  // },
  // {
  //   name: 'WBTC-ETH',
  //   exchange: 'Uniswap',
  //   category: 'ERC20-ETH',
  //   address: '0x7205d1091a9be1d68d11fb38e3b00ced886dfba5',
  //   llcAddress: '0xD295B3312Fc30E245D076710ba20d4975d156d67',
  //   uniswapAddress: '0xbb2b8038a1640196fbe3e38816f3e67cba72d940',
  //   currencyOneLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
  //   currencyTwoLogo: 'https://uniswap.info/static/media/eth.73dabb37.png',
  //   stablecoin: '0x24Cc33eBd310f9cBd12fA3C8E72b56fF138CA434',
  //   uToken: {
  //     displayName: 'Unbound ETH',
  //     address: '0xC692bF3B0525FdfCD52982075D22269de0BcA609',
  //     symbol: 'uETH',
  //     icon: 'uEth.svg',
  //   },
  // },
  // {
  //   name: 'UNI-ETH',
  //   exchange: 'Uniswap',
  //   category: 'ERC20-ETH',
  //   address: '0x70a14516e7178e3e16ad0f58b3aed855acbed1dd',
  //   llcAddress: '0x769f3881664976F56d96FbC358c3D50ff208a317',
  //   uniswapAddress: '0xd3d2e2692501a5c9ca623199d38826e513033a17',
  //   currencyOneLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png',
  //   currencyTwoLogo: 'https://uniswap.info/static/media/eth.73dabb37.png',
  //   stablecoin: '0x24Cc33eBd310f9cBd12fA3C8E72b56fF138CA434',
  //   uToken: {
  //     displayName: 'Unbound ETH',
  //     address: '0xC692bF3B0525FdfCD52982075D22269de0BcA609',
  //     symbol: 'uETH',
  //     icon: 'uEth.svg',
  //   },
  // },
  // {
  //   name: 'LINK-ETH',
  //   exchange: 'Uniswap',
  //   category: 'ERC20-ETH',
  //   address: '0xe354c712105855705cf0b60feeac03c46da0c115',
  //   llcAddress: '0x64c0FEfd3A4fAeA31Cd46c0034ACca1217ce2561',
  //   uniswapAddress: '0xa2107fa5b38d9bbd2c461d6edf11b11a50f6b974',
  //   currencyOneLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png',
  //   currencyTwoLogo: 'https://uniswap.info/static/media/eth.73dabb37.png',
  //   stablecoin: '0x24Cc33eBd310f9cBd12fA3C8E72b56fF138CA434',
  //   uToken: {
  //     displayName: 'Unbound ETH',
  //     address: '0xC692bF3B0525FdfCD52982075D22269de0BcA609',
  //     symbol: 'uETH',
  //     icon: 'uEth.svg',
  //   },
  // },
  // {
  //   name: 'TSLA-UND',
  //   displayName: 'Tesla',
  //   exchange: 'Uniswap',
  //   category: 'UND Pool',
  //   address: '0xa26a772eed0cfe646eaac98b4212042953418aaa',
  //   llcAddress: '0x0Cd83ffcA83f6eEFFa4c8C454783EDeC3eC2e6B8',
  //   uniswapAddress: '',
  //   currencyOneLogo:
  //     'https://cdn.freebiesupply.com/logos/large/2x/tesla-motors-logo-png-transparent.png',
  //   currencyTwoLogo: 'https://gamma.unbound.finance/_nuxt/img/und.e52ca44.webp',
  //   stablecoin: '0xa729D5cA5BcE0d275B69728881f5bB86511EA70B',
  //   uToken: {
  //     displayName: 'Unbound Dollar',
  //     address: '0xa729D5cA5BcE0d275B69728881f5bB86511EA70B',
  //     symbol: 'UND',
  //     icon: 'und.webp',
  //   },
  // },
  // {
  //   name: 'ETH-USDC',
  //   exchange: 'Uniswap',
  //   address: '0xb7c32567185194953d81292a55ebfdae55bfa55b',
  //   llcAddress: '0xde980605bEb79D311090Ea202063a97420268976',
  //   currencyOneLogo: 'https://uniswap.info/static/media/eth.73dabb37.png',
  //   currencyTwoLogo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
  //   stablecoin: '0x7fEFAA2ABed3212974009CF5cD500b5c5C872bF1',
  //   uToken: {
  //     address: '0x96AE296471296B29694881815E15F33b9200C7f2',
  //     symbol: 'UND',
  //     icon: 'und.webp',
  //   },
  // },
  // ~{
  //   name: 'ETH-USDT',
  //   exchange: 'Uniswap',
  //   address: '0x1df2d569e7d9864b74c9ad366469b3e905ac918c',
  //   llcAddress: '0x2909Da870BA5603f5B5Aa6890D859CbB09fCf5D9',
  //   currencyOneLogo: 'https://uniswap.info/static/media/eth.73dabb37.png',
  //   currencyTwoLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  //   stablecoin: '0x72136837e180CB468B5C1283d7Eb573F7c9C0a88',
  //   uToken: {
  //     address: '0x96AE296471296B29694881815E15F33b9200C7f2',
  //     symbol: 'UND',
  //     icon: 'und.webp',
  //   },
  // },
  // {
  //   name: 'USDC-USDT',
  //   exchange: 'Uniswap',
  //   address: '0xf111398f0f6e6010b17ba143d210a61550f06150',
  //   llcAddress: '0x5F7c390726a9862AE437Dc2Ef87C178986711D35',
  //   currencyOneLogo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
  //   currencyTwoLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  //   stablecoin: '0x7fEFAA2ABed3212974009CF5cD500b5c5C872bF1',
  //   uToken: {
  //     address: '0x96AE296471296B29694881815E15F33b9200C7f2',
  //     symbol: 'UND',
  //     icon: 'und.webp',
  //   },
  // },
  // {
  //   name: 'LINK-DAI',
  //   exchange: 'Uniswap',
  //   address: '0xb9d8eeb6e5853f35900835728bd8f06c1af3ef76',
  //   llcAddress: '0xDBC6674b5E3553Ba2376bAA1DEAADD84155c5d93',
  //   currencyOneLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png',
  //   currencyTwoLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  //   stablecoin: '0x657ef3d976542252ee0eD8dA94D0e1a5926A700F',
  //   uToken: {
  //     address: '0x96AE296471296B29694881815E15F33b9200C7f2',
  //     symbol: 'UND',
  //     icon: 'und.webp',
  //   },
  // },
  // {
  //   name: 'TOMOE-USDT',
  //   exchange: 'Uniswap',
  //   address: '0x3bf0e5bcd1b48dec99a61fc058a965c3f9c47a73',
  //   llcAddress: '0xbF6acC812Ec285b43d94AB3c0454394A753c3393',
  //   currencyOneLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x05D3606d5c81EB9b7B18530995eC9B29da05FaBa/logo.png',
  //   currencyTwoLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  //   stablecoin: '0x72136837e180CB468B5C1283d7Eb573F7c9C0a88',
  //   uToken: {
  //     address: '0x96AE296471296B29694881815E15F33b9200C7f2',
  //     symbol: 'UND',
  //     icon: 'und.webp',
  //   },
  // },
  // {
  //   name: 'ENJ-USDT',
  //   exchange: 'Uniswap',
  //   address: '0xf6e2091b70d4642674fc4ff44f1cdac52699cf91',
  //   llcAddress: '0x7ccf24be964c3b66048e8b53668d56d33a1a4db5',
  //   currencyOneLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c/logo.png',
  //   currencyTwoLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  //   stablecoin: '0x72136837e180CB468B5C1283d7Eb573F7c9C0a88',
  //   uToken: {
  //     address: '0x96AE296471296B29694881815E15F33b9200C7f2',
  //     symbol: 'UND',
  //     icon: 'und.webp',
  //   },
  // },
  // {
  //   name: 'ENJ-UND',
  //   exchange: 'Uniswap',
  //   address: '0x136bf0b90ea8fb45f7a6bf35ac22a3bac067e264',
  //   llcAddress: '0xF0Ec90d37ABcB7F928f1947367E58042E7B0e28d',
  //   currencyOneLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c/logo.png',
  //   currencyTwoLogo: 'https://beta.unbound.finance/_nuxt/img/und.e52ca44.webp',
  //   stablecoin: '0x09D9a16a6083a75aEfF476BD021A50aA683A29d1',
  //   uToken: {
  //     address: '0x96AE296471296B29694881815E15F33b9200C7f2',
  //     symbol: 'UND',
  //     icon: 'und.webp',
  //   },
  // },
  // {
  //   name: 'TOMO-UND',
  //   exchange: 'Uniswap',
  //   address: '0x1060abf5954c27ac553b37151a6a7608a3f6adb7',
  //   llcAddress: '0xC8b98e60eC524827B85BBC62dB64B3aFaC708185',
  //   currencyOneLogo:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x05D3606d5c81EB9b7B18530995eC9B29da05FaBa/logo.png',
  //   currencyTwoLogo: 'https://beta.unbound.finance/_nuxt/img/und.e52ca44.webp',
  //   stablecoin: '0x09D9a16a6083a75aEfF476BD021A50aA683A29d1',
  //   uToken: {
  //     address: '0xc266314a87744E94E6F2FC1130d6C5E43FaB0E75',
  //     symbol: 'UND',
  //     icon: 'und.webp',
  //   },
  // },
]
