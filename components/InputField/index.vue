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
                >{{ poolToken.balance }}</span
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
              @click="model = poolToken.lockedBalance"
            >
              Max
            </button>
            <p class="text-xs text-gray-500">
              Locked LPT's:
              <span
                class="font-mono text-gray-900 dark:text-gray-500 font-medium"
                >{{ poolToken.lockedBalance }}</span
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

            <button
              v-else
              type="button"
              class="bg-light-primary text-white text-xs font-medium rounded py-1 w-2/3 focus:outline-none"
              @click="ui.showTokenListModal = true"
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
  </div>
</template>

<script>
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
      },
      poolToken: null,
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
    model(a) {
      this.$emit('input', a)
    },
    poolToken(a) {
      this.model = null
      this.$emit('update:poolToken', a)
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
