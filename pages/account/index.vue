<template>
  <!-- Locked Asset Table -->
  <div class="mt-6">
    <div v-if="ui.liqLoading || !getAddress" class="dark:text-gray-600">
      Loading...
    </div>
    <div v-else-if="ui.errorMsg">{{ ui.errorMsg }}</div>

    <div
      class="shadow overflow-hidden border-b border-gray-200 dark:border-gray-800 dark: sm:rounded-lg"
    >
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr class="bg-gray-100 dark:bg-gray-800">
            <th
              class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider"
            >
              Asset Name
            </th>
            <th
              class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider"
            >
              Locked Asset
            </th>
            <th
              class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider"
            >
              Tokens Minted
            </th>
            <th class="px-6 py-3 bg-gray-50"></th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900">
          <tr v-for="(data, i) in LPTTable.data" :key="i">
            <td class="px-6 py-2 whitespace-no-wrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-8 w-8">
                  <double-logo
                    :token0logo="data.icons.token0"
                    :token1logo="data.icons.token1"
                  />
                </div>
                <div class="ml-4">
                  <div
                    class="text-sm leading-5 font-medium text-gray-900 dark:text-gray-500"
                  >
                    {{ data.lptName }}
                  </div>
                  <div
                    class="text-sm leading-5 text-gray-500 dark:text-gray-700"
                  >
                    Uniswap
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-2 whitespace-no-wrap">
              <div class="text-sm leading-5 text-gray-900 dark:text-gray-500">
                {{ data.locked }}
              </div>
            </td>
            <td class="px-6 py-2 whitespace-no-wrap">
              <div class="text-sm leading-5 text-gray-900 dark:text-gray-500">
                {{ data.minted }}
              </div>
            </td>
            <td
              class="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium flex items-center justify-end space-x-2"
            >
              <nuxt-link to="/mint">
                <button
                  type="button"
                  class="rounded px-4 py-1 bg-light-primary dark:bg-dark-primary bg-opacity-25 text-light-primary dark:text-white appearance-none focus:outline-none"
                >
                  Mint
                </button>
              </nuxt-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { getLockedLPT, checkLoan } from '~/mixins/info'

import supportedPoolTokens from '~/configs/supportedPoolTokens'

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
    this.getPoolTokens()
  },

  methods: {
    async getPoolTokens() {
      let i
      const poolTokens = []
      for (i = 0; i < supportedPoolTokens.length; i++) {
        try {
          const lockedLPT = await getLockedLPT(
            supportedPoolTokens[i].llcAddress
          )
          // const llc = await getLLC(supportedPoolTokens[i].llcAddress)
          const loan = await checkLoan(
            supportedPoolTokens[i].llcAddress,
            supportedPoolTokens[i].uToken.address
          )
          // get average loan amount per uDAI
          // const und = lockedLPT.toString() /
          const poolTokenObj = {
            lptName: supportedPoolTokens[i].name,
            locked: lockedLPT,
            minted: loan + ' ' + supportedPoolTokens[i].uToken.symbol,
            minted_raw: loan,
            icons: {
              token0: supportedPoolTokens[i].currencyOneLogo,
              token1: supportedPoolTokens[i].currencyTwoLogo,
            },
          }

          poolTokens.push(poolTokenObj)
          this.LPTTable.data = poolTokens
        } catch (error) {
          console.log(error)
        }
      }
    },
  },
}
</script>

<style></style>
