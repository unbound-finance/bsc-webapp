<template>
  <!-- Locked Asset Table -->
  <div class="mt-6">
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
            <tbody
              v-if="LPTTable.data && LPTTable.data.length != 0"
              class="bg-white bg-opacity-75 dark:bg-gray-900"
            >
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
                  <div
                    class="text-sm leading-5 text-gray-900 dark:text-gray-500"
                  >
                    {{ data.locked }}
                  </div>
                </td>
                <td class="px-6 py-2 whitespace-no-wrap">
                  <div
                    class="text-sm leading-5 text-gray-900 dark:text-gray-500"
                  >
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

            <tbody v-else-if="ui.loading" class="bg-white dark:bg-gray-900">
              <tr>
                <td class="px-6 py-4">
                  <content-loader
                    :height="32"
                    :primary-opacity="0.25"
                  ></content-loader>
                </td>
                <td class="px-6 py-4">
                  <content-loader
                    :height="32"
                    :primary-opacity="0.25"
                  ></content-loader>
                </td>
                <td class="px-6 py-4">
                  <content-loader
                    :height="32"
                    :primary-opacity="0.25"
                  ></content-loader>
                </td>
                <td class="px-6 py-4">
                  <content-loader
                    :height="100"
                    :primary-opacity="0.25"
                  ></content-loader>
                </td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr class="bg-white dark:bg-gray-900">
                <td colspan="6">
                  <div class="text-sm text-center p-4 text-gray-600">
                    Asset Not found.
                  </div>
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
import { ContentLoader } from 'vue-content-loader'

import { getLockedLPT, checkLoan } from '~/mixins/info'

import supportedPoolTokens from '~/configs/supportedPoolTokens'
import { dynamicsort } from '~/utils'

export default {
  layout: 'account',
  components: { ContentLoader },
  data() {
    return {
      ui: {
        errorMsg: null,
        loading: false,
      },
      LPTTable: {
        headers: ['LP Token Name', 'Locked LPT', 'Token Minted', ''],
        data: [],
      },
    }
  },

  computed: {
    ...mapGetters({
      getAddress: 'getAddress',
    }),
  },

  mounted() {
    this.getPoolTokens()
  },

  methods: {
    async getPoolTokens() {
      this.ui.loading = true
      try {
        this.LPTTable.data = (
          await Promise.all(
            supportedPoolTokens.map(async (e) => {
              const lockedLPT = await getLockedLPT(e.llcAddress)
              const loan = await checkLoan(e.llcAddress, e.uToken.address)

              return {
                lptName: e.name,
                locked: lockedLPT.formatted,
                minted: loan.formattedBalance + ' ' + e.uToken.symbol,
                minted_raw: loan,
                icons: {
                  token0: e.currencyOneLogo,
                  token1: e.currencyTwoLogo,
                },
              }
            })
          )
        )
          .sort(dynamicsort('locked', 'desc'))
          .filter((el) => el.locked > 0)

        this.ui.loading = false
      } catch (error) {
        this.ui.loading = false
      }
    },
  },
}
</script>

<style></style>
