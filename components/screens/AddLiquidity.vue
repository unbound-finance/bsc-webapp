<template>
  <div>
    <div class="flex flex-col items-center w-full py-2 space-y-4 px-4">
      <div class="flex w-full items-center justify-between">
        <nuxt-link to="/earn">
          <button class="focus:outline-none">
            <i
              class="fas fa-chevron-left text-gray-900 dark:text-white text-lg"
            ></i>
          </button>
        </nuxt-link>
        <p class="text-center font-medium dark:text-white text-lg">
          Add Liquidity
        </p>
        <button class="focus:outline-none">
          <i class="far fa-question-circle text-gray-600 text-lg"></i>
        </button>
      </div>

      <div
        class="w-full p-2 px-4 border border-gray-200 dark:border-gray-700 rounded-lg"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-700 font-medium">Input</p>
          <p v-if="selectedToken" class="text-gray-600 text-sm">
            Balance: {{ balance }}
          </p>
        </div>
        <form class="w-full max-w-sm">
          <div class="flex items-center py-2">
            <input
              v-model="lpTokenAmount"
              class="appearance-none bg-transparent text-2xl text-gray-800 dark:text-gray-300 font-medium w-full mr-3 py-1 leading-tight focus:outline-none"
              type="number"
              placeholder="0.0"
              :disabled="!selectedToken"
            />

            <button
              v-if="selectedToken.allowance == 0 && selectedToken"
              type="button"
              class="px-2 py-1 mx-2 text-sm rounded border border-light-primary dark:border-dark-primary bg-opacity-25 text-light-primary dark:text-white focus:outline-none"
              @click="approve(selectedToken.address)"
            >
              Approve
            </button>

            <button
              v-else-if="selectedToken.allowance !== 0 && selectedToken"
              type="button"
              class="px-2 py-1 mx-2 text-sm rounded border border-light-primary dark:border-dark-primary bg-opacity-25 text-light-primary dark:text-white focus:outline-none"
              @click="setInputMax"
            >
              Max
            </button>
            <button
              v-if="selectedToken"
              class="flex-shrink-0 text-light-primary dark:text-white bg-light-primary dark:bg-dark-primary bg-opacity-25 hover:bg-opacity-100 hover:text-white transition-all duration-200 text-sm font-medium py-1 px-4 rounded flex items-center space-x-2 focus:outline-none"
              type="button"
              @click="ui.showDialog = !ui.showDialog"
            >
              <span>{{ selectedToken.name }}</span>
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

      <i class="fas fa-plus text-gray-800 text-sm dark:text-gray-500"></i>

      <div
        class="w-full p-2 px-4 border border-gray-200 dark:border-gray-700 rounded-lg"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-700 font-medium">Input</p>
          <p v-if="selectedUToken" class="text-gray-600 text-sm">
            Balance: {{ uDaiBalance }}
          </p>
        </div>
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
              v-if="selectedUToken.allowance == 0 && selectedToken"
              type="button"
              class="px-2 py-1 mx-2 text-sm rounded border border-light-primary dark:border-dark-primary bg-opacity-25 text-light-primary dark:text-white focus:outline-none"
              @click="approve(selectedUToken.address)"
            >
              Approve
            </button>

            <button
              v-else-if="!selectedUToken.allowance == 0 && selectedToken"
              type="button"
              class="px-2 py-1 mx-2 text-sm rounded border border-light-primary dark:border-dark-primary bg-opacity-25 text-light-primary dark:text-white focus:outline-none"
              @click="setInputMax"
            >
              Max
            </button>
            <button
              class="flex-shrink-0 text-light-primary dark:text-white bg-light-primary dark:bg-dark-primary bg-opacity-25 hover:bg-opacity-100 hover:text-white transition-all duration-200 text-sm font-medium py-1 px-4 rounded flex items-center space-x-2 focus:outline-none"
              type="button"
            >
              <span>{{ selectedUToken.name }}</span>
              <!-- <i class="fas fa-chevron-down pt-1"></i> -->
            </button>
          </div>
        </form>
      </div>

      <!-- <div
        class="bg-gray-300 dark:bg-gray-800 rounded-lg w-full border border-gray-300 dark:border-gray-800"
      >
        <p
          class="text-gray-800 dark:text-gray-400 font-medium text-sm mx-4 my-2"
        >
          Pool Share
        </p>
        <div class="bg-white dark:bg-dark-bg rounded-lg p-4">
          <div class="flex flex-col space-y-1">
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-600">Pool Share</p>
              <p class="font-medium text-sm dark:text-white">100%</p>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-600">Your Positions</p>
              <p class="font-medium text-sm dark:text-white">
                <span class="text-gray-600">DAI</span>: 100,
                <span class="text-gray-600">uDAI</span>: 100.01
              </p>
            </div>
          </div>
        </div>
      </div> -->

      <button
        class="bg-light-primary text-light-primary font-medium dark:bg-dark-primary bg-opacity-25 dark:text-white w-full py-2 rounded-md focus:outline-none"
        @click="addLiquidity"
      >
        Add Liquidity
      </button>
    </div>

    <SuccessModal v-model="ui.showSuccess" :hash="txLink" />
    <RejectedModal v-model="ui.showRejected" />

    <!-- Select Tokens Modal -->
    <Modal :show="ui.showDialog" @close="ui.showDialog = false">
      <template>
        <div class="flex flex-col space-y-4">
          <div class="flex justify-between items-center">
            <p class="font-medium dark:text-white">Select a Token</p>
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
              <!-- <div
                class="h-40 w-1/2 border border-gray-300 dark:border-gray-700 p-8 rounded-md flex flex-col items-center justify-center hover:shadow-md cursor-pointer"
              >
                <img
                  src="~/assets/pool-tokens/eth-dai.svg"
                  width="40"
                  alt="Dai"
                />
                <p class="font-medium text-center pt-2 dark:text-white">
                  {{ poolToken.name }}
                </p>
                <p class="text-sm text-center dark:text-white">
                  Balance: {{ balance }}
                </p>
                <p class="text-sm text-center dark:text-white"> 
                  {{ poolToken.exchange }}
                </p>
              </div> -->

              <div
                class="w-full flex items-center justify-between cursor-pointer hover:text-light-primary py-4"
              >
                <div class="space-x-2 flex items-center">
                  <img
                    src="~/assets/icons/crypto/dai.svg"
                    width="32"
                    alt="Dai"
                  />
                  <span class="font-medium dark:text-white text-sm"
                    >{{ poolToken.name }}
                    <!-- ({{ poolToken.exchange }}) -->
                  </span>
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
    <Modal :show="ui.showConfirmation" @close="ui.showConfirmation = false">
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
                  lpTokenAmount
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
            >
              Confirm Mint
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
// import components
import Modal from '@/components/_app/Modal'

