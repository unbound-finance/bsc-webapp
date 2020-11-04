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
              <div class="flex items-center focus:outline-none">
                <img
                  :src="require(`~/assets/tokens/${poolToken.uToken.icon}`)"
                  width="16"
                  :alt="`${poolToken.uToken.symbol} logo`"
                  style="max-width: 16px; max-height: 22px"
                />
                <div class="flex items-center p-1">
                  <p
                    class="text-gray-900 dark:text-gray-500 font-semibold text-right"
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

        <div
          v-if="LPTAmount && poolToken"
          class="w-full flex items-center justify-between px-2"
        >
          <p class="text-sm text-gray-600">Price Per LP Token</p>
          <div v-if="ui.priceLoader" class="loading-dots text-2xl">.</div>
          <p v-else class="font-medium text-sm dark:text-white font-mono">
            {{ LPTPrice }} {{ poolToken && poolToken.uToken.symbol }}
          </p>
        </div>

        <button
          v-if="isWalletConnected"
          class="font-medium w-full py-2 rounded-md focus:outline-none"
          :class="[
            !poolToken ? getDisabledClass : getActiveClass,
            !LPTAmount ? getDisabledClass : getActiveClass,
            LPTAmount === '0' ? getDisabledClass : getActiveClass,
            isSufficentBalance ? getDisabledClass : getActiveClass,
            Number(LPTAmount).toFixed(18) == 0.0
              ? getDisabledClass
              : getActiveClass,
          ]"
          :disabled="shouldDisableMint"
          @click="ui.showConfirmation = true"
        >
          <span v-if="!poolToken">Select Pool Token</span>
          <span v-else-if="!LPTAmount || LPTAmount === '0'"
            >Enter An Amount</span
          >
          <span v-else-if="isSufficentBalance">Insufficient Balance</span>
          <span v-else-if="Number(LPTAmount).toFixed(18) == 0.0"
            >Amount should be greater than 0</span
          >
          <span v-else>Mint</span>
        </button>

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
                    <span class="text-3xl font-mono dark:text-white">
                      {{ Number(LPTAmount).toFixed(2) }}
                    </span>
                  </div>
                  <p class="text-2xl font-mono font-medium dark:text-white">
                    {{ poolToken.name }}
                  </p>
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
                    <span class="text-3xl font-mono dark:text-white">{{
                      Number(uTokenAmount).toFixed(2)
                    }}</span>
                  </div>
                  <p class="text-2xl font-mono font-medium dark:text-white">
                    {{ poolToken.uToken.symbol }}
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-gray-200 dark:bg-gray-800" style="padding: 24px">
              <div class="flex flex-col space-y-1">
                <div class="flex items-center justify-between">
                  <p
                    class="text-sm font-medium text-gray-600 dark:text-gray-400"
                  >
                    Funding Rate
                  </p>
                  <p class="font-medium font-mono dark:text-white">
                    {{ (llc.loanRate * 100) / 1e6 }}%
                  </p>
                </div>
                <div class="flex items-center justify-between">
                  <p
                    class="text-sm font-medium text-gray-600 dark:text-gray-400"
                  >
                    Minimum Receivable
                  </p>
                  <p class="font-medium font-mono dark:text-white">
                    {{
                      Number(
                        parseFloat(LPTAmount) * loanRatioPerLPT -
                          parseFloat(LPTAmount) * loanRatioPerLPT * 0.02
                      ).toFixed(4)
                    }}
                  </p>
                </div>

                <div class="flex items-center justify-between pt-4">
                  <p
                    class="text-sm font-medium text-gray-600 dark:text-gray-400"
                  >
                    Estimated {{ poolToken.uToken.symbol }} To Mint
                  </p>
                  <p class="font-medium font-mono dark:text-white">
                    {{ Number(uTokenAmount).toFixed(2) }}
                    {{ poolToken.uToken.symbol }}
                  </p>
                </div>
                <div class="flex items-center justify-between">
                  <p
                    class="text-sm font-medium text-gray-600 dark:text-gray-400"
                  >
                    Minting Fees ({{ Number((llc.fee * 100) / 1e6) }}%)
                  </p>
                  <p class="font-medium font-mono dark:text-white">
                    -{{
                      Number(
                        (Number(uTokenAmount) * Number((llc.fee * 100) / 1e6)) /
                          100
                      ).toFixed(2)
                    }}
                    {{ poolToken.uToken.symbol }}
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
                    {{
                      Number(
                        Number(uTokenAmount).toFixed(2) -
                          Number(
                            (Number(uTokenAmount) *
                              Number((llc.fee * 100) / 1e6)) /
                              100
                          ).toFixed(2)
                      ).toFixed(2)
                    }}
                    {{ poolToken.uToken.symbol }}
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
                    >{{ Number(uTokenAmount).toFixed(2) }}
                    {{ poolToken.uToken.symbol }}</span
                  >
                  for unlocking your
                  <span
                    class="text-light-primary dark:text-dark-primary text-sm italic font-medium"
                    >{{ Number(LPTAmount).toFixed(2) }}
                    {{ poolToken.name }}</span
                  >.
                </p>
              </div>
              <button
                class="w-full mt-4 py-4 bg-light-primary dark:bg-dark-primary font-medium text-white appearance-none focus:outline-none"
                style="border-radius: 12px"
                @click="
                  mint(
                    poolToken.address,
                    poolToken.llcAddress,
                    poolToken.uToken.address
                  )
                "
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
              Minting Fees ({{ Number((llc.fee * 100) / 1e6) }}%)
            </p>
            <p class="font-medium text-sm dark:text-white font-mono">
              {{
                Number(
                  (Number(UNDOutput) * Number((llc.fee * 100) / 1e6)) / 100 ||
                    ''
                ).toFixed(4)
              }}
              {{ poolToken.uToken.symbol }}
            </p>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Minimum Receivable
            </p>
            <p class="font-medium text-sm dark:text-white font-mono">
              {{
                Number(
                  parseFloat(LPTAmount) * loanRatioPerLPT -
                    parseFloat(LPTAmount) * loanRatioPerLPT * 0.02
                ).toFixed(4)
              }}
              {{ poolToken.uToken.symbol }}
            </p>
          </div>
          <div class="flex items-center justify-between pb-2">
            <p class="text-sm text-gray-600 dark:text-gray-400">Funding Rate</p>
            <p class="font-medium text-sm dark:text-white font-mono">
              {{ (llc.loanRate * 100) / 1e6 }}%
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
              {{ toFixed(poolToken.lockedBalance || '').slice(0, 8) }}
              {{ poolToken.name }}
            </p>
          </div>
          <!-- <a
            :href="`https://${this.$store.state.network}.etherscan.io/address/${poolToken.address}`"
            target="_blank"
            rel="noopener noreferrer"
            class="p-1 mt-2 z-10 w-full text-center border rounded-md border-light-primary dark:border-dark-primary text-xs font-mono text-light-primary dark:text-dark-primary"
          >
            {{ poolToken.name }} Contract Address
          </a> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import components

