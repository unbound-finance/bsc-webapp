<template>
  <div class="flex justify-between items-center p-4">
    <div>
      <p class="font-bold text-2xl text-light-primary dark:text-dark-primary">
        unbound
      </p>
    </div>

    <div class="flex items-center space-x-4">
      <button
        class="px-6 py-2 font-semibold rounded text-light-primary dark:text-white bg-light-primary dark:bg-dark-primary bg-opacity-25 focus:outline-none"
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
export default {
  methods: {
    toggleMode() {
      this.$colorMode.preference =
        this.$colorMode.value === 'light' ? 'dark' : 'light'
    },
  },
}
</script>

<style></style>
