<template>
  <div class="flex justify-between items-center p-4">
    <div>
      <p class="font-bold text-2xl text-light-primary dark:text-dark-primary">
        unbound
      </p>
    </div>

    <div class="flex items-center space-x-4">
      <button
        v-if="userAddress"
        class="px-6 py-2 bg-white dark:bg-gray-900 dark:text-white rounded border border-gray-300 dark:border-gray-800 focus:outline-none"
        @click="ui.showDialog = true"
      >
        {{ userAddress.substring(0, 15) + '...' }}
      </button>
      <ConnectWalletBtn v-else />
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
    <!-- Change Wallet Address Modal -->
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
                {{ userAddress }}
              </p>
            </div>

            <div class="mt-2">
              <a
                :href="`https://etherscan.io/address/${userAddress}`"
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
import Modal from '@/components/_app/Modal'
import ConnectWalletBtn from '@/components/ConnectWalletBtn'

export default {
  components: { Modal, ConnectWalletBtn },
  data() {
    return {
      ui: {
        showDialog: false,
      },
    }
  },

  computed: {
    userAddress() {
      return this.$store.state.address
    },
  },

  mounted() {
    window.ethereum.on('accountsChanged', function (networkId) {
      location.reload()
      // Time to reload your interface with the new networkId
    })
  },
  methods: {
    toggleMode() {
      this.$colorMode.preference =
        this.$colorMode.value === 'light' ? 'dark' : 'light'
    },
  },
}
</script>

<style></style>
