<template>
  <div class="flex justify-between items-center p-4">
    <div>
      <p class="font-bold text-2xl text-light-primary dark:text-dark-primary">
        unbound
      </p>
    </div>

    <div class="flex items-center space-x-4">
      <ConnectWalletBtn />

      <!-- Toggle Button for Light/Dark Mode -->
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
import ConnectWalletBtn from '@/components/ConnectWalletBtn'

export default {
  components: { ConnectWalletBtn },

  computed: {
    userAddress() {
      return this.$store.state.address
    },
  },

  mounted() {
    try {
      window.ethereum.on('accountsChanged', function (networkId) {
        location.reload()
        // Time to reload your interface with the new networkId
      })
    } catch (error) {}
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
