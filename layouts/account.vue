<template>
  <div>
    <Navbar />
    <div class="md:max-w-6xl mx-auto p-4">
      <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-2">
        <div
          class="w-full border-gray-200 dark:border-gray-800 rounded p-4 bg-white bg-opacity-75 dark:bg-gray-900"
          :class="showFees ? '' : 'border'"
        >
          <div class="flex flex-col">
            <p class="font-medium text-sm text-gray-600">Total Locked</p>
            <div class="flex items-center justify-between">
              <div v-if="ui.loading" class="loading-dots text-2xl">.</div>
              <p v-else class="font-medium text-3xl text-accent">
                ${{ accountInfo.totalValueLocked | toFixed(2) }}
              </p>
              <!-- <button
                class="focus:outline-none"
                @click="showLiquidity = !showLiquidity"
              >
                <i
                  class="fas text-gray-600 px-4"
                  :class="showLiquidity ? 'fa-chevron-up' : 'fa-chevron-down'"
                ></i>
              </button> -->
            </div>
            <!-- <div v-if="showLiquidity" class="transition-all duration-200">
              <div
                class="mt-4 border-b border-gray-200 dark:border-gray-800 w-full"
              ></div>
              <div class="mt-4 grid grid-cols-2 px-2">
                <div>
                  <p class="text-gray-600 font-medium text-sm">Pooled DAI</p>
                </div>
                <div>
                  <p class="text-right text-accent font-medium">
                    {{
                      (liquidity &&
                        liquidity[0].poolInfo.token0 | toFixed(2)) ||
                      0
                    }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-600 font-medium text-sm">Pooled UND</p>
                </div>
                <div>
                  <p class="text-right text-accent font-medium">
                    {{
                      (liquidity &&
                        liquidity[0].poolInfo.token1 | toFixed(2)) ||
                      0
                    }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-600 font-medium text-sm">Pooled ETH</p>
                </div>
                <div>
                  <p class="text-right text-accent font-medium">
                    {{
                      (liquidity &&
                        liquidity[1].poolInfo.token0 | toFixed(2)) ||
                      0
                    }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-600 font-medium text-sm">Pooled uETH</p>
                </div>
                <div>
                  <p class="text-right text-accent font-medium">
                    {{
                      (liquidity &&
                        liquidity[1].poolInfo.token0 | toFixed(2)) ||
                      0
                    }}
                  </p>
                </div>
              </div>
            </div> -->
          </div>
        </div>
        <div
          class="w-full border-gray-200 dark:border-gray-800 rounded p-4 bg-white bg-opacity-75 dark:bg-gray-900"
          :class="showLiquidity ? '' : 'border'"
        >
          <div class="flex flex-col">
            <p class="font-medium text-sm text-gray-600">Total Minted</p>
            <div class="flex items-center space-x-6 pt-2">
              <div class="flex flex-col">
                <div v-if="ui.loading" class="loading-dots text-2xl">.</div>
                <p v-else class="font-medium text-xl text-accent leading-tight">
                  {{ accountInfo.undMinted | toFixed(4) }}
                </p>
                <div v-if="liquidity" class="flex items-center space-x-1">
                  <img
                    :src="require(`~/assets/tokens/${liquidity[0].icon}`)"
                    width="12"
                    :alt="`${liquidity[0].name} logo`"
                  />
                  <span class="text-gray-500 text-xs">{{
                    liquidity ? liquidity[0].name : ''
                  }}</span>
                </div>
              </div>
              <!-- <div class="flex flex-col">
                <div v-if="ui.loading" class="loading-dots text-2xl">.</div>
                <p v-else class="font-medium text-xl text-accent leading-tight">
                  {{ accountInfo.uEthMinted | toFixed(4) }}
                </p> -->

              <!-- <div v-if="liquidity" class="flex items-center space-x-1">
                  <img
                    :src="require(`~/assets/tokens/${liquidity[1].icon}`)"
                    width="12"
                    style="max-height: 16px"
                    :alt="`${liquidity[1].name} logo`"
                  />
                  <span class="text-gray-500 text-xs">{{
                    liquidity ? liquidity[1].name : ''
                  }}</span>
                </div> -->
              <!-- </div> -->
            </div>
          </div>
        </div>
        <div
          class="w-full border-gray-200 dark:border-gray-800 rounded p-4 bg-white bg-opacity-75 dark:bg-gray-900"
          :class="showLiquidity ? '' : 'border'"
        >
          <div class="flex flex-col">
            <p class="font-medium text-sm text-gray-600">
              Collatralization Ratio
            </p>
            <div class="flex items-center justify-between">
              <div v-if="ui.loading" class="loading-dots text-2xl">.</div>
              <p v-else class="font-medium text-3xl text-accent">
                {{ Number(accountInfo.cRatio) }}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="mt-8 border-b border-gray-200 dark:border-gray-800 flex items-center space-x-6"
      >
        <nuxt-link
          v-slot="{ isExactActive }"
          to="/account"
          class="font-medium text-xl"
        >
          <nuxt-link to="/account">
            <span
              :class="
                isExactActive
                  ? 'text-light-primary dark:text-dark-primary border-b-2 border-light-primary dark:border-dark-primary cursor-pointer'
                  : 'text-gray-400 dark:text-gray-700 cursor-pointer'
              "
              >Locked Assets</span
            >
          </nuxt-link>
        </nuxt-link>
        <nuxt-link
          v-slot="{ isExactActive }"
          to="/account/transactions"
          class="font-medium text-xl"
        >
          <nuxt-link to="/account/transactions">
            <span
              :class="
                isExactActive
                  ? 'text-light-primary dark:text-white border-b-2 border-light-primary dark:border-dark-primary cursor-pointer'
                  : 'text-gray-500 dark:text-gray-700 cursor-pointer'
              "
              >Transactions</span
            >
          </nuxt-link>
        </nuxt-link>
      </div>
      <nuxt />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ethers } from 'ethers'

import { getAmountOfLockedTokens } from '~/mixins/stake'
import { getFeesAccrued } from '~/mixins/analytics'

import { UNISWAP_LPT_ABI, UNBOUND_DOLLAR_ABI, contracts } from '~/constants'

import supportedPoolTokens from '~/configs/supportedPoolTokens'
import supportedUTokens from '~/configs/supportedUTokens'

import {
  getLockedLPT,
  checkLoan,
  getLPTPrice,
  getEthPrice,
} from '~/mixins/info'

// const txDecoder = require('ethereum-tx-decoder')

export default {
  layout: 'blank',
  data() {
    return {
      ui: {
        loading: false,
        liqLoading: false,
        errorMsg: null,
        page: 1,
      },
      showFees: false,
      showLiquidity: false,
      txTable: {
        headers: ['Date', 'Block', 'Txn Hash', 'Type', 'Amount', 'Txn Fees'],
        data: [],
      },
      LPTTable: {
        headers: ['LP Token Name', 'Locked LPT', 'Token Minted', ''],
        data: [],
      },
      functions: {
        mint: '0x04bb770d',
        burn: '0x78208601',
      },
      liquidity: null,
      totalLiquidity: '0',
      totalMinted: '0',
      collectedFees: {
        safu: '',
        team: '',
      },
      supportedPoolTokens,
      ethPrice: 0,
      accountInfo: {},
    }
  },

  computed: {
    ...mapGetters({
      getAddress: 'getAddress',
    }),

    totalFeesEarned() {
      if (this.liquidity) {
        const unboundFees =
          (this.collectedFees * this.liquidity[0].poolInfo.poolShare) / 100
        const totalFees = unboundFees + (unboundFees * 0.3) / 100
        return totalFees.toFixed(4)
      } else {
        return 0
      }
    },
  },

  async created() {
    this.ethPrice = await this.$ethPrice()
  },

  mounted() {
    this.getAccountInfo()
    this.fetchLiquidity()
    this.getTotalUND()
    this.getCollectedFees()
  },

  methods: {
    async getCollectedFees() {
      const fees = await getFeesAccrued()
      this.collectedFees = fees.staking
    },

    // async getFees() {

    // },

    // async getTotalLiquidity() {
    //   try {
    //     const totalLiquidity = await getPoolTokenReserves()
    //     this.totalLiquidity = (totalLiquidity.reserve1 / 1e18).toFixed(2)
    //   } catch (error) {
    //     throw new Error('Could not fetch total liquidity', error)
    //   }
    // },

    async getTotalUND() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const UND = new ethers.Contract(
          contracts.unboundDai,
          UNBOUND_DOLLAR_ABI,
          signer
        )
        const supply = await UND.totalSupply()
        this.totalMinted = (supply / 1e18).toFixed(2)
      } catch (error) {}
    },

    async getAccountInfo() {
      this.ui.loading = true
      const und = []
      const uEth = []
      const tvl = []

      try {
        const ethPrice = await getEthPrice()

        await Promise.all(
          supportedPoolTokens.map(async (e) => {
            const lockedLPT = await getLockedLPT(e.llcAddress)
            const price = await getLPTPrice(e)
            const value = Number(lockedLPT.formatted * price)
            const loan = await checkLoan(e.llcAddress, e.uToken.address)
            const minted = {
              minted: loan.formattedBalance,
              symbol: e.uToken.symbol,
            }

            tvl.push(value)

            if (minted.symbol === 'UND') {
              und.push(Number(minted.minted))
            } else if (minted.symbol === 'uETH') {
              uEth.push(Number(minted.minted))
            }
          })
        )

        const undMinted = und.reduce((a, b) => a + b || 0, 0)
        const uEthMinted = uEth.reduce((a, b) => a + b || 0, 0)
        const totalValueLocked = tvl.reduce((a, b) => a + b || 0, 0)

        const uEthMintedUsd = Number(uEthMinted * ethPrice)
        const cRatio = Number(
          (totalValueLocked / (undMinted + uEthMintedUsd)) * 100
        ).toFixed(2)

        this.ui.loading = false

        this.accountInfo = {
          totalValueLocked,
          undMinted,
          uEthMinted,
          cRatio,
        }
      } catch (error) {
        this.ui.loading = false
        console.log(error)
      }
    },

    async fetchLiquidity() {
      this.ui.loading = true
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const userAddress = provider.getSigner().getAddress()

      try {
        this.liquidity = await Promise.all(
          supportedUTokens.map(async (e) => {
            const poolTokenContract = new ethers.Contract(
              e.lptAddress,
              UNISWAP_LPT_ABI,
              signer
            )
            await poolTokenContract.balanceOf(userAddress)
            const poolInfo = await getAmountOfLockedTokens(e.lptAddress)
            return {
              ...e,
              poolInfo: {
                token0: poolInfo.token0,
                token1: poolInfo.token1,
                totalLiquidity: poolInfo.token0 + poolInfo.token1,
                poolShare: poolInfo.poolShare,
              },
            }
          })
        )
      } catch (error) {
        this.ui.loading = false
      }
    },
  },
}
</script>
