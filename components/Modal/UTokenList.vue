<template>
  <Modal v-model="modal" :persistent="persistent">
    <div class="flex flex-col space-y-4 p-4">
      <div class="flex justify-between items-center">
        <p class="font-medium dark:text-white">Select Pool Token</p>
        <button type="button" class="focus:outline-none" @click="modal = false">
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
              <img :src="require(`~/assets/tokens/${token.icon}`)" width="16" />
              <div class="flex flex-col">
                <span class="font-medium dark:text-gray-200">{{
                  token.name
                }}</span>
              </div>
            </div>
            <div>
              <span
                v-if="type === 'add'"
                class="text-gray-800 dark:text-gray-200 font-bold font-mono"
              >
                <loader v-if="ui.loading" color="#2172E5" stroke="4" />
                <span v-else>
                  {{ (token.poolInfo && token.uTokenbalance) || 0 }}</span
                >
              </span>
              <span
                v-if="type === 'remove'"
                class="text-gray-800 dark:text-gray-200 font-bold font-mono"
              >
                <loader v-if="ui.loading" color="#2172E5" stroke="4" />
                <span v-else>
                  {{ (token.poolInfo && token.poolInfo.token1) || 0 }}</span
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
  </Modal>
</template>

<script>
import { ethers } from 'ethers'

import Modal from '@/components/Modal'

import supportedUTokens from '@/configs/supportedUTokens'
import { ERC20_ABI, contracts } from '~/constants'

import { getTokenBalance } from '~/utils/ERC20'
import { getAmountOfLockedTokens } from '~/mixins/stake'

export default {
  extends: Modal,
  props: {
    persistent: {
      type: Boolean,
      default: false,
    },
    uToken: {
      type: Object,
      default: null,
    },
    type: {
      type: String,
      default: 'add',
    },
  },
  data() {
    return {
      search: '',
      supportedUTokens,
      ui: {
        loading: false,
      },
    }
  },

  computed: {
    searchResult() {
      const search = this.search.trim()
      if (search) {
        const regex = new RegExp(search, 'ig')
        return this.supportedUTokens.filter(
          ({ name, address, exchange }) =>
            regex.test(name) ||
            (search.slice(0, 2).toLowerCase() === '0x' &&
              regex.test(address)) ||
            regex.test(exchange)
        )
      }
      return this.supportedUTokens
    },
  },

  mounted() {
    this.getSupportedUTokens()
  },
  methods: {
    selectToken(uToken) {
      this.$emit('update:uToken', uToken)
      this.selectedToken = uToken
      this.modal = false
    },

    async getAllowance(tokenAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)

      const signer = provider.getSigner()
      const userAddress = provider.getSigner().getAddress()
      const contract = await new ethers.Contract(
        tokenAddress,
        ERC20_ABI,
        signer
      )
      const allowance = await contract.allowance(
        userAddress,
        contracts.uniswapRouter
      )
      return allowance
    },

    async getSupportedUTokens() {
      try {
        this.ui.loading = true

        this.supportedUTokens = await Promise.all(
          supportedUTokens.map(async (uToken) => {
            const uTokenbalance = await getTokenBalance(uToken.address)
            const tokenBalance = await getTokenBalance(uToken.token.address)
            const uTokenAllowance = await this.getAllowance(uToken.address)
            const tokenAllowance = await this.getAllowance(uToken.token.address)
            const poolInfo = await getAmountOfLockedTokens(uToken.lptAddress)

            return {
              ...uToken,
              uTokenbalance: uTokenbalance.formatted,
              tokenBalance: tokenBalance.formatted,
              uTokenAllowance: uTokenAllowance.toString(),
              tokenAllowance: tokenAllowance.toString(),
              poolInfo,
            }
          })
        )

        this.ui.loading = false
        if (this.selectedToken) {
          const updatedToken = this.supportedUTokens.find(
            ({ address }) => this.selectedToken.address === address
          )
          this.$emit('update:uToken', updatedToken)
        }
      } catch (error) {
        this.ui.loading = false
        throw new Error('Something went wrong!')
      }
    },
  },
}
</script>
