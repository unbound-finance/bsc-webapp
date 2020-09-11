<template>
  <div>
    <div class="flex flex-col items-center w-full py-8 space-y-6 px-4">
      <div class="flex w-full items-center justify-between">
        <nuxt-link to="/">
          <button class="focus:outline-none">
            <i
              class="fas fa-chevron-left text-gray-900 dark:text-white text-lg"
            ></i>
          </button>
        </nuxt-link>
        <p class="text-center font-medium dark:text-white text-lg">Mint</p>
        <button class="focus:outline-none">
          <i class="far fa-question-circle text-gray-600 text-lg"></i>
        </button>
      </div>
      <div
        class="w-full p-2 px-4 border border-gray-200 dark:border-gray-700 rounded-lg"
      >
        <p class="text-sm text-gray-700 font-medium">Supply</p>
        <form class="w-full max-w-sm">
          <div class="flex items-center py-2">
            <input
              v-model="poolTokenInput"
              class="appearance-none bg-transparent text-2xl text-gray-800 dark:text-gray-300 font-medium w-full mr-3 py-1 leading-tight focus:outline-none"
              type="number"
              placeholder="0.0"
            />

            <button
              v-if="selectedPoolToken"
              class="flex-shrink-0 text-light-primary dark:text-white bg-light-primary dark:bg-dark-primary bg-opacity-25 hover:bg-opacity-100 hover:text-white transition-all duration-200 text-sm font-medium py-1 px-4 rounded flex items-center space-x-2 focus:outline-none"
              type="button"
              @click="ui.showDialog = !ui.showDialog"
            >
              <span>{{ selectedPoolToken.name }}</span>
              <i class="fas fa-chevron-down pt-1"></i>
            </button>
            <button
              v-else
              class="flex-shrink-0 text-light-primary dark:text-white bg-light-primary dark:bg-dark-primary bg-opacity-25 hover:bg-opacity-100 hover:text-white transition-all duration-200 text-sm font-medium py-1 px-4 rounded flex items-center space-x-2 focus:outline-none"
              type="button"
              @click="ui.showDialog = !ui.showDialog"
            >
              <span>Select Pool Token</span>
              <i class="fas fa-chevron-down pt-1"></i>
            </button>
          </div>
        </form>
      </div>

      <i class="fas fa-arrow-down text-gray-800 dark:text-gray-600"></i>

      <div
        class="w-full p-2 px-4 border border-gray-200 dark:border-gray-700 rounded-lg"
      >
        <p class="text-sm text-gray-700 font-medium">Mint</p>
        <form class="w-full max-w-sm">
          <div class="flex items-center py-2">
            <input
              v-model="udaiOutput"
              class="appearance-none bg-transparent text-2xl text-gray-800 dark:text-gray-300 font-medium w-full mr-3 py-1 leading-tight focus:outline-none"
              type="number"
              placeholder="0.0"
              readonly
            />
            <button
              class="flex-shrink-0 text-light-primary dark:text-white bg-light-primary dark:bg-dark-primary bg-opacity-25 hover:bg-opacity-100 hover:text-white transition-all duration-200 text-sm font-medium py-1 px-4 rounded flex items-center space-x-2 focus:outline-none"
              type="button"
            >
              <span>UDAI</span>
              <!-- <i class="fas fa-chevron-down pt-1"></i> -->
            </button>
          </div>
        </form>
      </div>

      <button
        class="bg-light-primary text-light-primary font-medium dark:bg-dark-primary bg-opacity-25 dark:text-white w-full py-2 rounded-md focus:outline-none"
        @click="mint"
      >
        Mint
      </button>
    </div>
    <Modal :show="ui.showDialog" @close="ui.showDialog = false">
      <template>
        <div class="flex flex-col space-y-4">
          <div class="flex justify-between items-center">
            <p class="font-medium dark:text-white">Select Pool Token</p>
            <button
              type="button"
              class="focus:outline-none"
              @click="ui.showDialog = false"
            >
              <i class="fas fa-times text-gray-900 dark:text-gray-500"></i>
            </button>
          </div>

          <div v-for="(poolToken, index) in supportedPoolTokens" :key="index">
            <a @click="selectPoolToken(poolToken)">
              <div
                class="h-40 w-1/2 border border-gray-300 dark:border-gray-700 p-8 rounded-md flex flex-col items-center justify-center hover:shadow-md cursor-pointer"
              >
                <img src="~/assets/icons/crypto/dai.svg" width="40" alt="Dai" />
                <p class="font-medium text-center pt-2 dark:text-white">
                  {{ poolToken.name }}
                </p>
                <p class="text-sm text-center dark:text-white">
                  Balance: {{ balance }}
                </p>
                <p class="text-sm text-center dark:text-white">
                  {{ poolToken.exchange }}
                </p>
              </div>
            </a>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/_app/Modal'
import { ethers } from 'ethers'
import Web3 from 'web3'

import ERC20ABI from '~/configs/abi/ERC20'
import UniswapLPTABI from '~/configs/abi/UniswapLPTABI'
import UnboundLLCABI from '~/configs/abi/UnboundLLCABI'

import signature from '~/mixins/signature'

const provider = new ethers.providers.Web3Provider(window.ethereum)

