<template>
  <Modal v-model="modal" :persistent="persistent">
    <div v-if="ui.loading">
      <div class="flex flex-col space-y-2 p-4">
        <loader color="#059991" size="64" speed="2" stroke="4" />
        <span class="text-gray-600 text-center text-sm">Fetching Tokens</span>
      </div>
    </div>
    <template v-else>
      <div
        v-if="tokens || type === 'unlock'"
        class="flex flex-col space-y-4 p-4"
      >
        <div class="flex justify-between items-center">
          <button
            v-if="type === 'mint'"
            class="text-sm focus:outline-none appearance-none"
            @click="tokens = null"
          >
            Back
          </button>
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

        <template v-if="searchResult.length != 0">
          <div
            v-for="(token, index) in searchResult"
            :key="index"
            class="hover:bg-gray-200 dark-hover:bg-gray-800 rounded-md px-2"
            @click="selectToken(token)"
          >
            <div
              class="w-full flex items-center justify-between cursor-pointer py-1"
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
        <template v-else>
          <div class="text-sm text-center p-4 text-gray-600">
            Token Not found.
          </div>
        </template>
      </div>
      <div v-else>
        <div class="flex flex-col p-4">
          <div class="flex justify-between items-center">
            <p class="font-medium dark:text-white">Select Category</p>
            <button
              type="button"
              class="focus:outline-none"
              @click="modal = false"
            >
              <i class="fas fa-times text-gray-900 dark:text-gray-500"></i>
            </button>
          </div>
          <div class="mt-4">
            <div v-for="(tokenList, category) in categories" :key="category">
              <button
                class="p-2 w-full text-sm text-left rounded-md hover:bg-gray-200 dark-hover:bg-gray-800 appearance-none focus:outline-none"
                @click="tokens = tokenList"
              >
                {{ category }}
              </button>
            </div>
          </div>
        </div>
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
      const tokens =
        this.type === 'mint' ? this.tokens || [] : this.supportedPoolTokens
      const search = this.search.trim()
      if (search) {
        const regex = new RegExp(search, 'ig')
        return tokens.filter(
          ({ name, address, exchange }) =>
            regex.test(name) ||
            (search.slice(0, 2).toLowerCase() === '0x' &&
              regex.test(address)) ||
            regex.test(exchange)
        )
      }
      return tokens
    },
  },

  watch: {
    modal(a) {
      if (!a) this.tokens = null
    },
  },

  async mounted() {
    await this.getSupportedPoolTokens()
    this.makeCategories()
  },
  methods: {
    toFixed,
    selectToken(poolToken) {
      this.$emit('update:poolToken', poolToken)
      this.selectedToken = poolToken
      this.modal = false
    },

    makeCategories() {
      this.categories = this.supportedPoolTokens.reduce((obj, token) => {
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
        this.supportedPoolTokens = await Promise.all(
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
              lockedBalance,
              uTokenBalance: uTokenBalance.formatted,
              mintedUTokens,
            }
          })
        )
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
