<template>
  <div class="main_container my-4 md:my-8">
    <div class="flex flex-col items-center w-full space-y-4 p-4">
      <div class="flex w-full items-center justify-between">
        <nuxt-link to="/earn">
          <button class="focus:outline-none">
            <i
              class="fas fa-chevron-left text-gray-900 dark:text-white text-lg"
            ></i>
          </button>
        </nuxt-link>
        <p class="text-center font-medium dark:text-white text-lg">
          Remove Liquidity
        </p>
        <button class="focus:outline-none">
          <i class="far fa-question-circle text-gray-600 text-lg"></i>
        </button>
      </div>

      <input-field
        v-model="uTokenAmount"
        label="Input"
        :u-token.sync="uToken"
        type="remove"
      />

      <i
        v-if="uToken"
        class="fas fa-plus text-gray-800 text-sm dark:text-gray-500"
      ></i>

      <input-field
        v-if="uToken"
        :value="uTokenAmount"
        label="Input"
        :readonly="true"
      >
        <template v-slot:showBalance>
          <p v-if="uToken" class="text-xs text-gray-500">
            Locked:
            <span
              class="font-mono text-gray-900 dark:text-gray-500 font-medium"
              >{{ liquidity && Number(liquidity.token0).toFixed(4) }}</span
            >
          </p>
        </template>
        <template v-slot:append>
          <div class="flex flex-col">
            <div class="flex items-center space-x-2 focus:outline-none">
              <button
                v-if="uToken && uToken.tokenAllowance == 0"
                type="button"
                class="px-2 py-1 text-sm rounded border border-light-primary dark:border-dark-primary bg-opacity-25 text-light-primary dark:text-white focus:outline-none"
                @click="approve(uToken.token.address)"
              >
                Approve
              </button>
              <div class="flex items-center">
                <img :src="uToken.token.icon" width="16" />

                <div class="flex items-center p-1">
                  <p
                    class="text-gray-900 dark:text-gray-500 font-semibold text-right"
                  >
                    {{ uToken.token.name }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </input-field>

      <div
        v-if="liquidity"
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
              <p class="font-medium text-sm dark:text-white">
                {{ Number(liquidity.poolShare).toFixed(4) }}%
              </p>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-600">Your Positions</p>
              <p class="font-medium text-sm dark:text-white">
                <span class="text-gray-600">{{ uToken.token.name }}</span
                >: {{ Number(liquidity.token1).toFixed(4) }},
                <span class="text-gray-600">{{ uToken.name }}</span
                >:
                {{ Number(liquidity.token0).toFixed(4) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        v-if="isWalletConnected"
        class="font-medium w-full py-2 rounded-md focus:outline-none"
        :class="[
          !uToken ? getDisabledClass : getActiveClass,
          !uTokenAmount ? getDisabledClass : getActiveClass,
          isSufficentBalance ? getDisabledClass : getActiveClass,
          uTokenAmount === '0' ? getDisabledClass : getActiveClass,
          Number(uTokenAmount).toFixed(18) == 0.0
            ? getDisabledClass
            : getActiveClass,
        ]"
        :disabled="shouldDisableRemove"
        @click="removeLiquidity"
      >
        <span v-if="!uToken">Select Token</span>
        <span v-else-if="!uTokenAmount">Enter An Amount</span>
        <span v-else-if="isSufficentBalance"
          >Insufficient Locked Liquidity</span
        >
        <span v-else-if="Number(uTokenAmount).toFixed(18) == 0.0"
          >Amount should be greater than 0</span
        >
        <span
          v-else-if="uToken.uTokenAllowance == 0 || uToken.tokenAllowance == 0"
          >Please Approve Tokens</span
        >
        <span v-else>Remove Liquidity</span>
      </button>
      <ConnectWalletBtn v-else class="w-full" />
    </div>

    <SuccessModal v-model="ui.showSuccess" :hash="txLink" />
    <RejectedModal v-model="ui.showRejected" />
    <AwaitingModal v-model="ui.showAwaiting" />
  </div>
</template>

<script>
import { ethers } from 'ethers'

import ERC20ABI from '~/configs/abi/ERC20'
import UniswapLPTABI from '~/configs/abi/UniswapLPTABI'

import { removeLiquidity, getAmountOfLockedTokens } from '~/mixins/stake'

import config from '~/configs/config'

export default {
  data() {
    return {
      ui: {
        showSuccess: false,
        showRejected: false,
        showAwaiting: false,
      },
      uToken: null,
      uTokenAmount: null,
      txLink: '',
      liquidity: null,
    }
  },

  computed: {
    isWalletConnected() {
      return !!this.$store.state.address
    },
    isSufficentBalance() {
      return (
        this.uToken &&
        parseFloat(this.uTokenAmount) > parseFloat(this.uToken.uTokenbalance) &&
        parseFloat(this.uTokenAmount) > parseFloat(this.uToken.tokenBalance)
      )
    },
    shouldDisableRemove() {
      return (
        !this.uToken ||
        !this.uTokenAmount ||
        // eslint-disable-next-line eqeqeq
        Number(this.uTokenAmount).toFixed(18) == 0.0 ||
        this.isSufficentBalance ||
        !this.uToken.uTokenAllowance ||
        !this.uToken.tokenAllowance
      )
    },
    getDisabledClass() {
      return 'bg-gray-500 dark:bg-gray-900 text-gray-600 dark:text-gray-700 cursor-not-allowed'
    },

    getActiveClass() {
      return 'bg-light-primary text-light-primary dark:bg-dark-primary bg-opacity-25 dark:text-white'
    },
  },

  watch: {
    uToken(a) {
      this.fetchLiquidity(a)
    },
  },

  methods: {
    async fetchLiquidity(uToken) {
      this.ui.loading = true
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const userAddress = provider.getSigner().getAddress()
      const poolTokenContract = new ethers.Contract(
        uToken.lptAddress,
        UniswapLPTABI,
        signer
      )
      await poolTokenContract.balanceOf(userAddress)
      const poolInfo = await getAmountOfLockedTokens(uToken.lptAddress)
      this.liquidity = {
        token0: poolInfo.token0,
        token1: poolInfo.token1,
        totalLiquidity: poolInfo.token0 + poolInfo.token1,
        poolShare: poolInfo.poolShare,
      }
    },
    async approve(tokenAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = await new ethers.Contract(tokenAddress, ERC20ABI, signer)
      try {
        const totalSupply = contract.totalSupply()
        const approve = await contract.approve(
          config.contracts.uniswapRouter,
          totalSupply
        )
        this.ui.showSuccess = true
        this.txLink = approve.hash
      } catch (error) {
        this.ui.showRejected = true
      }
    },

    async removeLiquidity() {
      this.ui.showAwaiting = true
      try {
        // let amount = ethers.utils
        //   .parseEther(this.uTokenAmount)
        //   .toString()
        //   .slice(0, 18)

        // amount = amount.toString()

        const transaction = await removeLiquidity(
          this.uToken.token.address,
          this.uToken.address,
          this.uTokenAmount,
          this.uTokenAmount
        )
        this.txLink = transaction.hash
        this.ui.showAwaiting = false
        this.ui.showSuccess = true
      } catch (error) {
        // eslint-disable-next-line eqeqeq
        if (error.code == 4001) {
          this.ui.showAwaiting = false
        }
        this.ui.showAwaiting = false
        this.ui.showRejected = true
      }
    },
  },
}
</script>

<style></style>
