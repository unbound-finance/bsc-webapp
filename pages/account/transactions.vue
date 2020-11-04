<template>
  <!-- Transaction History Table -->
  <div class="mt-6">
    <div class="w-full flex items-center justify-end mb-2">
      <div class="flex items-center space-x-4">
        <button
          class="focus:outline-none"
          type="button"
          :disabled="ui.loading || ui.page === 1"
          @click="prevPage"
        >
          <i
            class="fas fa-arrow-left text-sm"
            :class="
              ui.loading || ui.page == 1
                ? 'text-gray-500 dark:text-gray-700 cursor-not-allowed'
                : 'text-accent'
            "
          ></i>
        </button>
        <span class="text-sm dark:text-gray-600">Page {{ ui.page }}</span>
        <button
          class="focus:outline-none text-accent"
          type="button"
          :disabled="ui.loading || ui.apiPage == ui.lastPage"
          @click="nextPage"
        >
          <i
            class="fas fa-arrow-right text-sm"
            :class="
              ui.loading || ui.apiPage == ui.lastPage
                ? 'text-gray-500 dark:text-gray-700 cursor-not-allowed'
                : 'text-accent'
            "
          ></i>
        </button>
      </div>
    </div>

    <div v-if="ui.errorMsg">{{ ui.errorMsg }}</div>

    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div
          class="shadow overflow-hidden border-b border-gray-200 dark:border-gray-800 dark: sm:rounded-lg"
        >
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr class="bg-white dark:bg-gray-900">
                <th
                  v-for="(data, i) in txTable.headers"
                  :key="i"
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider"
                >
                  {{ data }}
                </th>
              </tr>
            </thead>
            <tbody
              v-if="!ui.loading"
              class="bg-white bg-opacity-75 dark:bg-gray-900"
            >
              <tr v-for="(data, i) in txTable.data" :key="i">
                <td class="px-6 py-2 whitespace-no-wrap">
                  <div class="flex items-center">
                    <div>
                      <div
                        class="text-sm leading-5 text-gray-900 dark:text-gray-500"
                      >
                        {{ $dayjs.unix(data.timeStamp).format('DD MMM YYYY') }}
                      </div>
                      <div
                        class="text-sm leading-5 text-gray-500 dark:text-gray-700"
                      >
                        {{ $dayjs.unix(data.timeStamp).format('hh:mm:ss a') }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-2 whitespace-no-wrap">
                  <div
                    class="text-sm leading-5 text-gray-900 dark:text-gray-500"
                  >
                    {{ data.blockNumber }}
                  </div>
                </td>
                <td class="px-6 py-2 whitespace-no-wrap">
                  <div
                    class="text-sm leading-5 text-gray-900 dark:text-gray-500"
                  >
                    <a
                      class="text-accent"
                      :href="`https://kovan.etherscan.io/tx/${data.hash}`"
                      target="_blank"
                      >{{
                        data.hash.substring(0, 16) +
                        '...' +
                        data.hash.substring(data.hash.length - 16)
                      }}</a
                    >
                  </div>
                </td>
                <td class="px-6 py-2 whitespace-no-wrap">
                  <div
                    class="text-sm leading-5 text-gray-900 dark:text-gray-500"
                  >
                    {{
                      data.smartContractFunction === functions.mint
                        ? 'Mint'
                        : 'Burn'
                    }}
                  </div>
                </td>
                <td class="px-6 py-2 whitespace-no-wrap">
                  <div
                    class="text-sm leading-5 text-gray-900 dark:text-gray-500"
                  >
                    {{ data.amount.toFixed(2) }} UND
                  </div>
                </td>
                <td class="px-6 py-2 whitespace-no-wrap">
                  <div
                    class="text-sm leading-5 text-gray-900 dark:text-gray-500"
                  >
                    {{ parseInt(data.gasUsed * data.gasPrice) / 1e18 }}
                  </div>
                </td>
              </tr>
            </tbody>

            <tbody v-else class="bg-white dark:bg-gray-900">
              <tr>
                <td class="px-6 py-4">
                  <content-loader
                    :height="40"
                    :primary-opacity="0.25"
                  ></content-loader>
                </td>
                <td class="px-6 py-4">
                  <content-loader
                    :height="40"
                    :primary-opacity="0.25"
                  ></content-loader>
                </td>
                <td class="px-6 py-4">
                  <content-loader
                    :height="40"
                    :primary-opacity="0.25"
                  ></content-loader>
                </td>
                <td class="px-6 py-4">
                  <content-loader
                    :height="40"
                    :primary-opacity="0.25"
                  ></content-loader>
                </td>
                <td class="px-6 py-4">
                  <content-loader
                    :height="40"
                    :primary-opacity="0.25"
                  ></content-loader>
                </td>
                <td class="px-6 py-4">
                  <content-loader
                    :height="40"
                    :primary-opacity="0.25"
                  ></content-loader>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ethers } from 'ethers'
