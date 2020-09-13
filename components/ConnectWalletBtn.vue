<template>
  <div>
    <button
      v-if="address"
      class="px-6 py-2 bg-white dark:bg-gray-900 dark:text-white rounded border border-gray-300 dark:border-gray-800 focus:outline-none"
    >
      {{ address.substring(0, 15) + '...' }}
    </button>
    <button
      v-else
      class="w-full px-6 py-2 font-semibold rounded text-light-primary dark:text-white bg-light-primary dark:bg-dark-primary bg-opacity-25 focus:outline-none"
      @click="connectMetamask"
    >
      Connect Wallet
    </button>
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
    this.connectMetamask()
  },
  methods: {
    async connectMetamask() {
      if (window.ethereum) {
        try {
          // Request account access if needed
          await window.ethereum.enable()
          const provider = await new ethers.providers.Web3Provider(
            window.ethereum
          )
          const address = await provider.getSigner().getAddress()
          this.address = address

          // Store provider in state
          this.$store.commit('getProvider', address)

          // Acccounts now exposed
        } catch (error) {
          console.log(error)
          // this.isMetamaskConnected()
          // User denied account access...
          // alert('Please allow access for the app to work')
        }
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
        const provider = await new ethers.providers.Web3Provider(
          window.ethereum
        )
        const address = await provider.getSigner().getAddress()
        this.address = address
        // Acccounts always exposed
      } else {
        console.log(
          'Non-Ethereum browser detected. You should consider trying MetaMask!'
        )
      }
    },
  },
}
</script>

<style></style>
