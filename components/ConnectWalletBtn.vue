<template>
  <div>
    <button
      v-if="address"
      class="py-1 px-4 bg-white dark:bg-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-800 focus:outline-none"
      @click="ui.showDialog = true"
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

    <!-- Change Wallet Address Modal -->
    <Modal v-model="ui.showDialog">
      <template>
        <div class="flex flex-col space-y-4">
          <div class="flex justify-between items-center">
            <p class="font-medium dark:text-white">Account</p>
            <button
              type="button"
              class="focus:outline-none"
              @click="ui.showDialog = false"
            >
              <i class="fas fa-times text-gray-900 dark:text-gray-500"></i>
            </button>
          </div>

          <div
            class="rounded-lg border border-gray-300 dark:border-gray-800 p-4"
          >
            <div class="flex justify-between items-center">
              <p class="text-sm text-gray-600">Connected with Metamask</p>
              <div
                class="text-gray-600 dark:text-white text-xs bg-gray-200 dark:bg-gray-800 py-1 px-4 rounded-full"
              >
                {{ network }}{{ network !== 'main' ? ' testnet' : 'net' }}
              </div>
              <!-- <button
                type="button"
                class="focus:outline-none px-2 py-1 rounded text-sm bg-light-primary dark:bg-dark-primary bg-opacity-25 text-light-primary dark:text-white"
              >
                Change
              </button> -->
            </div>

            <div class="w-full md:w-1/2 pt-4">
              <p
                class="truncate font-medium text-md md:text-xl dark:text-white"
              >
                {{ address }}
              </p>
            </div>

            <div class="mt-2">
              <a
                :href="`https://${network}.etherscan.io/address/${address}`"
                target="_blank"
                class="flex items-center space-x-1 hover:underline"
              >
                <i class="fas fa-external-link-alt text-gray-600 text-xs"></i>
                <span class="text-gray-600 text-sm">View on Etherscan</span>
              </a>
            </div>
          </div>
        </div>
      </template>
    </Modal>

    <!-- Change Network Modal -->
    <Modal v-model="ui.showChgNetDialog">
      <template>
        <div class="flex flex-col space-y-4">
          <div class="flex justify-between items-center">
            <p class="font-medium dark:text-white">Change Your Network</p>
            <button
              type="button"
              class="focus:outline-none"
              @click="ui.showChgNetDialog = false"
            >
              <i class="fas fa-times text-gray-900 dark:text-gray-500"></i>
            </button>
          </div>

          <div>
            <p class="dark:text-gray-200 text-sm">
              We've detected that you need to switch your wallet's network from
              <span class="font-medium text-accent">
                {{ network }}
                {{ network === 'main' ? 'net' : 'testnet' }}</span
              >
              to
              <span class="font-medium text-accent">kovan testnet</span>
              network for this Dapp.
            </p>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import Web3 from 'web3'
import config from '../nuxt.config'

export default {
  data() {
    return {
      config,
      address: '',
      ui: {
        showDialog: false,
        showChgNetDialog: false,
      },
      network: null,
    }
  },

  mounted() {
    this.connectMetamask()
    this.getNetwork()
    this.reloadOnNetChange()
    this.reloadOnAccChange()
  },

  methods: {
    reloadOnNetChange() {
      if (window.ethereum || window.web3) {
        const ethereum = window.ethereum || window.web3

        // Silence the metamask warning 🤫
        ethereum.autoRefreshOnNetworkChange = false

        // Reload browser tab when newtork changed
        ethereum.on('chainChanged', (chainId) => {
          window.location.reload()
        })
      }
    },

    reloadOnAccChange() {
      if (window.ethereum || window.web3) {
        const ethereum = window.ethereum || window.web3

        // Silence the metamask warning 🤫
        ethereum.autoRefreshOnNetworkChange = false

        // Reload browser tab when account changed
        ethereum.on('accountsChanged', (accounts) => {
          window.location.reload()
        })
      }
    },

    async getNetwork() {
      if (window.ethereum || window.web3) {
        const web3 = new Web3(window.ethereum || window.web3)
        const network = await web3.eth.net.getNetworkType()
        this.$store.commit('getNetwork', network)
        this.network = network

        if (this.network !== 'kovan') {
          this.ui.showChgNetDialog = true
        }
      }
    },

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

          this.$emit('connected', address)

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
        console.log(this.getNetwork())
        const address = await provider.getSigner().getAddress()
        this.address = address
        this.$emit('connected', address)
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
