<template>
  <div class="main_container my-4 md:my-8">
    <div class="flex flex-col space-y-6">
      <p class="text-3xl font-bold text-gray-800 dark:text-gray-200">Faucet</p>

      <ul class="text-sm text-gray-600 list-disc px-4">
        <li>This faucet will give you our test tokens on kovan testnet .</li>
        <li>
          These are ETH, DAI, USDC, USDT, WBTC, LINK, ENJ and TOMOE. You can
          find token addresses
          <a
            href="https://www.notion.so/Unbound-Token-Addresses-1815d02f646e4b5eb037c2e06690f14b"
            target="_blank"
            class="text-light-primary dark:text-dark-primary font-medium"
            >here</a
          >
        </li>
        <li>
          You can then go to Uniswap, provide liquidity to the pool and receive
          Liquidity Pool Tokens(LPT).
        </li>
        <li>
          Then visit the unbound dashboard, use Mint to collatralize this LPT.
        </li>
        <li>
          The Uniswap pools that we support on testent are
          <nuxt-link
            to="/analytics"
            class="text-light-primary dark:text-dark-primary font-medium"
            >here</nuxt-link
          >
        </li>
      </ul>

      <p class="font-medium italic text-xs text-gray-600">
        **Note: You can only request test tokens once every 24 hours for your
        address.
      </p>

      <button
        v-if="isWalletConnected"
        type="button"
        class="w-full font-medium text-white rounded-lg py-4 appearance-none focus:outline-none"
        :class="
          ui.errorMsg
            ? 'bg-gradient-to-r from-red-700 to-red-600'
            : 'bg-gradient-to-r from-light-primary to-dark-primary'
        "
        @click="requestFaucet"
      >
        <loader v-if="ui.loading" />
        <span v-else>{{ ui.errorMsg ? ui.errorMsg : 'Request Tokens' }}</span>
      </button>
      <connect-wallet-btn v-else class="w-full" />
    </div>
    <SuccessModal v-model="ui.showSuccess" :hash="txLink" />
  </div>
</template>

<script>
import { ethers } from 'ethers'

import UnboundFaucet from '~/configs/abi/UnboundFaucet'
import config from '~/configs/config'

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

export default {
  data() {
    return {
      ui: {
        loading: false,
        showSuccess: false,
        errorMsg: null,
      },
      txLink: null,
    }
  },

  computed: {
    isWalletConnected() {
      return !!this.$store.state.address
    },
  },

  methods: {
    async requestFaucet() {
      this.ui.errorMsg = null
      this.ui.loading = true
      const faucet = await new ethers.Contract(
        config.faucet,
        UnboundFaucet,
        signer
      )

      try {
        if (this.$store.state.address) {
          const distribute = await faucet.releaseAll(this.$store.state.address)
          this.ui.loading = false
          this.txLink = distribute.hash
          this.ui.showSuccess = true
        }
      } catch (error) {
        this.ui.errorMsg = 'You can request only once every 24 hours.'
        setTimeout(() => {
          this.ui.errorMsg = null
        }, 2500)
        this.ui.loading = false
      }
    },
  },
}
</script>

<style></style>
