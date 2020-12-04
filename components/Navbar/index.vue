<template>
  <div class="flex justify-between items-center py-4 px-8">
    <div class="flex items-center space-x-6">
      <img class="rounded-sm" src="~/assets/logo.svg" width="24" alt="logo" />
      <nuxt-link to="/" class="font-medium dark:text-white">
        Dashboard
      </nuxt-link>
      <nuxt-link to="/claim" class="font-medium dark:text-white">
        Claim
      </nuxt-link>
      <nuxt-link to="/calculator" class="font-medium dark:text-white">
        Calculator
      </nuxt-link>
      <nuxt-link to="/account" class="font-medium dark:text-white">
        Account
      </nuxt-link>
      <nuxt-link to="/analytics" class="font-medium dark:text-white">
        Analytics
      </nuxt-link>
      <nuxt-link to="/faucet" class="font-medium dark:text-white">
        Faucet
      </nuxt-link>
    </div>

    <div class="flex items-center space-x-4">
      <ConnectWalletBtn />

      <!-- Toggle Button for Light/Dark Mode -->
      <button
        class="w-8 h-8 flex items-center justify-center rounded bg-gray-300 dark:bg-gray-700 focus:outline-none"
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

      <div class="relative inline-block text-left">
        <div>
          <span class="rounded-md shadow-sm">
            <button
              type="button"
              class="inline-flex w-8 h-8 justify-center items-center rounded-md bg-gray-300 dark:bg-gray-700 px-4 py-2 text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
              aria-haspopup="true"
              aria-expanded="true"
              @click="ui.openDrawer = !ui.openDrawer"
            >
              <i
                class="fas fa-ellipsis-h text-xs p-0 m-0 dark:text-gray-900"
              ></i>
            </button>
          </span>
        </div>

        <div
          v-if="ui.openDrawer"
          class="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg"
        >
          <div class="rounded-md bg-white dark:bg-gray-900 shadow-xs">
            <div
              class="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <a
                href="https://unbound.finance/"
                target="_blank"
                class="block px-4 py-2 text-sm leading-5 text-gray-700 dark:text-gray-500 hover:bg-gray-100 dark-hover:bg-gray-800 hover:text-gray-900 dark-hover:text-gray-500 focus:outline-none focus:bg-gray-100 focus:text-gray-900 dark-focus:text-gray-500"
                role="menuitem"
              >
                <div class="flex space-x-2 items-center">
                  <i class="fas fa-info-circle text-xs dark:text-gray-500"></i>
                  <span>About</span>
                </div>
              </a>
              <a
                href="http://docs.unbound.finance/"
                target="_blank"
                class="block px-4 py-2 text-sm leading-5 text-gray-700 dark:text-gray-500 hover:bg-gray-100 dark-hover:bg-gray-800 hover:text-gray-900 dark-hover:text-gray-500 focus:outline-none focus:bg-gray-100 focus:text-gray-900 dark-focus:text-gray-500"
                role="menuitem"
              >
                <div class="flex space-x-2 items-center">
                  <i class="fas fa-book-open text-xs dark:text-gray-500"></i>
                  <span>Docs</span>
                </div>
              </a>
              <!-- <a
                href="#"
                class="block px-4 py-2 text-sm leading-5 text-gray-700 dark:text-gray-500 hover:bg-gray-100 dark-hover:bg-gray-800 hover:text-gray-900 dark-hover:text-gray-500 focus:outline-none focus:bg-gray-100 focus:text-gray-900 dark-focus:text-gray-500"
                role="menuitem"
              >
                <div class="flex space-x-2 items-center">
                  <i class="fas fa-code text-xs dark:text-gray-500"></i>
                  <span>Code</span>
                </div>
              </a> -->
              <a
                href="https://twitter.com/unboundfinance"
                target="_blank"
                class="block px-4 py-2 text-sm leading-5 text-gray-700 dark:text-gray-500 hover:bg-gray-100 dark-hover:bg-gray-800 hover:text-gray-900 dark-hover:text-gray-500 focus:outline-none focus:bg-gray-100 focus:text-gray-900 dark-focus:text-gray-500"
                role="menuitem"
              >
                <div class="flex space-x-2 items-center">
                  <i class="fab fa-twitter text-xs dark:text-gray-500"></i>
                  <span>Twitter</span>
                </div>
              </a>
              <a
                href="https://t.me/unboundfinance"
                target="_blank"
                class="block px-4 py-2 text-sm leading-5 text-gray-700 dark:text-gray-500 hover:bg-gray-100 dark-hover:bg-gray-800 hover:text-gray-900 dark-hover:text-gray-500 focus:outline-none focus:bg-gray-100 focus:text-gray-900 dark-focus:text-gray-500"
                role="menuitem"
              >
                <div class="flex space-x-2 items-center">
                  <i
                    class="fab fa-telegram-plane text-xs dark:text-gray-500"
                  ></i>
                  <span>Telegram</span>
                </div>
              </a>
              <a
                href="https://medium.com/@unboundfinance"
                target="_blank"
                class="block px-4 py-2 text-sm leading-5 text-gray-700 dark:text-gray-500 hover:bg-gray-100 dark-hover:bg-gray-800 hover:text-gray-900 dark-hover:text-gray-500 focus:outline-none focus:bg-gray-100 focus:text-gray-900 dark-focus:text-gray-500"
                role="menuitem"
              >
                <div class="flex space-x-2 items-center">
                  <i class="fab fa-medium-m text-xs dark:text-gray-500"></i>
                  <span>Medium</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ui: {
        openDrawer: false,
      },
    }
  },
  computed: {
    userAddress() {
      return this.$store.state.address
    },
  },

  methods: {
    toggleMode() {
      this.$colorMode.preference =
        this.$colorMode.value === 'light' ? 'dark' : 'light'
    },
    closeDrawer() {
      this.ui.openDrawer = false
    },
  },
}
</script>

<style></style>
