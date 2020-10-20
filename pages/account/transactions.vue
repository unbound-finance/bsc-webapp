<template>
  <!-- Transaction History Table -->
  <div class="mt-6">
    <div class="w-full flex items-center justify-end mb-2">
      <div v-if="!ui.loading" class="flex items-center space-x-4">
        <button
          class="focus:outline-none"
          type="button"
          :disabled="ui.page === 1 ? true : false"
          @click="prevPage"
        >
          <i
            class="fas fa-arrow-left text-sm"
            :class="
              ui.page == 1
                ? 'text-gray-500 dark:text-gray-700 cursor-not-allowed'
                : 'text-accent'
            "
          ></i>
        </button>
        <span class="text-sm dark:text-gray-600">Page {{ ui.page }}</span>
        <button
          class="focus:outline-none text-accent"
          type="button"
          @click="nextPage"
        >
          <i class="fas fa-arrow-right text-sm"></i>
        </button>
      </div>
    </div>
    <div v-if="ui.loading || !getAddress" class="dark:text-gray-600">
      Loading...
    </div>
    <div v-else-if="ui.errorMsg">{{ ui.errorMsg }}</div>

    <div
      v-else
      class="shadow overflow-hidden border-b border-gray-200 dark:border-gray-800 dark: sm:rounded-lg"
    >
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr class="bg-gray-100 dark:bg-gray-800">
            <th
              v-for="(data, i) in txTable.headers"
              :key="i"
              class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider"
            >
              {{ data }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900">
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
              <div class="text-sm leading-5 text-gray-900 dark:text-gray-500">
                {{ data.blockNumber }}
              </div>
            </td>
            <td class="px-6 py-2 whitespace-no-wrap">
              <div class="text-sm leading-5 text-gray-900 dark:text-gray-500">
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
              <div class="text-sm leading-5 text-gray-900 dark:text-gray-500">
                {{
                  data.smartContractFunction === functions.mint
                    ? 'Mint'
                    : 'Burn'
                }}
              </div>
            </td>
            <td class="px-6 py-2 whitespace-no-wrap">
              <div class="text-sm leading-5 text-gray-900 dark:text-gray-500">
                {{ data.amount.toFixed(2) }} UND
              </div>
            </td>
            <td class="px-6 py-2 whitespace-no-wrap">
              <div class="text-sm leading-5 text-gray-900 dark:text-gray-500">
                {{ parseInt(data.gasUsed * data.gasPrice) / 1e18 }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ethers } from 'ethers'

import supportedPoolTokens from '~/configs/supportedPoolTokens'
const provider = new ethers.providers.Web3Provider(window.ethereum)

export default {
  layout: 'account',
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
      functions: {
        mint: '0x04bb770d',
        burn: '0x78208601',
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
    this.getTransactions()
  },

  methods: {
    nextPage() {
      this.ui.page++
      this.getTransactions()
    },

    prevPage() {
      this.ui.page--
      this.getTransactions()
    },

    async getTransactions() {
      this.ui.errorMsg = null
      this.ui.loading = true

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
        page: this.ui.page,
        offset: '10',
        sort: 'desc',
        apikey: 'HUWMR5VJHDQ7EEZYEUWQAAHBNMURE1R1CH',
      }
      const result = await this.$axios.get(url, { params })
      if (result.data.status === '0') {
        this.ui.loading = false
        this.ui.errorMsg = result.data.message
      } else {
        await this.decodeTransaction(result.data.result)
        this.ui.loading = false
      }
    },

    async decodeTransaction(etherScanData) {
      const tempArray = []

      let i
      for (i = 0; i < etherScanData.length; i++) {
        const transaction = await provider.getTransaction(etherScanData[i].hash)
        const rawFunction = transaction.data.slice(0, 10)
        if (
          rawFunction === this.functions.mint ||
          rawFunction === this.functions.burn
        ) {
          const value = transaction.data.slice(10, 74)
          const data = {
            blockNumber: etherScanData[i].blockNumber,
            timeStamp: etherScanData[i].timeStamp,
            hash: etherScanData[i].hash,
            gasPrice: etherScanData[i].gasPrice,
            gasUsed: etherScanData[i].gasUsed,
            amount: parseInt('0x' + value) / 1e18,
            smartContractFunction: rawFunction,
          }
          tempArray.push(data)
        }
        this.txTable.data = tempArray
      }
    },
  },
}
</script>
