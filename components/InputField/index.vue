<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="mint__input dark:border-gray-700">
      <div class="flex items-center justify-between">
        <span class="text-xs text-gray-500">{{ label }}</span>
        <slot name="showBalance">
          <div
            v-if="poolToken && type === 'mint'"
            class="flex items-center space-x-2"
          >
            <button
              type="button"
              class="appearance-none text-xs leading-tight text-light-primary dark:text-dark-primary hover:underline focus:outline-none"
              @click="model = poolToken.balance.slice(0, 18)"
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
              @click="model = poolToken.lockedBalance.slice(0, 18)"
            >
              Max
            </button>
            <p class="text-xs text-gray-500">
              Locked LPT's:
              <span
                class="font-mono text-gray-900 dark:text-gray-500 font-medium"
                >{{
                  (toFixed(poolToken.lockedBalance) || '').slice(0, 16)
                }}</span
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
              @click="model = uToken.uTokenbalance.slice(0, 18)"
            >
              Max
            </button>
            <p class="text-xs text-gray-500">
              Balance:
              <span
                class="font-mono text-gray-900 dark:text-gray-500 font-medium"
                >{{ uToken.uTokenbalance | toFixed(6) }}</span
              >
            </p>
          </div>
          <div
            v-if="uToken && type == 'remove'"
            class="flex items-center space-x-2"
          >
            <button
              type="button"
              class="appearance-none text-xs leading-tight text-light-primary dark:text-dark-primary hover:underline focus:outline-none"
              @click="model = uToken.poolInfo.token1.toString().slice(0, 18)"
            >
              Max
            </button>
            <p class="text-xs text-gray-500">
              Balance:
              <span
                class="font-mono text-gray-900 dark:text-gray-500 font-medium"
                >{{ uToken.poolInfo && uToken.poolInfo.token1 }}</span
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
            type="text"
            inputmode="decimal"
            title="Token Amount"
            autocomplete="off"
            autocorrect="off"
            minlength="1"
            maxlength="79"
            spellcheck="false"
            placeholder="0.0"
            class="font-mono text-2xl pr-4 appearance-none bg-transparent text-gray-900 dark:text-gray-200 font-medium leading-tight focus:outline-none"
            style="min-width: 0"
            :class="readonly ? 'cursor-not-allowed' : ''"
            :readonly="readonly"
            v-on="listeners"
            @keypress="onKeyPress"
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
                class="px-2 py-1 rounded border text-sm appearance-none focus:outline-none"
                :class="
                  approveState.cd
                    ? 'border-gray-600 dark:border-gray-700 text-gray-600 dark:text-gray-700 cursor-not-allowed'
                    : 'border-light-primary dark:border-dark-primary text-light-primary dark:text-dark-primary'
                "
                :disabled="approveState.cd"
                @click="approve(uToken.address)"
              >
                {{ approveState.msg }}
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
              class="bg-light-primary text-white text-xs font-medium rounded py-1 whitespace-no-wrap px-2 md:px-4 focus:outline-none"
              @click="
                type === 'add' || type === 'remove'
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
      :type="type"
    ></u-token-list>
  </div>
</template>

<script>
import { ethers } from 'ethers'

import { toFixed } from '~/utils'

import { ERC20_ABI, contracts } from '~/constants'
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
      model: this.value || '',
      ui: {
        showTokenListModal: false,
        showUTokenListModal: false,
      },
      poolToken: null,
      uToken: null,
      LPTBalance: 0,
      approveState: {
        cd: false,
        msg: 'Approve',
      },
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

    getDisabledClass() {
      return 'bg-gray-500 dark:bg-gray-900 text-gray-600 dark:text-gray-700 cursor-not-allowed'
    },

    getActiveClass() {
      return 'bg-light-primary text-light-primary dark:bg-dark-primary bg-opacity-25 dark:text-white'
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
    onKeyPress(e) {
      const { keyCode } = e
      if (keyCode === 46) {
        if (!this.model.length) {
          this.model = '0.'
        } else if (!this.model.includes('.')) return
      } else if (keyCode >= 48 && keyCode <= 57) return
      e.preventDefault()
    },
    async approve(tokenAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = await new ethers.Contract(
        tokenAddress,
        ERC20_ABI,
        signer
      )
      try {
        const totalSupply = contract.totalSupply()
        await contract.approve(contracts.pancakeRouter, totalSupply)
        // this.ui.showSuccess = true
        // this.txLink = approve.hash
        this.approveState = {
          cd: true,
          msg: 'Approving...',
        }
        await contract.on('Approval', (owner, spender, value) => {
          console.log(owner, spender, value.toString())
          this.uToken.uTokenAllowance = value.toString()
          this.approveState = {
            cd: false,
            msg: 'Approve',
          }
        })
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
