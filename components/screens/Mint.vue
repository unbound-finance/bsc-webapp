<template>
  <div>
    <div class="flex flex-col items-center w-full py-2 space-y-4 px-4">
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

      <p
        v-if="!selectedPoolToken"
        class="text-center border-1 rounded-full px-8 bg-opacity-25 text-light-primary dark:text-white text-gray-600"
      >
        Please select pool token you want to stake
      </p>
      <div
        class="w-full p-2 px-4 border border-gray-200 dark:border-gray-700 rounded-lg"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-700 font-medium">Supply</p>
          <p v-if="selectedPoolToken" class="text-gray-600 text-sm">
            Balance: {{ balance }}
          </p>
        </div>
        <form class="w-full max-w-sm">
          <div class="flex items-center py-2">
            <input
              v-model="liquidityPoolTokenAmount"
              class="appearance-none bg-transparent text-2xl text-gray-800 dark:text-gray-300 font-medium w-full mr-3 py-1 leading-tight focus:outline-none"
              type="number"
              placeholder="0.0"
              :disabled="!selectedPoolToken"
            />

            <button
              v-if="selectedPoolToken"
              type="button"
              class="px-1 mx-2 text-sm rounded border border-light-primary dark:border-dark-primary bg-opacity-25 text-light-primary dark:text-white focus:outline-none"
              @click="setInputMax"
            >
              Max
            </button>
            <button
              v-if="selectedPoolToken"
              class="flex-shrink-0 dark:text-white transition-all duration-200 text-sm font-medium py-1 rounded flex items-center space-x-2 focus:outline-none"
              type="button"
              @click="ui.showDialog = !ui.showDialog"
            >
              <img src="~/assets/pool-tokens/eth-dai.svg" width="24" alt="" />
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

      <!-- Show fees -->
      <div
        v-if="liquidityPoolTokenAmount"
        class="bg-gray-300 dark:bg-gray-800 rounded-lg w-full border border-gray-300 dark:border-gray-800"
      >
        <p
          class="text-gray-800 dark:text-gray-400 font-medium text-sm mx-4 my-2"
        >
          Fees
        </p>
        <div class="bg-white dark:bg-dark-bg rounded-lg p-4">
          <div class="flex flex-col space-y-1">
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-600">Minting Fees</p>
              <p class="font-medium text-sm dark:text-white">0.25%</p>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-600">Funding Rate</p>
              <p class="font-medium text-sm dark:text-white">50%</p>
            </div>
          </div>
        </div>
      </div>

      <button
        v-if="isWalletConnected"
        class="font-medium w-full py-2 rounded-md focus:outline-none"
        :class="[
          !liquidityPoolTokenAmount ? getDisabledClass : getActiveClass,
          liquidityPoolTokenAmount > balance
            ? getDisabledClass
            : getActiveClass,
        ]"
        :disabled="shouldDisable"
        @click="ui.showConfirmation = true"
      >
        <span v-if="!liquidityPoolTokenAmount">Enter an amount</span>
        <span v-else-if="liquidityPoolTokenAmount > balance"
          >Insufficient Balance</span
        >
        <span v-else>Mint</span>
      </button>

      <ConnectWalletBtn v-else class="w-full" />
    </div>

    <!-- Select LP Tokens Modal -->
    <Modal v-model="ui.showDialog">
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
                class="w-full flex items-center justify-between cursor-pointer hover:text-light-primary py-4"
              >
                <div class="space-x-2 flex items-center">
                  <img
                    src="~/assets/pool-tokens/eth-dai.svg"
                    width="32"
                    alt="Dai"
                  />
                  <span class="font-medium dark:text-white text-sm"
                    >{{ poolToken.name }} ({{ poolToken.exchange }})</span
                  >
                </div>
                <div>
                  <span class="dark:text-white text-gray-800 font-medium">{{
                    balance
                  }}</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </template>
    </Modal>

    <!-- Transaction confirmation Modal -->
    <Modal v-model="ui.showConfirmation">
      <template>
        <div class="flex flex-col space-y-4">
          <div class="flex justify-between items-center">
            <p class="font-medium dark:text-white">Confirm Mint</p>
            <button
              type="button"
              class="focus:outline-none"
              @click="ui.showConfirmation = false"
            >
              <i class="fas fa-times text-gray-900 dark:text-gray-500"></i>
            </button>
          </div>

          <div class="flex flex-col space-y-4">
            <div class="flex w-full items-center justify-between">
              <div class="flex items-center space-x-2">
                <img src="~/assets/pool-tokens/eth-dai.svg" width="40" alt="" />
                <span class="text-2xl dark:text-white">{{
                  liquidityPoolTokenAmount
                }}</span>
              </div>
              <p class="text-lg font-medium dark:text-white">UNIETH-DAI</p>
            </div>
            <i
              class="fas fa-arrow-down text-lg text-gray-800 dark:text-gray-500 mx-2"
            ></i>
            <div class="flex w-full items-center justify-between">
              <div class="flex items-center space-x-2">
                <img class="h-6" src="~/assets/icons/crypto/dai.webp" alt="" />
                <span class="text-2xl dark:text-white">{{ udaiOutput }}</span>
              </div>
              <p class="text-lg font-medium dark:text-white">uDAI</p>
            </div>
          </div>

          <div class="bg-gray-200 dark:bg-gray-800 p-4 rounded-md">
            <div class="flex flex-col space-y-1">
              <div class="flex items-center justify-between">
                <p class="text-sm text-gray-600">Fees</p>
                <p class="font-medium text-sm dark:text-white">0.25%</p>
              </div>
              <div class="flex items-center justify-between">
                <p class="text-sm text-gray-600">Funding Rate</p>
                <p class="font-medium text-sm dark:text-white">50%</p>
              </div>
            </div>
            <button
              class="w-full mt-4 py-2 bg-light-primary dark:bg-dark-primary font-medium text-white rounded-md"
              @click="mint(selectedPoolToken.address)"
            >
              Confirm Mint
            </button>
          </div>
        </div>
      </template>
    </Modal>

    <SuccessModal v-model="ui.showSuccess" :hash="txLink" />
    <RejectedModal v-model="ui.showRejected" />
    <AwaitingModal v-model="ui.showAwaiting" />
  </div>
