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
            <p class="font-medium text-sm text-gray-600">Total Liquidity</p>
            <div class="flex items-center justify-between">
              <p class="font-medium text-3xl text-accent">
                ${{
                  liquidity
                    ? Number(liquidity.token0 + liquidity.token1).toFixed(2)
                    : '0'
                }}
              </p>
              <button
                class="focus:outline-none"
                @click="showLiquidity = !showLiquidity"
              >
                <i
                  class="fas text-gray-600 px-4"
                  :class="showLiquidity ? 'fa-chevron-up' : 'fa-chevron-down'"
                ></i>
              </button>
            </div>
            <div v-if="showLiquidity" class="transition-all duration-200">
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
                      (liquidity && Number(liquidity.token0).toFixed(2)) || 0
                    }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-600 font-medium text-sm">Pooled UND</p>
                </div>
                <div>
                  <p class="text-right text-accent font-medium">
                    {{
                      (liquidity && Number(liquidity.token1).toFixed(2)) || 0
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="w-full border-gray-200 dark:border-gray-800 rounded p-4 bg-white bg-opacity-75 dark:bg-gray-900"
          :class="showLiquidity ? '' : 'border'"
        >
          <div class="flex flex-col">
            <p class="font-medium text-sm text-gray-600">Total Pool Share</p>
            <div class="flex items-center justify-between">
              <p class="font-medium text-3xl text-accent">
                {{ liquidity ? liquidity.poolShare.toFixed(3) : '0' }}%
              </p>
            </div>
          </div>
        </div>
        <div
          class="w-full border-gray-200 dark:border-gray-800 rounded p-4 bg-white bg-opacity-75 dark:bg-gray-900"
          :class="showLiquidity ? '' : 'border'"
        >
          <div class="flex flex-col">
            <p class="font-medium text-sm text-gray-600">Total Fees Earned</p>
            <div class="flex items-center justify-between">
              <p class="font-medium text-3xl text-accent">
                $
                {{
                  (
                    parseFloat(collectedFees.safu) +
                    parseFloat(collectedFees.team)
                  ).toFixed(3)
                }}
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

// import config from '~/configs/config'
import { getPoolTokenReserves, getAmountOfLockedTokens } from '~/mixins/stake'

import UniswapLPTABI from '~/configs/abi/UniswapLPTABI'
import config from '~/configs/config'
import UnboundDai from '~/configs/abi/UnboundDai'

import supportedPoolTokens from '~/configs/supportedPoolTokens'
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
    }
  },

  computed: {
    ...mapGetters({
      getAddress: 'getAddress',
    }),
  },

  mounted() {
    this.ui.loading = true
    this.getTotalLiquidity()
    this.getTotalUND()
    this.getCollectedFees()
    this.fetchLiquidity()
  },

  methods: {
    async getCollectedFees() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const UND = new ethers.Contract(
          config.contracts.unboundDai,
          UnboundDai,
          signer
        )
        const safu = await UND.balanceOf(config.safuFund)
        const team = await UND.balanceOf(config.devFund)
        this.collectedFees.safu = (safu.toString() / 1e18).toFixed(3)
        this.collectedFees.team = (team.toString() / 1e18).toFixed(3)
      } catch (error) {
        throw new Error('Could not fetch fees', error)
      }
    },

    async getTotalLiquidity() {
      try {
        const totalLiquidity = await getPoolTokenReserves()
        this.totalLiquidity = (totalLiquidity.reserve1 / 1e18).toFixed(2)
      } catch (error) {
        throw new Error('Could not fetch total liquidity', error)
      }
    },

    async getTotalUND() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const UND = new ethers.Contract(
          config.contracts.unboundDai,
          UnboundDai,
          signer
        )
        const supply = await UND.totalSupply()
        this.totalMinted = (supply / 1e18).toFixed(2)
      } catch (error) {}
    },

    async fetchLiquidity() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const userAddress = provider.getSigner().getAddress()

        const poolTokenContract = new ethers.Contract(
          config.contracts.UNDUniswapPool,
          UniswapLPTABI,
          signer
        )
        const lptBalance = await poolTokenContract.balanceOf(userAddress)
        if (parseFloat(lptBalance.toString()) > 0) {
          const data = await getAmountOfLockedTokens()
          this.liquidity = data
        }
      } catch (error) {
        throw new Error('Could not fetch liquidity', error)
      }
    },
  },
}
</script>
