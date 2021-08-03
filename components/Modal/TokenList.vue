<template>
  <Modal v-model="modal" :persistent="persistent">
    <template>
      <div class="flex flex-col space-y-4 p-4">
        <div class="flex justify-between items-center">
          <p class="font-medium dark:text-white">Select Pool Token</p>
          <button
            type="button"
            class="focus:outline-none"
            @click="modal = false"
          >
            <i class="fas fa-times text-gray-900 dark:text-gray-500"></i>
          </button>
        </div>

        <input
          v-model="search"
          type="text"
          class="px-4 py-2 border border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-500 focus:border-app-primary text-sm rounded-lg appearance-none focus:outline-none"
          placeholder="Search token, address or exchange..."
        />

        <template>
          <div v-for="(tokenList, category) in categories" :key="category">
            <div
              class="border-b border-gray-200 dark:border-gray-800 text-gray-600 text-sm my-2"
            >
              {{ category }}
            </div>

            <div
              v-for="token in tokenList"
              :key="token.address"
              class="w-full flex items-center justify-between cursor-pointer py-1 rounded-md px-2 hover:bg-gray-200 dark-hover:bg-gray-800"
              @click="selectToken(token)"
            >
              <div class="space-x-2 flex items-center">
                <double-logo
                  :token0logo="token.currencyOneLogo"
                  :token1logo="token.currencyTwoLogo"
                />
                <div class="flex flex-col">
                  <span class="font-medium dark:text-gray-200">{{
                    token.name
                  }}</span>
                  <span class="text-xs text-gray-500 dark:text-gray-500">{{
                    token.exchange
                  }}</span>
                </div>
              </div>
              <div>
                <span
                  v-if="type === 'mint'"
                  class="text-gray-800 dark:text-gray-200 font-bold font-mono"
                >
                  <loader v-if="ui.loading" color="#2172E5" stroke="4" />
                  <span v-else>
                    {{
                      (token.balance &&
                        (toFixed(token.balance) || '').slice(0, 14)) ||
                      0
                    }}</span
                  >
                </span>
                <span
                  v-if="type === 'unlock'"
                  class="text-gray-800 dark:text-gray-200 font-bold font-mono"
                >
                  <loader v-if="ui.loading" color="#2172E5" stroke="4" />
                  <span v-else>
                    {{
                      (token.lockedBalance &&
                        (toFixed(token.lockedBalance) || '').slice(0, 16)) ||
                      0
                    }}</span
                  >
                </span>
              </div>
            </div>
          </div>
        </template>
        <template v-if="searchResult.length == 0">
          <div class="text-sm text-center p-4 text-gray-600">
            Token Not found.
          </div>
        </template>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal'
import supportedPoolTokens from '@/configs/supportedPoolTokens'
import { toFixed } from '~/utils'

import { getTokenBalance } from '~/mixins/ERC20'
import { getLockedLPT, checkLoan } from '~/mixins/info'

export default {
  extends: Modal,
  props: {
    persistent: {
      type: Boolean,
      default: false,
    },
    poolToken: {
      type: Object,
      default: null,
    },
    type: {
      type: String,
      default: 'mint',
    },
  },
  data() {
    return {
      ui: {
        loading: true,
      },
      search: '',
      supportedPoolTokens: supportedPoolTokens.map((e) => ({
        ...e,
        balance: 0,
        lockedBalance: 0,
        uTokenBalance: 0,
        mintedUTokens: 0,
      })),
      categories: [],
      tokens: null,
    }
  },

  computed: {
    searchResult() {
      const search = this.search.trim()
      if (search) {
        const regex = new RegExp(search, 'ig')
        return this.supportedPoolTokens.filter(
          ({ name, address, exchange, displayName }) =>
            regex.test(name) ||
            (search.slice(0, 2).toLowerCase() === '0x' &&
              regex.test(address)) ||
            regex.test(exchange) ||
            regex.test(displayName)
        )
      }
      return this.supportedPoolTokens
    },
  },

  watch: {
    modal(a) {
      if (!a) this.tokens = null
    },
    searchResult() {
      this.makeCategories()
    },
  },

  mounted() {
    this.makeCategories()
    this.getSupportedPoolTokens()
  },

  methods: {
    toFixed,
    selectToken(poolToken) {
      this.$emit('update:poolToken', poolToken)
      this.selectedToken = poolToken
      this.modal = false
    },

    makeCategories() {
      this.categories = this.searchResult.reduce((obj, token) => {
        const cat = token.category

        if (!obj[cat]) {
          obj[cat] = []
        }
        obj[cat].push(token)
        return obj
      }, {})
    },

    async getSupportedPoolTokens() {
      this.ui.loading = true
      try {
        const tokenList = await Promise.all(
          supportedPoolTokens.map(async (poolToken) => {
            const balance = await getTokenBalance(poolToken.address)
            const lockedBalance = await getLockedLPT(poolToken.llcAddress)
            const uTokenBalance = await getTokenBalance(
              poolToken.uToken.address
            )
            const mintedUTokens = await checkLoan(
              poolToken.llcAddress,
              poolToken.uToken.address
            )
            return {
              ...poolToken,
              balance: balance.formatted,
              lockedBalance: lockedBalance.formatted,
              uTokenBalance: uTokenBalance.formatted,
              mintedUTokens: mintedUTokens.formattedBalance,
            }
          })
        )

        if (this.type === 'mint') {
          this.supportedPoolTokens = tokenList
        } else if (this.type === 'unlock') {
          const filteredTokenList = tokenList.filter((e) => e.lockedBalance > 0)
          this.supportedPoolTokens = filteredTokenList
        }

        this.ui.loading = false
        if (this.selectedToken) {
          const updatedToken = this.supportedPoolTokens.find(
            ({ address }) => this.selectedToken.address === address
          )
          this.$emit('update:poolToken', updatedToken)
        }
      } catch (error) {
        this.ui.loading = false
        throw new Error('Something went wrong!')
      }
    },
  },
}
</script>
