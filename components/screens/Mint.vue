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
      <p
        v-if="txLink"
        class="p-2 border-1 bg-primary-400 rounded-full px-8 bg-opacity-25 text-light-primary dark:text-white text-gray-900"
        style="background: #06d6a0"
      >
        Transaction Success.
        <a :href="txLink" target="_blank"> View On Etherscan </a>
      </p>

      <p
        v-if="!selectedPoolToken"
        class="p-2 border-1 rounded-full px-8 bg-opacity-25 text-light-primary dark:text-white text-gray-600"
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
              v-model="lpTokenAmount"
              class="appearance-none bg-transparent text-2xl text-gray-800 dark:text-gray-300 font-medium w-full mr-3 py-1 leading-tight focus:outline-none"
              type="number"
              placeholder="0.0"
              :disabled="!selectedPoolToken"
            />

            <button
              v-if="!isTokenApproved && selectedPoolToken"
              type="button"
              class="px-2 py-1 mx-2 text-sm rounded border border-light-primary dark:border-dark-primary bg-opacity-25 text-light-primary dark:text-white focus:outline-none"
              @click="approve"
            >
              Approve
            </button>

            <button
              v-else-if="isTokenApproved && selectedPoolToken"
              type="button"
              class="px-2 py-1 mx-2 text-sm rounded border border-light-primary dark:border-dark-primary bg-opacity-25 text-light-primary dark:text-white focus:outline-none"
              @click="setInputMax"
            >
              Max
            </button>
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
// import components
import Modal from '@/components/_app/Modal'

import { ethers } from 'ethers'

import ERC20ABI from '~/configs/abi/ERC20'
import UniswapLPTABI from '~/configs/abi/UniswapLPTABI'
import UnboundLLCABI from '~/configs/abi/UnboundLLCABI'

import contractAddresses from '~/configs/addresses'
import supportedPoolTokens from '~/configs/supportedPoolTokens'

// import signature from '~/mixins/signature'

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
      lpTokenAmount: '0',
      loanRatio: {
        totalDai: '',
        totalLPTokens: '',
        rating: '50',
      },
      isTokenApproved: '',
      txLink: '',
      supportedPoolTokens,
    }
  },

  computed: {
    udaiOutput() {
      // Liquidity pool token value in dai
      const LPTValueInDai =
        (this.loanRatio.totalDai * this.lpTokenAmount) /
        this.loanRatio.totalLPTokens
      // Since, we're supporting AAA tokens at the moment we'll hardcoding the AAA rate: 50%
      const loanAmount = (LPTValueInDai * 50) / 100
      // const loanAmountWithFees = loanAmount - (loanAmount * 0.25) / 100
      return loanAmount.toFixed(4).slice(0, -1)
    },
  },

  mounted() {
    this.getBalanceOfToken(supportedPoolTokens[0].address)
    this.getAllowance()
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
      const uniswapLptAddress = contractAddresses.lpToken
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

    async approve(tokenAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)

      const signer = provider.getSigner()
      const contract = await new ethers.Contract(
        contractAddresses.lpToken,
        ERC20ABI,
        signer
      )

      try {
        const totalSupply = contract.totalSupply()
        await contract.approve(contractAddresses.llc, totalSupply)
        this.$toasted.show('Token approveed Successfully', {
          theme: 'bubble',
          position: 'top-center',
          duration: 5000,
        })
        this.isTokenApproved = true
      } catch (error) {
        this.$toasted.show('Transaction Rejected', {
          theme: 'bubble',
          position: 'top-center',
          duration: 5000,
        })
      }
    },

    async mint(tokenAddress) {
      if (!this.isTokenApproved) {
        this.$toasted.show('Please approve the tokens first', {
          theme: 'bubble',
          position: 'top-center',
          duration: 5000,
        })
      } else {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = await new ethers.Contract(
          contractAddresses.llc,
          UnboundLLCABI,
          signer
        )
        const LPTAmount = ethers.utils.parseEther(this.lpTokenAmount)
        try {
          const approved = await contract.lockLPT1(LPTAmount, '0')
          this.txLink = `https://kovan.etherscan.io/tx/${approved.hash}`
          // this.$toasted.show('Transaction Success', {
          //   theme: 'bubble',
          //   position: 'top-center',
          //   duration: 5000,
          // })
          console.log(approved)
        } catch (error) {
          this.$toasted.show('Transaction Rejected', {
            theme: 'bubble',
            position: 'top-center',
            duration: 5000,
          })
          console.log(error)
        }
      }
    },

    async getAllowance() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)

      const signer = provider.getSigner()
      const userAddress = provider.getSigner().getAddress()
      const contract = await new ethers.Contract(
        contractAddresses.lpToken,
        ERC20ABI,
        signer
      )
      const allowance = await contract.allowance(
        userAddress,
        contractAddresses.llc
      )
      console.log(allowance.toString())
      // eslint-disable-next-line eqeqeq
      if (allowance.toString() == 0) {
        this.isTokenApproved = false
        // do nothing
      } else {
        this.isTokenApproved = true
      }
    },

    setInputMax() {
      this.lpTokenAmount = this.balance
    },
  },
}
</script>

<style></style>
