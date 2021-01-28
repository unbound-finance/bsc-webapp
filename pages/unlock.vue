<template>
  <div
    class="relative flex flex-col items-center justify-center flex-wrap my-4 md:my-8 p-4"
  >
    <div class="main_container">
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
            shouldDisableUnlock ? getDisabledClass : getActiveClass,
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
          <template v-else-if="llcDetails && llcDetails.minValue > 0">
            <span class="text-xs"
              >You need min. {{ Number(llcDetails.minValue).toFixed(4) }}
              {{ poolToken.uToken.symbol }} to unlock {{ LPTAmount }}
              {{ poolToken.name }}</span
            >
          </template>
          <span v-else>Unlock</span>
        </button>
        <ConnectWalletBtn v-else class="w-full" />
      </div>

      <SuccessModal v-model="ui.showSuccess" :hash="txLink" />
      <RejectedModal v-model="ui.showRejected" />
      <AwaitingModal v-model="ui.showAwaiting" />
    </div>

    <!-- Show fees -->
    <div
      v-if="(LPTAmount || uTokenAmount) && poolToken"
      class="bottom-container"
    >
      <div class="px-4">
        <div class="flex flex-col space-y-1">
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Price Per LPT
            </p>
            <p class="font-medium text-sm dark:text-white font-mono">
              <template v-if="llcDetails">
                {{ llcDetails.LPTPrice }}
                {{ poolToken.uToken.symbol }}
              </template>
              <template v-else
                >-
                {{ poolToken.uToken.symbol }}
              </template>
            </p>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600 dark:text-gray-400">Current Loan</p>
            <p class="font-medium text-sm dark:text-white font-mono">
              <template v-if="llcDetails">
                {{ (llcDetails.currentLoan / 1e18) | toFixed(4) }}
                {{ poolToken.uToken.symbol }}
              </template>
              <template v-else
                >-
                {{ poolToken.uToken.symbol }}
              </template>
            </p>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Collateralization Ratio
            </p>
            <p class="font-medium text-sm dark:text-white font-mono">
              <template v-if="llcDetails">
                {{ Number(llcDetails.cr) / 100 }}% {{ LPTOutput }}
              </template>
              <template v-else>- %</template>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toFixed } from '~/utils'
import core from '~/mixins/core'

export default {
  mixins: [core],
  computed: {
    UNDOutput() {
      if (this.llcDetails) {
        return (
          this.llcDetails.currentLoan -
          ((this.LPTAmount * 1e18 - this.LPTOutput) *
            this.llcDetails.LPTValue) /
            (this.llcDetails.cr / 10000)
        )
        // const value =
        //   (this.LPTAmount * 1e18 * this.llcDetails.LPTPrice) /
        //   (this.llcDetails.cr / 10000)
        // return value / 1e18
      } else return 0
    },
    LPTOutput() {
      if (this.llcDetails) {
        return (
          (this.llcDetails.LPTValue -
            (this.llcDetails.cr / 10000) *
              (this.llcDetails.currentLoan - this.uTokenAmount * 1e18)) /
          this.llcDetails.LPTPrice
        )
      } else {
        return 0
      }
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
        } else return false
      }
      return false
    },
    shouldDisableUnlock() {
      if (this.llcDetails) {
        return (
          !this.poolToken ||
          !this.LPTAmount ||
          // eslint-disable-next-line eqeqeq
          Number(this.LPTAmount).toFixed(18) == 0.0 ||
          this.isSufficientBalance ||
          this.llcDetails.minValue > 0
        )
      } else return false
    },

    getDisabledClass() {
      return 'bg-gray-300 dark:bg-gray-900 text-gray-600 dark:text-gray-700 cursor-not-allowed'
    },

    getActiveClass() {
      return 'bg-light-primary text-white dark:bg-dark-primary'
    },
  },
  watch: {
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
    setInputMax() {
      this.LPTAmount = this.poolToken.lockedBalance
    },
  },
}
</script>