import { ethers } from 'ethers'
import Web3 from 'web3'

import { toFixed } from '~/utils'

import UnboundDaiABI from '~/configs/abi/UnboundDai.js'
import UniswapLPTABI from '~/configs/abi/UniswapLPTABI'
import UnboundLLCABI from '~/configs/abi/UnboundLLCABI'

// import contractAddresses from '~/configs/addresses'
import supportedPoolTokens from '~/configs/supportedPoolTokens'

// import signature from '~/mixins/signature'
import { getNonce, getEIP712Signature } from '~/mixins/crypto'
import { getTokenBalance, getDecimals } from '~/mixins/ERC20'
import { getLLC } from '~/mixins/valuator'

export default {
  data() {
    return {
      ui: {
        showDialog: false,
        showConfirmation: false,
        showSuccess: false,
        showRejected: false,
        showAwaiting: false,
        priceLoader: false,
      },
      poolToken: null,
      LPTAmount: null,
      uTokenAmount: null,
      LPTPrice: '',
      loanRatioPerLPT: '',
      txLink: '',
      supportedPoolTokens,
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

    getDisabledClass() {
      return 'bg-gray-500 dark:bg-gray-900 text-gray-600 dark:text-gray-700 cursor-not-allowed'
    },

    getActiveClass() {
      return 'bg-light-primary text-light-primary dark:bg-dark-primary bg-opacity-25 dark:text-white'
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
    LPTOutput(a, b) {
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
      this.llc.loanRate = llc.loanRate
      this.llc.fee = llc.fee
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
          .toFixed(4)
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
          .toFixed(4)
          .slice(0, -1)
        this.ui.priceLoader = false
      }
    },

    async mint(poolTokenAddress, llcAddress, uToken) {
      this.ui.showAwaiting = true
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()

      const userAddress = await signer.getAddress()
      const nonce = await getNonce(poolTokenAddress, signer)
      const deadline = +new Date() + 5000

      let amount = ethers.utils.parseEther(
        this.LPTAmount.toString().slice(0, 18)
      )
      amount = amount.toString()

      // let minAmount =
      //   (this.LPTAmount * this.loanRatioPerLPT -
      //     this.LPTAmount * this.loanRatioPerLPT * 0.2) *
      //   1e18

      // await this.getLoanRatioPerLPT()

      let minAmount = toFixed(
        (parseFloat(this.LPTAmount) * this.loanRatioPerLPT -
          parseFloat(this.LPTAmount) * this.loanRatioPerLPT * 0.02) *
          1e18
      )

      minAmount = minAmount.toString()

      let minAmountFees =
        (parseFloat(minAmount) * parseFloat(this.llc.fee)) / 1e6

      minAmountFees = minAmountFees.toString()

      const finalMinAmount = toFixed(minAmount - minAmountFees).toString()

      console.log({
        minAmount,
        minAmountFees,
        finalMinAmount,
      })

      const EIP712Signature = await getEIP712Signature(
        poolTokenAddress,
        llcAddress,
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
            llcAddress,
            UnboundLLCABI,
            signer
          )
          try {
            console.log({
              amount,
              deadline,
              v: signature.v,
              r: signature.r,
              s: signature.s,
              finalMinAmount,
            })
            const mintUND = await UnboundLLCContract.lockLPTWithPermit(
              amount,
              deadline,
              signature.v,
              signature.r,
              signature.s,
              finalMinAmount
            )
            // close awaiting modal
            this.ui.showAwaiting = false
            // show success screen
            this.ui.showConfirmation = false
            this.txLink = mintUND.hash
            this.ui.showSuccess = true
            this.LPTAmount = ''

            // initiate the UND contract to detect the event so we can update the balances
            const UND = new ethers.Contract(uToken, UnboundDaiABI, signer)
            // listen to mint event from UND contract
            UND.on('Mint', async (user, amount) => {
              const balance = await getTokenBalance(poolTokenAddress)
              this.poolToken.balance = balance.toFixed
            })
          } catch (error) {
            this.ui.showAwaiting = false
            this.ui.showConfirmation = false
            this.ui.showRejected = true
          }
        }
      )
    },

    setInputMax() {
      this.LPTAmount = this.poolToken.balance
    },
  },
}
</script>

<style lang="scss">
.bottom-container {
  width: 100%;
  max-width: 400px;
  padding-top: calc(24px + 2rem);
  padding-bottom: 20px;
  margin-top: -2rem;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 16px;
  z-index: -1;
  transform: translateY();
  transition: transform 300ms ease-in-out 0s;
}
</style>
