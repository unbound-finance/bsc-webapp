<template>
  <div class="main_container my-4 md:my-8">
    <div class="flex flex-col space-y-6">
      <p class="text-3xl font-bold text-gray-800 dark:text-gray-200">Faucet</p>

      <ul class="text-sm text-gray-600 list-disc px-4">
        <li>This faucet will give you our test tokens on kovan testnet.</li>
        <li>
          You can get kovan test ethers
          <a
            href="https://faucet.kovan.network/"
            target="_blank"
            class="text-light-primary dark:text-dark-primary font-medium"
            >here</a
          >
        </li>
        <li>
          These are ETH, DAI, USDC, USDT, WBTC, LINK, ENJ and TOMOE. You can
          find token addresses
          <a
            href="https://www.notion.so/Unbound-Testnet-06c16fd6fcb4479da2cb3b03389b5c39"
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

      <div v-if="isWalletConnected" class="flex items-center space-x-2">
        <button
          type="button"
          class="w-full font-medium bg-gradient-to-r from-light-primary to-dark-primary text-white rounded-lg py-4 appearance-none focus:outline-none"
          @click="requestKeth"
        >
          <loader v-if="ui.ethLoading" />
          <span v-else>Request ETH</span>
        </button>

        <button
          type="button"
          class="w-full font-medium bg-gradient-to-r from-light-primary to-dark-primary text-white rounded-lg py-4 appearance-none focus:outline-none"
          @click="requestFaucet"
        >
          <loader v-if="ui.loading" />
          <span v-else>Request Tokens</span>
        </button>
      </div>

      <connect-wallet-btn v-else class="w-full" />
    </div>
    <span v-if="ui.errorMsg" class="text-sm text-red-600 my-2">{{
      ui.errorMsg
    }}</span>
    <div v-if="ui.successMsg" class="text-sm text-green-600 my-2">
      <span>{{ ui.successMsg }}</span>
      <a :href="txLink" target="_blank" class="text-sm text-green-600 underline"
        >View Transaction</a
      >
    </div>
    <SuccessModal v-model="ui.showSuccess" :hash="txLink" />
  </div>
</template>

<script>
import { ethers } from 'ethers'

import UnboundFaucet from '~/configs/abi/UnboundFaucet'
import config from '~/configs/config'

export default {
  data() {
    return {
      ui: {
        loading: false,
        ethLoading: false,
        showSuccess: false,
        errorMsg: null,
        successMsg: null,
        showRequestEth: false,
      },
      txLink: null,
    }
  },

  computed: {
    isWalletConnected() {
      return !!this.$store.state.address
    },
  },

  async mounted() {
    const ethBalance = await this.ethBalance()
    if (!ethBalance) {
      this.ui.showRequestEth = true
    }
  },

  methods: {
    async ethBalance() {
      try {
        const provider = await new ethers.providers.Web3Provider(
          window.ethereum
        )
        const address = await provider.getSigner().getAddress()
        // Read ETH Balance
        const ethBalance = await provider.getBalance(address)
        const etherString = ethers.utils.formatEther(ethBalance)
        if (etherString > '0.0') return true
        return false
      } catch (error) {
        console.log(error)
      }
    },

    async requestKeth() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = await provider.getSigner().getAddress()
      this.ui.errorMsg = null
      this.ui.successMsg = null
      this.ui.ethLoading = true

      try {
        const { data } = await this.$axios.post(
          'https://faucet.unbound.finance/api/release',
          {
            address: signer,
          }
        )
        console.log(data)
        this.ui.successMsg = `0.05 kovan ETH sent. Please wait for the transaction to get confirmed before requesting the pool tokens.`
        this.txLink = `https://kovan.etherscan.io/tx/${data.hash}`
        this.ui.ethLoading = false
        // this.ui.showRequestEth = false
      } catch (error) {
        this.ui.errorMsg = 'You can request kovan ETH only once in 24 hours.'
        this.ui.ethLoading = false
        setTimeout(() => {
          this.ui.errorMsg = null
        }, 2500)
      }
    },

    async requestFaucet() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      this.ui.errorMsg = null
      this.ui.successMsg = null
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
        // eslint-disable-next-line eqeqeq
        if (error.code == 4001) {
          this.ui.errorMsg = 'User denied transaction signature.'
        } else {
          this.ui.errorMsg = 'You can request only once every 24 hours.'
        }
        this.ui.loading = false
        setTimeout(() => {
          this.ui.errorMsg = null
        }, 2500)
      }
    },
  },
}
</script>

<style></style>
