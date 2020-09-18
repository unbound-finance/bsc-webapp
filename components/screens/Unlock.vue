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
        <p class="text-center font-medium dark:text-white text-lg">Unlock</p>
        <button class="focus:outline-none">
          <i class="far fa-question-circle text-gray-600 text-lg"></i>
        </button>
      </div>

      <div
        class="w-full p-2 px-4 border border-gray-200 dark:border-gray-700 rounded-lg"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-700 font-medium">Unlock</p>
          <p v-if="selectedPoolToken" class="text-gray-600 text-sm">
            Locked: {{ selectedPoolToken.balance }}
          </p>
        </div>
        <form class="w-full max-w-sm">
          <div class="flex items-center py-2">
            <input
              v-model="LPTAmount"
              class="appearance-none bg-transparent text-2xl text-gray-800 dark:text-gray-300 font-medium w-full mr-3 py-1 leading-tight focus:outline-none"
              type="number"
              placeholder="0.0"
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
              <img src="~/assets/pool-tokens/eth-dai.svg" width="24" alt />
              <span>{{ selectedPoolToken.name }}</span>
              <i class="fas fa-chevron-down pt-1"></i>
            </button>

            <button
              v-else
              class="flex-shrink-0 text-light-primary dark:text-white bg-light-primary dark:bg-dark-primary bg-opacity-25 hover:bg-opacity-100 hover:text-white transition-all duration-200 text-sm font-medium py-1 px-4 rounded flex items-center space-x-2 focus:outline-none"
              type="button"
              @click="ui.showDialog = true"
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
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-700 font-medium">Burn</p>
          <p class="text-gray-600 text-sm">Balance: {{ UBDBalance }}</p>
        </div>
        <form class="w-full max-w-sm">
          <div class="flex items-center py-2">
            <input
              v-model="UBDOutput"
              class="appearance-none bg-transparent text-2xl text-gray-800 dark:text-gray-300 font-medium w-full mr-3 py-1 leading-tight focus:outline-none"
              type="number"
              placeholder="0.0"
              readonly
            />

            <button
              class="flex-shrink-0 text-light-primary dark:text-white bg-light-primary dark:bg-dark-primary bg-opacity-25 hover:bg-opacity-100 hover:text-white transition-all duration-200 text-sm font-medium py-1 px-4 rounded flex items-center space-x-2 focus:outline-none"
              type="button"
            >
              <span>{{ selectedBurnToken.name }}</span>
              <!-- <i class="fas fa-chevron-down pt-1"></i> -->
            </button>
          </div>
        </form>
      </div>

      <!-- Show fees -->
      <!-- <div
        v-if="LPTAmount"
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
              <p class="font-medium text-sm dark:text-white">
                {{ (parseInt(UBDOutput) * 0.25) / 100 }} UBD
              </p>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-600">Funding Rate</p>
              <p class="font-medium text-sm dark:text-white">50%</p>
            </div>
          </div>
        </div>
      </div> -->

      <button
        v-if="isWalletConnected"
        class="font-medium w-full py-2 rounded-md focus:outline-none"
        :class="[
          !LPTAmount ? getDisabledClass : getActiveClass,
          isSufficientBalance ? getDisabledClass : getActiveClass,
        ]"
        :disabled="shouldDisableUnlock"
        @click="unlock(selectedPoolToken)"
      >
        <span v-if="!LPTAmount">Enter an amount</span>
        <span v-else-if="isSufficientBalance">Insufficient Balance</span>
        <span v-else>Unlock</span>
      </button>
    </div>

    <SuccessModal v-model="ui.showSuccess" :hash="txLink" />
    <RejectedModal v-model="ui.showRejected" />
    <AwaitingModal v-model="ui.showAwaiting" />

    <!-- Select LP Tokens Modal -->
    <Modal v-model="ui.showDialog">
      <template>
        <div class="flex flex-col space-y-4">
          <div class="flex justify-between items-center">
            <p class="font-medium dark:text-white">Select Locked LP Token</p>
            <button
              type="button"
              class="focus:outline-none"
              @click="ui.showDialog = false"
            >
              <i class="fas fa-times text-gray-900 dark:text-gray-500"></i>
            </button>
          </div>

          <div class="pt-4">
            <div v-for="(poolToken, index) in supportedPoolTokens" :key="index">
              <a @click="selectPoolToken(poolToken)">
                <div
                  class="w-full flex items-center justify-between cursor-pointer hover:text-light-primary py-2"
                >
                  <div class="space-x-2 flex items-center">
                    <div class="relative flex w-12">
                      <div class="flex items-center self-center">
                        <img
                          class="rounded-full"
                          :src="poolToken.currencyOneLogo"
                          style="z-index: 2"
                          width="24"
                        />
                      </div>
                      <div class="absolute" style="left: 16px">
                        <img
                          class="rounded-full"
                          :src="poolToken.currencyTwoLogo"
                          style="width: 24px; height: 24px"
                        />
                      </div>
                    </div>
                    <span class="font-medium dark:text-white text-sm"
                      >{{ poolToken.name }} ({{ poolToken.exchange }})</span
                    >
                  </div>
                  <div>
                    <span class="dark:text-white text-gray-800 font-medium">
                      {{ poolToken.balance }}
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/_app/Modal'
import { ethers } from 'ethers'
// import Web3 from 'web3'

