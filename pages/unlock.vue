<template>
  <div class="main_container my-4 md:my-8">
    <div class="flex flex-col items-center w-full space-y-6 p-4">
      <div class="flex w-full items-center justify-between">
        <nuxt-link to="/">
          <button class="focus:outline-none">
            <i
              class="fas fa-chevron-left text-gray-900 dark:text-white text-lg"
            ></i>
          </button>
        </nuxt-link>
        <p class="text-center font-medium dark:text-white text-lg">Unlock</p>
        <button
          v-tooltip.auto="{
            content: 'Unlock your liquidity pool tokens by burning UND.',
            autoHide: true,
            trigger: 'hover',
          }"
          class="focus:outline-none"
        >
          <i class="far fa-question-circle text-gray-600 text-lg"></i>
        </button>
      </div>

      <input-field
        v-model="LPTAmount"
        label="Unlock"
        :pool-token.sync="poolToken"
        type="unlock"
        @focus="LPTAmountField = true"
        @blur="LPTAmountField = false"
      />

      <i
        v-if="poolToken"
        class="fas fa-arrow-down text-gray-800 dark:text-gray-600"
      ></i>

      <input-field
        v-if="poolToken"
        v-model="uTokenAmount"
        label="Burn"
        :loading="ui.priceLoader"
        @focus="uTokenAmountField = true"
        @blur="uTokenAmountField = false"
      >
        <template v-slot:showBalance>
          <p v-if="poolToken" class="text-xs text-gray-500">
            Balance:
            <span
              class="font-mono text-gray-900 dark:text-gray-500 font-medium"
              >{{
                poolToken.uToken.symbol == 'UND'
                  ? toFixed(poolToken.uTokenBalance || '').slice(0, 6)
                  : toFixed(poolToken.uTokenBalance || '').slice(0, 18)
              }}</span
            >
          </p>
        </template>
        <template v-slot:append>
          <div class="flex flex-col">
            <div class="flex items-center focus:outline-none">
              <img
                :src="require(`~/assets/tokens/${poolToken.uToken.icon}`)"
                width="16"
                :alt="`${poolToken.uToken.symbol} logo`"
                style="max-width: 16px; max-height: 22px"
              />
              <div class="flex items-center p-1">
                <p
                  class="text-gray-900 font-semibold text-right dark:text-gray-500"
                >
                  {{ poolToken.uToken.symbol }}
                </p>
              </div>
            </div>
            <span class="text-xs text-right text-gray-500 dark:text-gray-700"
              >Unbound</span
            >
          </div>
        </template>
      </input-field>

      <button
        v-if="isWalletConnected"
        class="font-medium w-full py-2 rounded-md focus:outline-none"
        :class="[
          !poolToken ? getDisabledClass : getActiveClass,
          !LPTAmount ? getDisabledClass : getActiveClass,
          isSufficientBalance ? getDisabledClass : getActiveClass,
          Number(LPTAmount).toFixed(18) == 0.0
            ? getDisabledClass
            : getActiveClass,
        ]"
        :disabled="shouldDisableUnlock"
        @click="unlock(poolToken)"
      >
        <span v-if="!poolToken">Select Pool Token</span>
        <span v-else-if="!LPTAmount">Enter An Amount</span>
        <span v-else-if="Number(LPTAmount).toFixed(18) == 0.0"
          >Amount should be greater than 0</span
        >
        <span v-else-if="isSufficientBalance">Insufficient Balance</span>
        <span v-else>Unlock</span>
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
// import Web3 from 'web3'
import { toFixed } from '~/utils'

import UniswapLPTABI from '~/configs/abi/UniswapLPTABI'
import UnboundLLCABI from '~/configs/abi/UnboundLLCABI'
import UnboundDaiABI from '~/configs/abi/UnboundDai'

import supportedPoolTokens from '~/configs/supportedPoolTokens'

import { getDecimals } from '~/mixins/ERC20'
import { getLLC } from '~/mixins/valuator'
import { getLockedLPT } from '~/mixins/info'

