<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="mint__input dark:border-gray-700">
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-500">{{ label }}</span>
        <slot name="showBalance">
          <div
            v-if="poolToken && type === 'mint'"
            class="flex items-center space-x-2"
          >
            <button
              type="button"
              class="appearance-none text-xs leading-tight text-light-primary dark:text-dark-primary hover:underline focus:outline-none"
              @click="model = poolToken.balance"
            >
              Max
            </button>
            <p class="text-xs text-gray-500">
              Balance:
              <span
                class="font-mono text-gray-900 dark:text-gray-500 font-medium"
                >{{ (toFixed(poolToken.balance) || '').slice(0, 16) }}</span
              >
            </p>
          </div>
          <div
            v-if="poolToken && type === 'unlock'"
            class="flex items-center space-x-2"
          >
            <button
              type="button"
              class="appearance-none text-xs leading-tight text-light-primary dark:text-dark-primary hover:underline focus:outline-none"
              @click="model = poolToken.lockedBalance.toString().slice(0, 16)"
            >
              Max
            </button>
            <p class="text-xs text-gray-500">
              Locked LPT's:
              <span
                class="font-mono text-gray-900 dark:text-gray-500 font-medium"
                >{{ poolToken.lockedBalance.toString().slice(0, 16) }}</span
              >
            </p>
          </div>
          <div
            v-if="uToken && type === 'add'"
            class="flex items-center space-x-2"
          >
            <button
              type="button"
              class="appearance-none text-xs leading-tight text-light-primary dark:text-dark-primary hover:underline focus:outline-none"
              @click="model = uToken.uTokenbalance"
            >
              Max
            </button>
            <p class="text-xs text-gray-500">
              Balance:
              <span
                class="font-mono text-gray-900 dark:text-gray-500 font-medium"
                >{{ uToken.uTokenbalance }}</span
              >
            </p>
          </div>
        </slot>
      </div>
      <form>
        <div class="flex items-center py-2">
          <div v-if="loading" class="loading-dots text-4xl w-full">.</div>
          <input
            v-else
            v-model="model"
            type="number"
            placeholder="0.00"
            class="font-mono text-3xl pr-4 appearance-none bg-transparent text-gray-900 dark:text-gray-200 font-medium w-full leading-tight focus:outline-none"
            :class="readonly ? 'cursor-not-allowed' : ''"
            :readonly="readonly"
            v-on="listeners"
          />
          <slot name="append">
            <div v-if="poolToken" class="flex flex-col">
              <button
                type="button"
                class="flex items-center focus:outline-none"
                @click="ui.showTokenListModal = true"
              >
                <double-logo
                  :token0logo="poolToken.currencyOneLogo"
                  :token1logo="poolToken.currencyTwoLogo"
                />
                <div
                  class="flex items-center hover:bg-gray-100 dark-hover:bg-gray-900 rounded-md p-1"
                >
                  <p
                    class="text-gray-900 dark:text-gray-200 font-semibold text-right whitespace-no-wrap"
                  >
                    {{ poolToken.name }}
                  </p>
                  <i
                    class="fas fa-chevron-down dark:text-gray-200 text-xs pl-1 font-bold"
                  ></i>
                </div>
              </button>
              <span class="text-xs text-right text-gray-500">{{
                poolToken.exchange
              }}</span>
            </div>

            <div v-else-if="uToken" class="flex items-center space-x-2">
              <button
                v-if="uToken.uTokenAllowance == '0' && uToken"
                type="button"
                class="px-2 py-1 rounded border border-light-primary dark:border-dark-primary text-xs text-light-primary dark:text-dark-primary appearance-none focus:outline-none"
                @click="approve(uToken.address)"
              >
                Approve
              </button>
              <button
                type="button"
                class="flex items-center focus:outline-none"
                @click="ui.showUTokenListModal = true"
              >
                <img
                  :src="require(`~/assets/tokens/${uToken.icon}`)"
                  width="16"
                />

                <div
                  class="flex items-center hover:bg-gray-100 dark-hover:bg-gray-900 rounded-md p-1"
                >
                  <p
                    class="text-gray-900 dark:text-gray-200 font-semibold text-right whitespace-no-wrap"
                  >
                    {{ uToken.name }}
                  </p>
                  <i
                    class="fas fa-chevron-down dark:text-gray-200 text-xs pl-1 font-bold"
                  ></i>
                </div>
              </button>
            </div>

            <button
              v-else
              type="button"
              class="bg-light-primary text-white text-xs font-medium rounded py-1 w-2/3 focus:outline-none"
              @click="
                type === 'add'
                  ? (ui.showUTokenListModal = true)
                  : (ui.showTokenListModal = true)
              "
            >
              Select Token
              <i class="fas fa-chevron-down text-xs pl-1 font-bold"></i>
            </button>
          </slot>
        </div>
      </form>
    </div>
    <token-list
      v-model="ui.showTokenListModal"
      :pool-token.sync="poolToken"
      :type="type"
    />

    <u-token-list
      v-model="ui.showUTokenListModal"
      :u-token.sync="uToken"
    ></u-token-list>
  </div>
</template>

<script>
import { ethers } from 'ethers'

import { toFixed } from '~/utils'

import ERC20ABI from '~/configs/abi/ERC20'
import config from '~/configs/config'
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'mint',
    },
    value: {
      type: [String, Number],
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      model: this.value,
      ui: {
        showTokenListModal: false,
        showUTokenListModal: false,
      },
      poolToken: null,
      uToken: null,
      LPTBalance: 0,
    }
  },
  computed: {
    listeners() {
      const { blur, focus } = this.$listeners
      const listeners = {}
      if (blur) listeners.blur = blur
      if (focus) listeners.focus = focus
      return listeners
    },
  },
  watch: {
    value(a) {
      this.model = a
    },
    model(a, b) {
      this.$emit('input', a)
    },
    poolToken(a) {
      this.model = null
      this.$emit('update:poolToken', a)
    },
    uToken(a) {
      this.model = null
      this.$emit('update:uToken', a)
    },
  },
  methods: {
    toFixed,
    async approve(tokenAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = await new ethers.Contract(tokenAddress, ERC20ABI, signer)
      try {
        const totalSupply = contract.totalSupply()
        const approve = await contract.approve(
          config.contracts.uniswapRouter,
          totalSupply
        )
        this.ui.showSuccess = true
        this.txLink = approve.hash
        this.checkAllowances()
      } catch (error) {
        this.ui.showRejected = true
      }
    },
  },
}
</script>

<style lang="scss">
.mint__input {
  width: 100%;
  padding: 0.4rem 1.2rem;
  border: 1px solid #00000010;
  border-radius: 16px;
}
</style>