import { ContentLoader } from 'vue-content-loader'

import supportedPoolTokens from '~/configs/supportedPoolTokens'
const provider = new ethers.providers.Web3Provider(window.ethereum)

export default {
  layout: 'account',
  components: { ContentLoader },
  data() {
    return {
      ui: {
        loading: false,
        liqLoading: false,
        errorMsg: null,
        page: 1,
        lastPage: -1,
        apiPage: 1,
        cachedPages: [],
      },
      showFees: false,
      showLiquidity: false,
      txTable: {
        headers: ['Date', 'Block', 'Txn Hash', 'Type', 'Amount', 'Txn Fees'],
        data: [],
      },
      functions: {
        mint: '0xacc99b37',
        burn: '0x1fa1a491',
      },
      supportedPoolTokens,
      remainingTransactions: [],
    }
  },

  computed: {
    ...mapGetters({
      getAddress: 'getAddress',
    }),
  },

  mounted() {
    this.txCallee()
  },

  methods: {
    nextPage() {
      this.ui.page++
      if (this.ui.cachedPages[this.ui.page]) {
        this.txTable.data = this.ui.cachedPages[this.ui.page]
      } else {
        this.ui.apiPage++
        this.txCallee()
      }
    },

    prevPage() {
      this.ui.page--
      this.txTable.data = this.ui.cachedPages[this.ui.page]
    },

    async txCallee() {
      this.ui.loading = true
      this.txTable.data = await this.getTransactions(
        this.ui.apiPage,
        this.remainingTransactions
      )
      this.ui.cachedPages[this.ui.page] = this.txTable.data
      this.ui.loading = false
    },

    async getTransactions(page, result = []) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const url = 'https://api-kovan.etherscan.io/api'
      const params = {
        module: 'account',
        action: 'txlist',
        address,
        startblock: '0',
        endblock: '99999999',
        page,
        offset: '10',
        sort: 'desc',
        apikey: 'HUWMR5VJHDQ7EEZYEUWQAAHBNMURE1R1CH',
      }

      const { data } = await this.$axios.get(url, { params })
      this.ui.apiPage = page

      if (data.status === '0') {
        this.ui.lastPage = page
      } else if (data.result.length !== 0) {
        result.push(...(await this.decodeTransaction(data.result)))
        if (result.length < 10) {
          this.ui.apiPage = page + 1
          await this.getTransactions(page + 1, result)
        }
      } else {
        this.ui.lastPage = page
      }
      this.remainingTransactions = result.slice(10)
      return result.slice(0, 10)
    },

    async decodeTransaction(etherScanData) {
      return (
        await Promise.all(
          etherScanData.map(async (etherscan) => {
            const transaction = await provider.getTransaction(etherscan.hash)
            const rawFunction = transaction.data.slice(0, 10)
            if (
              rawFunction === this.functions.mint ||
              rawFunction === this.functions.burn
            ) {
              const value = transaction.data.slice(10, 74)
              return {
                blockNumber: etherscan.blockNumber,
                timeStamp: etherscan.timeStamp,
                hash: etherscan.hash,
                gasPrice: etherscan.gasPrice,
                gasUsed: etherscan.gasUsed,
                amount: parseInt('0x' + value) / 1e18,
                smartContractFunction: rawFunction,
              }
            }
            return null
          })
        )
      ).filter((e) => !!e)
    },
  },
}
</script>