export default {
  data() {
    return {
      ui: {
        showDialog: false,
        showSuccess: false,
        showRejected: false,
        showAwaiting: false,
        priceLoader: false,
      },

      LPTAmount: null,
      uTokenAmount: null,
      poolToken: null,
      txLink: '',
      uTokenBalance: null,
      supportedPoolTokens,
      loanRatioPerLPT: '',
      llc: {
        loanRate: '',
        fee: '',
      },
    }
  },

  computed: {
    UNDOutput() {
      return this.LPTAmount * this.loanRatioPerLPT
    },

    LPTOutput() {
      return this.uTokenAmount / this.loanRatioPerLPT
    },
    isWalletConnected() {
      return !!this.$store.state.address
    },
    isSufficientBalance() {
      if (this.poolToken) {
        if (
          parseFloat(this.LPTAmount) >
            parseFloat(this.poolToken.lockedBalance) ||
          parseFloat(this.uTokenAmount) >
            parseFloat(this.poolToken.uTokenBalance)
        ) {
          return true
        } else {
          return false
        }
      }
      return false
    },
    shouldDisableUnlock() {
      return (
        !this.poolToken ||
        !this.LPTAmount ||
        // eslint-disable-next-line eqeqeq
        Number(this.LPTAmount).toFixed(18) == 0.0 ||
        this.isSufficientBalance
      )
    },

    getDisabledClass() {
      return 'bg-gray-300 dark:bg-gray-900 text-gray-600 dark:text-gray-700 cursor-not-allowed'
    },

    getActiveClass() {
      return 'bg-light-primary text-white dark:bg-dark-primary'
    },
  },
  watch: {
    poolToken(a) {
      this.getLoanRatioPerLPT(a)
    },
    UNDOutput(a) {
      if (a === 0 || a === '0') {
        this.uTokenAmount = null
        return
      }
      if (!this.uTokenAmountField) this.uTokenAmount = toFixed(a)
    },
    LPTOutput(a) {
      if (a === 0 || a === '0') {
        this.LPTAmount = null
        return
      }
      if (!this.LPTAmountField) this.LPTAmount = toFixed(a)
    },
  },

  methods: {
    toFixed,
    async getLoanRatioPerLPT(poolToken) {
      this.ui.priceLoader = true
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = await new ethers.Contract(
        poolToken.address,
        UniswapLPTABI,
        signer
      )
      const reserve = await contract.getReserves()
      const LPTTotalSupply = await contract.totalSupply()
      const token0 = await contract.token0()
      const token1 = await contract.token1()
      const llc = await getLLC(poolToken.llcAddress)
      if (token0.toLowerCase() === poolToken.stablecoin.toLowerCase()) {
        const stablecoinDecimal = await getDecimals(token0)
        let difference
        let totalValueInDai
        totalValueInDai = reserve[0].toString() * 2
        // first case: tokenDecimal is smaller than 18
        // for stablecoins with less than 18 decimals
        if (stablecoinDecimal < '18' && stablecoinDecimal >= '0') {
          // calculate amount of decimals under 18
          difference = 18 - stablecoinDecimal
          totalValueInDai = totalValueInDai * 10 ** difference
        } else if (stablecoinDecimal > '18') {
          // caclulate amount of decimals over 18
          difference = stablecoinDecimal - 18
          // removes decimals to match 18
          totalValueInDai = totalValueInDai / 10 ** difference
        }
        this.loanRatioPerLPT =
          ((totalValueInDai / LPTTotalSupply) * llc.loanRate) / 1e6
        this.LPTPrice = (totalValueInDai / LPTTotalSupply)
          .toFixed(8)
          .slice(0, -1)
        this.ui.priceLoader = false
      } else {
        const stablecoinDecimal = await getDecimals(token1)
        let difference
        let totalValueInDai
        // first case: tokenDecimal is smaller than 18
        // for stablecoins with less than 18 decimals
        totalValueInDai = reserve[1].toString() * 2
        if (stablecoinDecimal < '18' && stablecoinDecimal >= '0') {
          // calculate amount of decimals under 18
          difference = 18 - stablecoinDecimal
          totalValueInDai = totalValueInDai * 10 ** difference
        } else if (stablecoinDecimal > '18') {
          // caclulate amount of decimals over 18
          difference = stablecoinDecimal - 18
          // removes decimals to match 18
          totalValueInDai = totalValueInDai / 10 ** difference
        }

        this.loanRatioPerLPT =
          ((totalValueInDai / LPTTotalSupply) * llc.loanRate) / 1e6
        this.LPTPrice = (totalValueInDai / LPTTotalSupply)
          .toFixed(8)
          .slice(0, -1)
        this.ui.priceLoader = false
      }
    },

    async unlock(poolToken) {
      this.ui.showAwaiting = true
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = await new ethers.Contract(
        poolToken.llcAddress,
        UnboundLLCABI,
        signer
      )

      let rawUNDAmount = ethers.utils.parseEther(
        this.uTokenAmount.toString().slice(0, 18)
      )

      rawUNDAmount = rawUNDAmount.toString()

      // let rawLPTAmount = ethers.utils.parseEther(
      //   this.LPTAmount.toString().slice(0, 18)
      // )
      // rawLPTAmount = rawLPTAmount.toString()
      try {
        const unlock = await contract.unlockLPT(rawUNDAmount)
        this.ui.showAwaiting = false
        this.txLink = unlock.hash
        this.ui.showSuccess = true

        // initiate the UND contract to detect the event so we can update the balances
        const UND = new ethers.Contract(
          poolToken.uToken.address,
          UnboundDaiABI,
          signer
        )
        // listen to unlock event from UND contract
        UND.on('Burn', async (user, amount) => {
          const LPTBalance = await getLockedLPT(poolToken.address)
          this.poolToken.lockedBalance = LPTBalance
        })
      } catch (error) {
        if (error.code !== 4001) {
          this.$logRocket.captureException(error, {
            tags: {
              function: 'unlock',
            },
            extra: {
              pageName: 'Unlock',
            },
          })
          this.$logRocket.identify(this.$store.state.address)
        }
        this.ui.showAwaiting = false
        this.ui.showRejected = true
      }
    },

    setInputMax() {
      this.LPTAmount = this.poolToken.lockedBalance
    },
  },
}
</script>
