<template>
  <div
    class="relative flex flex-col items-center justify-center flex-wrap my-4 md:my-8 p-4"
  >
    <!-- Main Card -->
    <div class="dark:bg-dark-bg main_container">
      <div class="flex flex-col items-center w-full py-4 space-y-4 px-4">
        <div class="flex w-full items-center justify-between">
          <nuxt-link to="/">
            <button class="focus:outline-none">
              <i
                class="fas fa-chevron-left text-gray-900 dark:text-white text-lg"
              ></i>
            </button>
          </nuxt-link>
          <p class="text-center font-medium dark:text-white text-lg">Mint</p>
          <button
            v-tooltip.auto="{
              content: 'Mint UND by locking your liquidity provider tokens.',
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
          label="Lock"
          :pool-token.sync="poolToken"
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
          label="Mint"
          :loading="ui.priceLoader"
          @focus="uTokenAmountField = true"
          @blur="uTokenAmountField = false"
        >
          <template v-slot:append>
            <div class="flex flex-col">
              <div class="flex items-center justify-end focus:outline-none">
                <img
                  :src="require(`~/assets/tokens/${poolToken.uToken.icon}`)"
                  width="16"
                  :alt="`${poolToken.uToken.symbol} logo`"
                  style="max-width: 16px; max-height: 22px"
                />
                <div class="flex items-center pl-1">
                  <p
                    class="text-gray-900 dark:text-gray-500 font-semibold text-right"
                  >
                    {{ poolToken.uToken.symbol }}
                  </p>
                </div>
              </div>
              <span
                class="text-xs whitespace-no-wrap text-right text-gray-500 dark:text-gray-700"
                >{{ poolToken.uToken.displayName }}</span
              >
            </div>
          </template>
        </input-field>

        <div
          v-if="LPTAmount && poolToken"
          class="w-full flex items-center justify-between px-2"
        >
          <p class="text-sm text-gray-600">Price Per LP Token</p>
          <div v-if="ui.priceLoader" class="loading-dots text-2xl">.</div>
          <p
            v-else-if="llcDetails"
            class="font-medium text-sm dark:text-white font-mono"
          >
            {{ llcDetails.LPTPrice }} {{ poolToken && poolToken.uToken.symbol }}
          </p>
        </div>

        <mint-button
          v-if="isWalletConnected"
          :l-p-t-amount="LPTAmount"
          :pool-token="poolToken"
          @click="mint(poolToken)"
        />
        <ConnectWalletBtn v-else class="w-full" />
      </div>

      <!-- Transaction confirmation Modal -->
      <Modal v-if="poolToken" v-model="ui.showConfirmation">
        <template>
          <div class="flex flex-col">
            <div style="padding: 24px">
              <div class="flex justify-between items-center">
                <p class="text-xl font-medium dark:text-white">Confirm Mint</p>
                <button
                  type="button"
                  class="focus:outline-none"
                  @click="ui.showConfirmation = false"
                >
                  <i
                    class="fas fa-times text-lg text-gray-900 dark:text-gray-500"
                  ></i>
                </button>
              </div>

              <div class="flex flex-col mt-4">
                <div class="flex w-full items-center justify-between">
                  <div class="flex items-center">
                    <double-logo
                      :token0logo="poolToken.currencyOneLogo"
                      :token1logo="poolToken.currencyTwoLogo"
                    />
                    <div class="flex flex-col">
                      <span
                        class="font-mono dark:text-white"
                        :class="lptTextSize"
                        >{{ LPTAmount }}</span
                      >
                      <p
                        class="font-mono font-medium text-gray-600 dark:text-gray-700"
                      >
                        {{ poolToken.name }}
                      </p>
                    </div>
                  </div>
                </div>
                <i
                  class="fas fa-arrow-down text-xs my-2 text-gray-600 dark:text-gray-700 mx-2"
                ></i>
                <div class="flex w-full items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <img
                      class="w-24 h-24 mr-4"
                      :src="require(`~/assets/tokens/${poolToken.uToken.icon}`)"
                      width="16"
                      :alt="`${poolToken.uToken.symbol} logo`"
                      style="max-width: 24px; max-height: 24px"
                    />
                    <div class="flex flex-col">
                      <span
                        class="font-mono dark:text-white"
                        :class="uTokenTextSize"
                        >{{ uTokenAmount }}</span
                      >
                      <p
                        class="font-mono font-medium text-gray-600 dark:text-gray-700"
                      >
                        {{ poolToken.uToken.symbol }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gray-200 dark:bg-gray-800" style="padding: 24px">
              <div class="flex flex-col space-y-1">
                <div class="flex items-center justify-between">
                  <p
                    class="text-sm font-medium text-gray-600 dark:text-gray-400"
                  >
                    Loan to Value
                  </p>
                  <p class="font-medium font-mono dark:text-white">
                    <template v-if="llcDetails">
                      {{ llcDetails.loanRate / 1e4 }}%
                    </template>
                    <template v-else>-</template>
                  </p>
                </div>
                <div class="flex items-center justify-between">
                  <p
                    class="text-sm font-medium text-gray-600 dark:text-gray-400"
                  >
                    Minimum Receivable
                  </p>
                  <p class="font-medium font-mono dark:text-white">
                    <template v-if="llcDetails">
                      {{
                        Number(
                          parseFloat(LPTAmount) * llcDetails.loanRatioPerLPT -
                            parseFloat(LPTAmount) *
                              llcDetails.loanRatioPerLPT *
                              0.02
                        ).toFixed(4)
                      }}
                    </template>
                    <template v-else>-</template>
                  </p>
                </div>

                <div class="flex items-center justify-between pt-4">
                  <p
                    class="text-sm font-medium text-gray-600 dark:text-gray-400"
                  >
                    Estimated {{ poolToken.uToken.symbol }} To Mint
                  </p>
                  <p class="font-medium font-mono dark:text-white">
                    {{ uTokenAmount | toFixed(2) }}
                    {{ poolToken.uToken.symbol }}
                  </p>
                </div>
                <div class="flex items-center justify-between">
                  <p
                    class="text-sm font-medium text-gray-600 dark:text-gray-400"
                  >
                    <template v-if="llcDetails">
                      Minting Fees ({{ Number((llcDetails.fee * 100) / 1e6) }}%)
                    </template>
                    <template v-else> Minting Fees </template>
                  </p>
                  <p class="font-medium font-mono dark:text-white">
                    <template v-if="llcDetails">
                      -{{
                        Number(
                          (Number(uTokenAmount) *
                            Number((llcDetails.fee * 100) / 1e6)) /
                            100
                        ) | toFixed(2)
                      }}
                      {{ poolToken.uToken.symbol }}
                    </template>
                    <template v-else>- {{ poolToken.uToken.symbol }}</template>
                  </p>
                </div>
                <div
                  class="border-b border-dashed border-gray-600 dark:border-gray-400"
                ></div>
                <div class="flex items-center justify-between">
                  <p
                    class="text-sm font-medium text-gray-600 dark:text-gray-400"
                  >
                    Receivable {{ poolToken.uToken.symbol }}
                  </p>
                  <p class="font-medium font-mono dark:text-white">
                    <template v-if="llcDetails">
                      {{
                        (Number(uTokenAmount).toFixed(2) -
                          Number(
                            (Number(uTokenAmount) *
                              Number((llcDetails.fee * 100) / 1e6)) /
                              100
                          ).toFixed(2))
                          | toFixed(2)
                      }}
                      {{ poolToken.uToken.symbol }}
                    </template>
                    <template v-else>- {{ poolToken.uToken.symbol }}</template>
                  </p>
                </div>
                <div
                  class="border-b border-dashed border-gray-600 dark:border-gray-400"
                ></div>
                <p
                  class="text-sm text-gray-600 dark:text-gray-400 italic font-medium pt-4"
                >
                  You will have to payback
                  <span
                    class="text-light-primary dark:text-dark-primary text-sm italic font-medium"
                    >{{ uTokenAmount | toFixed(2) }}
                    {{ poolToken.uToken.symbol }}</span
                  >
                  for unlocking your
                  <span
                    class="text-light-primary dark:text-dark-primary text-sm italic font-medium"
                    >{{ LPTAmount | toFixed(2) }} {{ poolToken.name }}</span
                  >.
                </p>
              </div>
              <button
                class="w-full mt-4 py-4 bg-light-primary dark:bg-dark-primary font-medium text-white appearance-none focus:outline-none"
                style="border-radius: 12px"
                @click="mint(poolToken)"
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

    <!-- Show fees -->
    <div v-if="LPTAmount && poolToken" class="bottom-container">
      <div class="px-4">
        <div class="flex flex-col space-y-1">
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              <template v-if="llcDetails">
                Minting Fees ({{ Number((llcDetails.fee * 100) / 1e6) }}%)
              </template>
              <template v-else>Minting Fees</template>
            </p>
            <p class="font-medium text-sm dark:text-white font-mono">
              <template v-if="llcDetails">
                {{
                  Number(
                    (Number(UNDOutput) * Number((llcDetails.fee * 100) / 1e6)) /
                      100 || ''
                  ).toFixed(4)
                }}
                {{ poolToken.uToken.symbol }}
              </template>
              <template v-else> - {{ poolToken.uToken.symbol }} </template>
            </p>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Minimum Receivable
            </p>
            <p class="font-medium text-sm dark:text-white font-mono">
              <template v-if="llcDetails">
                {{
                  Number(
                    parseFloat(LPTAmount) * llcDetails.loanRatioPerLPT -
                      parseFloat(LPTAmount) * llcDetails.loanRatioPerLPT * 0.02
                  ).toFixed(4)
                }}
                {{ poolToken.uToken.symbol }}
              </template>
              <template v-else> - {{ poolToken.uToken.symbol }} </template>
            </p>
          </div>
          <div class="flex items-center justify-between pb-2">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Loan to Value
            </p>
            <p class="font-medium text-sm dark:text-white font-mono">
              <template v-if="llcDetails">
                {{ llcDetails.loanRate / 1e4 }}%
              </template>
              <template v-else> - </template>
            </p>
          </div>

          <div class="border-b border-gray-200 dark:border-gray-800"></div>
          <p class="py-2 font-medium text-gray-800 dark:text-gray-200">
            Your Position
          </p>
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Currently Minted
            </p>
            <p class="font-medium text-sm dark:text-white font-mono">
              {{
                poolToken.uToken.symbol == 'UND'
                  ? toFixed(poolToken.mintedUTokens || '').slice(0, 6)
                  : toFixed(poolToken.mintedUTokens || '').slice(0, 18)
              }}
              {{ poolToken.uToken.symbol }}
            </p>
          </div>
          <div class="flex items-center justify-between pb-2">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Currently Locked
            </p>
            <p class="font-medium text-sm dark:text-white font-mono">
              {{ toFixed(poolToken.lockedBalance || '').slice(0, 18) }}
            </p>
          </div>
          <a
            :href="`https://${this.$store.state.network}.etherscan.io/address/${poolToken.address}`"
            target="_blank"
            rel="noopener noreferrer"
            class="p-1 mt-2 z-10 w-full text-center border rounded-md border-light-primary dark:border-dark-primary text-xs font-mono text-light-primary dark:text-dark-primary"
          >
            {{ poolToken.name }} Contract Address
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { countDecimals, toFixed } from '~/utils'
import core from '~/mixins/core'
import MintButton from '~/components/AppButton/MintButton.vue'

export default {
  components: { MintButton },
  mixins: [core],
  computed: {
    UNDOutput() {
      if (!this.llcDetails) return 0
      return this.LPTAmount * this.llcDetails.loanRatioPerLPT
    },

    LPTOutput() {
      if (!this.llcDetails) return 0
      return this.uTokenAmount / this.llcDetails.loanRatioPerLPT
    },

    isWalletConnected() {
      return !!this.$store.state.address
    },

    isSufficentBalance() {
      return (
        this.poolToken &&
        parseFloat(this.LPTAmount) > parseFloat(this.poolToken.balance)
      )
    },

    shouldDisableMint() {
      return (
        !this.poolToken ||
        !this.LPTAmount ||
        // eslint-disable-next-line eqeqeq
        Number(this.LPTAmount).toFixed(18) == 0.0 ||
        this.isSufficentBalance
      )
    },

    lptTextSize() {
      const decimals = countDecimals(this.LPTAmount)
      if (decimals >= 0 && decimals <= 6) return 'text-3xl'
      else if (decimals >= 6 && decimals <= 12) return 'text-2xl'
      else if (decimals > 12 && decimals <= 18) return 'text-xl'
      return 'text-lg'
    },

    uTokenTextSize() {
      const decimals = countDecimals(this.uTokenAmount)
      if (decimals >= 0 && decimals <= 6) return 'text-3xl'
      else if (decimals >= 6 && decimals <= 12) return 'text-2xl'
      else if (decimals > 12 && decimals <= 18) return 'text-xl'
      return 'text-lg'
    },
  },

  watch: {
    UNDOutput(a) {
      if (a === 0 || a === '0') {
        this.uTokenAmount = null
        return
      }
      if (!this.uTokenAmountField) this.uTokenAmount = this.$normalizedNumber(a)
    },
    LPTOutput(a, b) {
      if (a === 0 || a === '0') {
        this.LPTAmount = null
        return
      }
      if (!this.LPTAmountField) this.LPTAmount = this.$normalizedNumber(a)
    },
  },

  methods: {
    toFixed,
    setInputMax() {
      this.LPTAmount = this.poolToken.balance
    },
  },
}
</script>

<style lang="scss"></style>
