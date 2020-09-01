<template>
  <div class="flex justify-between items-center p-4">
    <div>
      <p class="font-bold text-2xl text-light-primary dark:text-dark-primary">
        unbound
      </p>
    </div>

    <div class="flex items-center space-x-4">
      <p v-if="address" class="p-3 rounded bg-gray-300">
        {{ address.substring(0, 15) + '...' }}
      </p>
      <button
        v-else
        class="px-6 py-2 font-semibold rounded text-light-primary dark:text-white bg-light-primary dark:bg-dark-primary bg-opacity-25 focus:outline-none"
        @click="connectMetamask"
      >
        Connect Wallet
      </button>
      <button
        class="p-3 rounded bg-gray-300 focus:outline-none"
        @click="toggleMode"
      >
        <img
          class="text-light-primary"
          :src="
            require(`~/assets/icons/${
              this.$colorMode.value === 'light' ? 'moon' : 'sun'
            }.svg`)
          "
          width="18"
          alt="mode"
        />
      </button>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import Web3 from 'web3'

export default {
  data() {
    return {
      address: '',
    }
  },

  mounted() {
    this.isMetamaskConnected()
  },
  methods: {
    toggleMode() {
      this.$colorMode.preference =
        this.$colorMode.value === 'light' ? 'dark' : 'light'
    },
    async connectMetamask() {
      if (window.ethereum) {
        try {
          // Request account access if needed
          window.ethereum.enable()
          const provider = await new ethers.providers.Web3Provider(
            window.ethereum
          )
          const address = await provider.getSigner().getAddress()
          this.address = address
          // Acccounts now exposed
        } catch (error) {
          // User denied account access...
          alert('Please allow access for the app to work')
        }
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
        // Acccounts always exposed
      } else {
        console.log(
          'Non-Ethereum browser detected. You should consider trying MetaMask!'
        )
      }
    },

    async isMetamaskConnected() {
      const provider = await new ethers.providers.Web3Provider(window.ethereum)
      const address = await provider.getSigner().getAddress()
      this.address = address
    },
  },
}
</script>

<style></style>
