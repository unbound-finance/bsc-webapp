<template>
  <div>
    <div
      class="w-full p-4 rounded-md bg-white dark:bg-gray-900 bg-opacity-75 border border-gray-200 dark:border-gray-800 flex flex-wrap items-center"
    >
      <div
        class="flex flex-col w-full md:w-1/3 md:border-r border-gray-200 dark:border-gray-800 px-4"
      >
        <div class="p-2 flex flex-col">
          <span class="text-xs text-gray-500 dark:text-gray-600 uppercase"
            >Total Liquidity</span
          >
          <div class="font-medium text-gray-800 dark:text-gray-200 text-xl">
            ${{ overview.totalLiquidity }}
          </div>
        </div>
        <div
          class="border-b border-gray-200 dark:border-gray-800 my-2 -mx-2"
        ></div>
        <div class="p-2 flex flex-col">
          <span class="text-xs text-gray-500 dark:text-gray-600 uppercase"
            >Current Minting Fee</span
          >
          <div class="font-medium text-gray-800 dark:text-gray-200 text-xl">
            0.5%
          </div>
        </div>
      </div>

      <div
        class="flex flex-col w-full md:w-1/3 md:border-r border-gray-200 dark:border-gray-800 px-4"
      >
        <div class="p-2 flex flex-col">
          <span class="text-xs text-gray-500 dark:text-gray-600 uppercase"
            >Total Volume (24H)</span
          >
          <div class="font-medium text-gray-800 dark:text-gray-200 text-xl">
            $900K
          </div>
        </div>
        <div
          class="border-b border-gray-200 dark:border-gray-800 my-2 -mx-2"
        ></div>
        <div class="p-2 flex flex-col">
          <span class="text-xs text-gray-500 dark:text-gray-600 uppercase"
            >Collatralization Ratio</span
          >
          <div class="font-medium text-gray-800 dark:text-gray-200 text-xl">
            60%
          </div>
        </div>
      </div>

      <div class="flex flex-col w-full md:w-1/3 px-4">
        <div class="px-2 w-full flex items-center justify-between">
          <span class="text-xs text-gray-500 dark:text-gray-600 uppercase"
            >Current Fees Pool</span
          >
          <button
            type="button"
            class="text-xs text-light-primary dark:text-dark-primary appearance-none focus:outline-none"
            @click="ui.showFeesBreakdown = !ui.showFeesBreakdown"
          >
            <span v-if="!ui.showFeesBreakdown">View Breakdown</span>
            <i v-else class="fas fa-times text-xs"></i>
          </button>
        </div>

        <div
          v-if="ui.showFeesBreakdown"
          class="w-full px-2 flex items-center justify-between mt-4 transition-all ease-in duration-150"
        >
          <div class="flex flex-col items-center justify-center">
            <div class="text-2xl font-medium text-gray-800 dark:text-gray-200">
              $400K
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-600"
              >Staker Fees</span
            >
          </div>

          <div class="flex flex-col items-center justify-center">
            <div class="text-2xl font-medium text-gray-800 dark:text-gray-200">
              $400K
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-600"
              >SAFU Fund</span
            >
          </div>

          <div class="flex flex-col items-center justify-center">
            <div class="text-2xl font-medium text-gray-800 dark:text-gray-200">
              $200K
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-600"
              >Dev Fund</span
            >
          </div>
        </div>

        <div v-else class="mt-2 px-2 transition-all ease-in duration-150">
          <div class="text-2xl font-medium text-gray-800 dark:text-gray-200">
            $1,000,000
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 md:mt-8">
      <div class="w-full flex items-center justify-between py-2">
        <p class="text-lg text-gray-800 dark:text-gray-200 font-medium p-2">
          Pool Tokens
        </p>
        <input
          v-model="search"
          type="text"
          class="px-4 py-2 md:w-1/3 border border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-500 focus:border-light-primary text-sm rounded-lg appearance-none focus:outline-none"
          placeholder="Search token, address or exchange..."
        />
      </div>
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="shadow overflow-hidden sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr class="bg-white dark:bg-gray-900">
                  <th
                    class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Exchange
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total Locked
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                  >
                    LTV
                  </th>
                  <th class="px-6 py-3 bg-gray-50"></th>
                </tr>
              </thead>
              <tbody
                v-if="searchResult && searchResult.length != 0"
                class="bg-white bg-opacity-75 dark:bg-gray-900"
              >
                <tr v-for="(data, i) in searchResult" :key="i">
                  <td class="px-6 py-4 whitespace-no-wrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-8 w-8">
                        <double-logo
                          :token0logo="data.currencyOneLogo"
                          :token1logo="data.currencyTwoLogo"
                        />
                      </div>
                      <div class="ml-4">
                        <div
                          class="text-sm leading-5 font-medium text-gray-900 dark:text-gray-200"
                        >
                          {{ data.name }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap">
                    <div
                      class="text-sm leading-5 text-gray-900 dark:text-gray-200"
                    >
                      {{ data.exchange }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap">
                    <div
                      class="text-sm leading-5 text-gray-900 dark:text-gray-200"
                    >
                      {{ data.lockedLPT }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap">
                    <div
                      class="text-sm leading-5 text-gray-900 dark:text-gray-200"
                    >
                      ${{ data.price }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap">
                    <div
                      class="text-sm leading-5 text-gray-900 dark:text-gray-200"
                    >
                      {{ data.ltv }}%
                    </div>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium"
                  >
                    <button
                      class="bg-light-primary dark:bg-dark-primary text-light-primary dark:text-white bg-opacity-25 px-6 py-1 rounded appearance-none focus:outline-none"
                    >
                      Mint
                    </button>
                  </td>
                </tr>
              </tbody>

              <tbody v-else>
                <tr class="bg-white dark:bg-gray-900">
                  <td colspan="6">
                    <div class="text-sm text-center p-4 text-gray-600">
                      Token Not found.
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers'

import supportedPoolTokens from '~/configs/supportedPoolTokens'
import UniswapLPTABI from '~/configs/abi/UniswapLPTABI'

import { getDecimals } from '~/mixins/ERC20'
import { getLLC } from '~/mixins/valuator'
import { getTotalLiquidity, getTotalLockedLPT } from '~/mixins/analytics'

export default {
  layout: 'blank',
  data() {
    return {
      ui: {
        showFeesBreakdown: false,
      },
      poolTokens: null,
      search: '',
      overview: {
        totalLiquidity: 0,
      },
    }
  },
  computed: {
    searchResult() {
      const search = this.search.trim()
      if (search) {
        const regex = new RegExp(search, 'ig')
        return this.poolTokens.filter(
          ({ name, address, exchange }) =>
            regex.test(name) ||
            (search.slice(0, 2).toLowerCase() === '0x' &&
              regex.test(address)) ||
            regex.test(exchange)
        )
      }
      return this.poolTokens
    },
  },
  mounted() {
    this.getPoolTokens()
    this.getAnalyticsData()
  },
  methods: {
    async getAnalyticsData() {
      this.overview.totalLiquidity = await getTotalLiquidity()
    },
    async getLoanRatioPerLPT(poolToken) {
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

        return {
          ltv: (llc.loanRate * 100) / 1e6,
          price: (totalValueInDai / LPTTotalSupply).toFixed(4).slice(0, -1),
        }
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

        return {
          ltv: (llc.loanRate * 100) / 1e6,
          price: (totalValueInDai / LPTTotalSupply).toFixed(4).slice(0, -1),
        }
      }
    },

    async getPoolTokens() {
      const poolTokens = []
      try {
        await supportedPoolTokens.map(async (ev) => {
          const loanRatio = await this.getLoanRatioPerLPT(ev)
          const lockedLPT = await getTotalLockedLPT(ev.address, ev.llcAddress)

          const obj = {
            ...ev,
            ltv: loanRatio.ltv,
            price: loanRatio.price,
            lockedLPT,
          }
          poolTokens.push(obj)
        })

        this.poolTokens = poolTokens
      } catch (error) {
        throw new Error('Something went wrong!' + error)
      }
    },
  },
}
</script>

<style>
.horizontal_line {
  height: 100px;
  width: 1px;
  margin: 0 24px;
  @apply bg-gray-200;
}
</style>