import ERC20ABI from '~/configs/abi/ERC20'
import UniswapLPTABI from '~/configs/abi/UniswapLPTABI'
import UnboundLLCABI from '~/configs/abi/UnboundLLCABI'
import UnboundDaiABI from '~/configs/abi/UnboundDai'

import config from '~/configs/config'
import supportedPoolTokens from '~/configs/supportedPoolTokens'

import { getERC20Balance } from '~/mixins/ERC20'
// import { getERC20Balance } from '~/mixins/ERC20'

// import signature from '~/mixins/signature'

const provider = new ethers.providers.Web3Provider(window.ethereum)

export default {
  components: { Modal },
  data() {
    return {
      ui: {
        showDialog: false,
        showSuccess: false,
        showRejected: false,
        showAwaiting: false,
      },
      selectedPoolToken: '',
      selectedBurnToken: {
        name: 'UBD',
        exchange: 'Uniswap',
        address: config.contracts.unboundDai,
        currencyOneLogo:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
        currencyTwoLogo: 'https://uniswap.info/static/media/eth.73dabb37.png',
      },
      LPTAmount: '',
      selectedLPToken: '',
      balance: '--.--',
      lockedLPTokenBalance: '--.--',
      txLink: '',
      burnTokenAmount: '',
      UBDBalance: '',
      loanRatio: {
        totalDai: '',
        totalLPTokens: '',
        rating: '50',
      },
      supportedPoolTokens,
    }
  },

  computed: {
    UBDOutput() {
      const ratio = this.getRatio()
      return this.LPTAmount * ratio
    },
    isWalletConnected() {
      return !!this.$store.state.address
    },
    isSufficientBalance() {
      return parseFloat(this.LPTAmount) > parseFloat(this.lockedLPTokenBalance)
    },
    shouldDisableUnlock() {
      return !this.LPTAmount || this.isSufficientBalance
    },

    getDisabledClass() {
      return 'bg-gray-500 dark:bg-gray-800 text-gray-600 cursor-not-allowed'
    },

    getActiveClass() {
      return 'bg-light-primary text-light-primary dark:bg-dark-primary bg-opacity-25 dark:text-white'
    },
  },

  mounted() {
    this.getLPTokenBalance()
    this.getAllLokedTokens()
    this.getBurnTokenBalance()
  },

  methods: {
    selectPoolToken(poolToken) {
      this.selectedPoolToken = poolToken
      this.ui.showDialog = false
      this.calculateLoanRatio(poolToken)
    },

    async getBalanceOfToken(tokenAddress) {
      const signer = provider.getSigner()
      const contract = await new ethers.Contract(tokenAddress, ERC20ABI, signer)
      const userAddress = signer.getAddress()
      const getBalance = await contract.balanceOf(userAddress)
      const balance = ethers.utils.formatEther(getBalance.toString())
      const formattedBalance =
        Math.round((parseInt(balance) + Number.EPSILON) * 100) / 100
      return formattedBalance
    },

    async getAllLokedTokens() {
      let i
      const poolTokens = []
      for (i = 0; i < supportedPoolTokens.length; i++) {
        const balance = await this.getLPTokenBalance(
          supportedPoolTokens[i].llcAddress
        )
        const poolTokenObj = {
          name: supportedPoolTokens[i].name,
          exchange: supportedPoolTokens[i].exchange,
          address: supportedPoolTokens[i].address,
          llcAddress: supportedPoolTokens[i].llcAddress,
          currencyOneLogo: supportedPoolTokens[i].currencyOneLogo,
          currencyTwoLogo: supportedPoolTokens[i].currencyTwoLogo,
          balance,
        }
        poolTokens.push(poolTokenObj)
        console.log(poolTokens)
        this.supportedPoolTokens = poolTokens
      }
    },

    async getLPTokenBalance(address) {
      const signer = provider.getSigner()
      const contract = await new ethers.Contract(address, UnboundLLCABI, signer)
      const userAddress = signer.getAddress()
      const getLocked = await contract._tokensLocked(userAddress)
      const locked = ethers.utils.formatEther(getLocked.toString())
      const formatted = parseFloat(locked).toFixed(4).slice(0, -1)
      return formatted
    },

    async calculateLoanRatio(poolToken) {
      const signer = provider.getSigner()
      const uniswapLptAddress = poolToken.address
      const contract = await new ethers.Contract(
        uniswapLptAddress,
        UniswapLPTABI,
        signer
      )
      const reserve = await contract.getReserves()
      const totalLPTokens = await contract.totalSupply()
      const token0 = await contract.token0()
      // total value locked in the smart contract in terms of Dai
      if (token0.toLowerCase() === poolToken.stablecoin) {
        const totalDai = reserve[0].toString() * 2
        this.loanRatio.totalDai = totalDai
        this.loanRatio.totalLPTokens = totalLPTokens.toString()
      } else {
        const totalDai = reserve[1].toString() * 2
        this.loanRatio.totalDai = totalDai
        this.loanRatio.totalLPTokens = totalLPTokens.toString()
      }
    },

    getRatio() {
      // Liquidity pool token value in dai
      const LPTValueInDai =
        (this.loanRatio.totalDai * 1) / this.loanRatio.totalLPTokens
      // Since, we're supporting AAA tokens at the moment we'll hardcoding the AAA rate: 50%
      const loanAmount = (LPTValueInDai * 50) / 100
      const loanAmountWithFees = loanAmount - (loanAmount * 0.25) / 100
      const ratio = parseFloat(loanAmountWithFees).toFixed(4).slice(0, -1)
      return ratio
    },

    async approve(tokenAddress) {
      const signer = provider.getSigner()
      const contract = await new ethers.Contract(
        config.contracts.liquidityPoolToken,
        ERC20ABI,
        signer
      )

      const totalSupply = contract.totalSupply()
      const approved = await contract.approve(
        config.contracts.liquidityLock,
        totalSupply
      )
      console.log(approved)
    },

    async unlock(poolToken) {
      console.log('address', poolToken.llcAddress)
      this.ui.showAwaiting = true
      const signer = provider.getSigner()
      const contract = await new ethers.Contract(
        poolToken.llcAddress,
        UnboundLLCABI,
        signer
      )
      const rawLPTAmount = ethers.utils.parseEther(this.LPTAmount)
      try {
        const unlock = await contract.unlockLPT(
          rawLPTAmount,
          config.contracts.unboundDai
        )
        this.ui.showAwaiting = false
        this.txLink = unlock.hash
        this.ui.showSuccess = true

        // initiate the UBD contract to detect the event so we can update the balances
        const UBD = new ethers.Contract(
          config.contracts.unboundDai,
          UnboundDaiABI,
          signer
        )
        // listen to mint event from UBD contract
        UBD.on('Burn', (user, amount) => {
          console.log(user, amount)
          console.log('Burn event emitted, updating balance')
          this.getLPTokenBalance(poolToken.address)
          this.getBurnTokenBalance()
        })
      } catch (error) {
        console.log(error)
        this.ui.showAwaiting = false
        this.ui.showRejected = true
      }
    },

    async getBurnTokenBalance() {
      const balance = await getERC20Balance(config.contracts.unboundDai)
      console.log(balance)
      this.UBDBalance = parseFloat(balance.formatted).toFixed(4).slice(0, -1)
    },

    setInputMax() {
      this.LPTAmount = this.lockedLPTokenBalance
    },
  },
}
</script>

<style></style>