</template>

<script>
// import components

import { ethers } from 'ethers'
import Web3 from 'web3'

import ERC20ABI from '~/configs/abi/ERC20'
import UniswapLPTABI from '~/configs/abi/UniswapLPTABI'
import UnboundLLCABI from '~/configs/abi/UnboundLLCABI'

// import contractAddresses from '~/configs/addresses'
import supportedPoolTokens from '~/configs/supportedPoolTokens'

import config from '~/configs/config'

// import signature from '~/mixins/signature'
import { getNonce, getEIP712Signature } from '~/mixins/crypto'

export default {
  data() {
    return {
      ui: {
        showDialog: false,
        showConfirmation: false,
        showSuccess: false,
        showRejected: false,
        showAwaiting: false,
      },
      selectedPoolToken: '',
      selectedMintToken: '',
      balance: '--.--',
      liquidityPoolTokenAmount: '',
      loanRatio: {
        totalDai: '',
        totalLPTokens: '',
        rating: '50',
      },
      txLink: '',
      supportedPoolTokens,
    }
  },

  computed: {
    udaiOutput() {
      // Liquidity pool token value in dai
      const LPTValueInDai =
        (this.loanRatio.totalDai * this.liquidityPoolTokenAmount) /
        this.loanRatio.totalLPTokens
      // Since, we're supporting AAA tokens at the moment we'll hardcoding the AAA rate: 50%
      const loanAmount = LPTValueInDai * 0.5
      // const loanAmountWithFees = loanAmount - (loanAmount * 0.25) / 100
      return loanAmount.toFixed(4).slice(0, -1)
    },

    isWalletConnected() {
      return !!this.$store.state.address
    },

    shouldDisable() {
      return (
        !this.liquidityPoolTokenAmount ||
        this.liquidityPoolTokenAmount > this.balance
      )
    },

    getDisabledClass() {
      return 'bg-gray-500 dark:bg-gray-800 text-gray-600 cursor-not-allowed'
    },

    getActiveClass() {
      return 'bg-light-primary text-light-primary dark:bg-dark-primary bg-opacity-25 dark:text-white'
    },
  },

  mounted() {
    this.getBalanceOfToken(config.contracts.liquidityPoolToken)
    this.calculateLoanRatio()
    // this.mint()
  },

  methods: {
    selectPoolToken(poolToken) {
      this.selectedPoolToken = poolToken
      this.ui.showDialog = false
    },

    async getBalanceOfToken(tokenAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)

      const signer = provider.getSigner()
      const contract = await new ethers.Contract(tokenAddress, ERC20ABI, signer)
      const userAddress = signer.getAddress()
      const getBalance = await contract.balanceOf(userAddress)
      const balance = ethers.utils.formatEther(getBalance.toString())
      const formattedBalance =
        Math.round((parseInt(balance) + Number.EPSILON) * 100) / 100
      this.balance = formattedBalance
    },

    async calculateLoanRatio() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)

      const signer = provider.getSigner()
      const uniswapLptAddress = config.contracts.liquidityPoolToken
      const contract = await new ethers.Contract(
        uniswapLptAddress,
        UniswapLPTABI,
        signer
      )
      const reserve = await contract.getReserves()
      const totalLPTokens = await contract.totalSupply()
      const token0 = await contract.token0()
      if (token0.toLowerCase() === config.contracts.dai) {
        const totalDai = reserve[0].toString() * 2
        this.loanRatio.totalDai = totalDai
        this.loanRatio.totalLPTokens = totalLPTokens.toString()
      } else {
        const totalDai = reserve[1].toString() * 2
        this.loanRatio.totalDai = totalDai
        this.loanRatio.totalLPTokens = totalLPTokens.toString()
      }
      // total value locked in the smart contract in terms of Dai
    },

    async mint(poolTokenAddress) {
      this.ui.showAwaiting = true
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()

      const userAddress = await signer.getAddress()
      const nonce = await getNonce(poolTokenAddress, signer)
      const deadline = +new Date() + 5000
      const amount = ethers.utils
        .parseEther(this.liquidityPoolTokenAmount)
        .toString()

      const EIP712Signature = await getEIP712Signature(
        poolTokenAddress,
        config.contracts.liquidityLock,
        userAddress,
        amount,
        nonce,
        deadline
      )
      const web3 = new Web3(window.ethereum)
      const metamaskSigner = await web3.eth.getAccounts()

      web3.currentProvider.sendAsync(
        {
          method: 'eth_signTypedData_v3',
          params: [metamaskSigner[0], EIP712Signature],
          from: metamaskSigner[0],
        },
        async (error, signedData) => {
          if (error || signedData.error) {
            this.ui.showAwaiting = false
            return console.error(signedData)
          }
          const signature = ethers.utils.splitSignature(signedData.result)
          const UnboundLLCContract = await new ethers.Contract(
            config.contracts.liquidityLock,
            UnboundLLCABI,
            signer
          )
          console.log({
            amount,
            uDai: config.contracts.unboundDai,
            deadline,
            sigV: signature.v,
            sigR: signature.r,
            sigS: signature.s,
          })
          try {
            const mintUDai = await UnboundLLCContract.lockLPTWithPermit(
              amount,
              config.contracts.unboundDai,
              deadline,
              signature.v,
              signature.r,
              signature.s
            )
            // close awaiting modal
            this.ui.showAwaiting = false
            // show success screen
            this.ui.showConfirmation = false
            this.txLink = mintUDai.hash
            this.ui.showSuccess = true
            console.log(mintUDai.hash)
          } catch (error) {
            this.ui.showAwaiting = false
            this.ui.showConfirmation = false
            this.ui.showRejected = true
          }
        }
      )
    },

    setInputMax() {
      this.liquidityPoolTokenAmount = this.balance
    },
  },
}
</script>
