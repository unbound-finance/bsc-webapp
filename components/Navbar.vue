<template>
  <div class="flex justify-between items-center py-4 px-8">
    <div class="flex items-center space-x-6">
      <!-- <p class="font-bold text-2xl text-light-primary dark:text-dark-primary">
        unbound
      </p> -->
      <img class="rounded-sm" src="~/assets/logo.png" width="28" alt="logo" />
      <nuxt-link to="/info" class="font-medium dark:text-white">
        Dashboard
      </nuxt-link>
      <nuxt-link to="/unb" class="font-medium dark:text-white"> UNB </nuxt-link>
    </div>

    <div class="flex items-center space-x-4">
      <ConnectWalletBtn />

      <!-- Toggle Button for Light/Dark Mode -->
      <button
        class="w-8 h-8 flex items-center justify-center rounded bg-gray-300 focus:outline-none"
        @click="toggleMode"
      >
        <img
          class="text-light-primary"
          :src="
            require(`~/assets/icons/${
              this.$colorMode.value === 'light' ? 'moon' : 'sun'
            }.svg`)
          "
          width="12"
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
