<template>
  <div class="flex justify-between items-center p-4">
    <div>
      <p class="font-bold text-2xl text-light-primary dark:text-dark-primary">
        unbound
      </p>
    </div>

    <div class="flex items-center space-x-4">
      <a
        v-if="address"
        href="#"
        class="p-3 rounded bg-gray-300"
        @click="ui.showDialog = true"
      >
        {{ address.substring(0, 15) + '...' }}
      </a>
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
    <Modal :show="ui.showDialog" @close="ui.showDialog = false">
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
              <button
                type="button"
                class="focus:outline-none px-2 py-1 rounded text-sm bg-light-primary dark:bg-dark-primary bg-opacity-25 text-light-primary dark:text-white"
              >
                Change
              </button>
            </div>

            <div class="w-full md:w-1/2 pt-4">
              <p class="truncate font-medium text-md md:text-xl">
                {{ address }}
              </p>
            </div>

            <div class="mt-2">
              <a
                :href="`https://etherscan.io/address/${address}`"
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
  </div>
</template>

<script>
import { ethers } from 'ethers'
import Web3 from 'web3'
import Modal from '@/components/_app/Modal'

export default {
  components: { Modal },
  data() {
    return {
      address: '',
      ui: {
        showDialog: false,
      },
    }
  },

  mounted() {
    window.ethereum.on('accountsChanged', function (networkId) {
      location.reload()
      // Time to reload your interface with the new networkId
    })
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
          await window.ethereum.enable()
          const provider = await new ethers.providers.Web3Provider(
            window.ethereum
          )
          const address = await provider.getSigner().getAddress()
          this.address = address
          location.reload()
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

    async isMetamaskConnected() {
      try {
        const provider = await new ethers.providers.Web3Provider(
          window.ethereum
        )
        const address = await provider.getSigner().getAddress()
        this.address = address
      } catch (error) {
        console.log(error)
        // location.reload()
      }
    },
  },
}
</script>

<style></style>