const config = {
  dai: '0x5124d2A8e3A02f906d86803D703FD6CcCf492EF8',
  eth: '0x6468Cb5b76200428A514125BfA5a08Cf2E4b7f9D',
  lpToken: '0x1443398Aa8E16E0F289B12ddCf666eeC4215bF46',
  uDai: '0x88b2d1c22f5bace62dccd488c07872c6f9c486f5',
  llc: '0x769fd7De5d4E6e8fc22800Acc3Ad5236B5847332',
}

export default {
  components: { Modal },
  data() {
    return {
      ui: {
        showDialog: false,
      },
      selectedPoolToken: '',
      selectedMintToken: '',
      balance: '--.--',
      poolTokenInput: '1',
      loanRatio: {
        totalDai: '',
        totalLPTokens: '',
        rating: '50',
      },
      supportedPoolTokens: [
        {
          name: 'UNI-ETH/DAI',
          exchange: 'Uniswap',
          address: config.lpToken,
          currencyOneLogo:
            'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
          currencyTwoLogo: 'https://uniswap.info/static/media/eth.73dabb37.png',
        },
      ],
    }
  },

  computed: {
    udaiOutput() {
      // Liquidity pool token value in dai
      const LPTValueInDai =
        (this.loanRatio.totalDai * this.poolTokenInput) /
        this.loanRatio.totalLPTokens
      // Since, we're supporting AAA tokens at the moment we'll hardcoding the AAA rate: 50%
      const loanAmount = (LPTValueInDai * 50) / 100
      return loanAmount - (loanAmount * 0.25) / 100
    },
  },

  mounted() {
    this.getBalanceOfToken(this.supportedPoolTokens[0].address)
    this.calculateLoanRatio()
    // this.mint()
  },

  methods: {
    selectPoolToken(poolToken) {
      this.selectedPoolToken = poolToken
      this.ui.showDialog = false
    },
    async getPoolTokensOfUser() {},
    async getBalanceOfToken(tokenAddress) {
      const signer = provider.getSigner()
      const contract = await new ethers.Contract(tokenAddress, ERC20ABI, signer)
      const userAddress = signer.getAddress()
      const getBalance = await contract.balanceOf(userAddress)
      const balance = ethers.utils.formaether(getBalance.toString())
      this.balance = balance
    },
    async calculateLoanRatio() {
      const signer = provider.getSigner()
      const uniswapLptAddress = config.lpToken
      const contract = await new ethers.Contract(
        uniswapLptAddress,
        UniswapLPTABI,
        signer
      )
      const reserve = await contract.getReserves()
      const totalLPTokens = await contract.totalSupply()
      // total value locked in the smart contract in terms of Dai
      const totalDai = reserve[0].toString() * 2
      this.loanRatio.totalDai = totalDai
      this.loanRatio.totalLPTokens = totalLPTokens.toString()
    },

    async mint() {
      const mmSigner = provider.getSigner()
      const nonce = await signature.methods.getNonce(config.llc)
      const sig = await signature.methods.getEIP712Signature(
        '0x464499A3D0a578448f4F4B6e223A97497cFDB8d6',
        nonce.toString()
      )
      console.log(sig)

      const web3 = new Web3(window.ethereum)
      const signer = await web3.eth.getAccounts()

      web3.currentProvider.sendAsync(
        {
          method: 'eth_signTypedData_v3',
          params: [signer[0], sig],
          from: signer[0],
        },
        async (err, signature) => {
          if (err || signature.error) {
            return console.error(signature)
          }
          const signed = signature.result

          const splitSig = ethers.utils.splitSignature(signed)

          console.log(splitSig, mmSigner, UnboundLLCABI)

          const contract = await new ethers.Contract(
            config.llc,
            UnboundLLCABI,
            mmSigner
          )

          const LPTAmt = '100'
          const tokenNum = '0'
          const extraTime = '1599563554'

          console.log(LPTAmt, tokenNum, extraTime, contract)

          console.log(window.ethereum)

          try {
            const mintUDai = await contract.lockLPT(
              LPTAmt,
              tokenNum,
              extraTime,
              splitSig.v,
              splitSig.r,
              splitSig.s
            )
            console.log(mintUDai)
          } catch (error) {
            console.log(error)
          }
        }
      )

      // const signedData = await signer.signMessage(sig)
      // console.log(signedData)
      // const splitSig = ethers.utils.splitSignature(signedData)

      // const contract = await new ethers.Contract(
      //   '0x62Aa6b3f266f38bf4774c503b022fD1709CAd4F3',
      //   UnboundLLCABI,
      //   signer
      // )

      // const LPTAmt = 1
      // const tokenNum = 0
      // const extraTime = 1599563554

      // console.log(LPTAmt, tokenNum, extraTime, contract)

      // console.log(window.ethereum)

      // try {
      //   provider.send({
      //     method: 'eth_signTypedData_v3',
      //     params: [signer, sig],
      //     from: signer,
      //   })

      //   // const mintUDai = await contract.lockLPT(
      //   //   LPTAmt,
      //   //   tokenNum,
      //   //   extraTime,
      //   //   splitSig.v,
      //   //   splitSig.r,
      //   //   splitSig.s
      //   // )
      // } catch (error) {
      //   console.log(error)
      // }
    },
  },
}
</script>

<style></style>