import { ethers } from 'ethers'

import ERC20ABI from '~/configs/abi/ERC20'
// import UniswapLPTABI from '~/configs/abi/UniswapLPTABI'
// import UniswapRouterABI from '~/configs/abi/UniswapRouter'

import { addLiquidity } from '~/mixins/stake'

import config from '~/configs/config'

export default {
  components: { Modal },
  data() {
    return {
      ui: {
        showDialog: false,
        showConfirmation: false,
        showSuccess: false,
        showRejected: false,
      },
      selectedToken: {
        name: 'dai',
        exchange: 'Uniswap',
        address: config.contracts.dai,
        allowance: '',
        tokenIcon:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      },
      selectedUToken: {
        name: 'uDai',
        address: config.contracts.unboundDai,
        allowance: '',
        tokenIcon:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      },
      balance: '--.--',
      lpTokenAmount: '0',
      // isTokenApproved: '',
      txLink: '',
      uDaiBalance: '',
      supportedPoolTokens: [
        {
          name: 'dai',
          exchange: 'Uniswap',
          address: '0x5124d2A8e3A02f906d86803D703FD6CcCf492EF8',
          currencyOneLogo:
            'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
          currencyTwoLogo: 'https://uniswap.info/static/media/eth.73dabb37.png',
        },
      ],
    }
  },

  computed: {
    udaiOutput() {
      return this.lpTokenAmount
    },
  },

  async mounted() {
    this.balance = await this.getBalanceOfToken(this.selectedToken.address)
    this.uDaiBalance = await this.getBalanceOfToken(this.selectedUToken.address)
    this.checkAllowances()
    // this.calculateLoanRatio()
    // this.mint()
  },

  methods: {
    selectPoolToken(poolToken) {
      this.selectedToken = poolToken
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
      return formattedBalance
    },

    async approve(tokenAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = await new ethers.Contract(tokenAddress, ERC20ABI, signer)
      try {
        const totalSupply = contract.totalSupply()
        await contract.approve(config.contracts.uniswapRouter, totalSupply)
        this.$toasted.show('Token approveed Successfully', {
          theme: 'bubble',
          position: 'top-center',
          duration: 5000,
        })
        this.checkAllowances()
      } catch (error) {
        this.$toasted.show('Transaction Rejected', {
          theme: 'bubble',
          position: 'top-center',
          duration: 5000,
        })
      }
    },

    async addLiquidity() {
      try {
        const transaction = await addLiquidity(
          config.contracts.dai,
          config.contracts.unboundDai,
          this.lpTokenAmount,
          this.lpTokenAmount
        )
        console.log(transaction)
        this.txLink = transaction.hash
        this.ui.showSuccess = true
      } catch (error) {
        this.ui.showRejected = true
      }
    },

    async getAllowance(tokenAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)

      const signer = provider.getSigner()
      const userAddress = provider.getSigner().getAddress()
      const contract = await new ethers.Contract(tokenAddress, ERC20ABI, signer)
      const allowance = await contract.allowance(
        userAddress,
        config.contracts.uniswapRouter
      )
      console.log(allowance.toString())
      return allowance
    },

    async checkAllowances() {
      const uDaiAllowance = await this.getAllowance(config.contracts.unboundDai)
      const daiAllowance = await this.getAllowance(config.contracts.dai)
      this.selectedToken.allowance = daiAllowance.toString()
      this.selectedUToken.allowance = uDaiAllowance.toString()
      console.log(uDaiAllowance.toString(), daiAllowance.toString())
    },

    setInputMax() {
      this.lpTokenAmount = this.balance
    },
  },
}
</script>

<style></style>
