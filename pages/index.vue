<template>
  <div class="main_container my-4 md:my-8">
    <div class="flex flex-col items-center w-full p-4">
      <p class="text-center font-medium dark:text-white text-lg">
        Welcome to Unbound
      </p>

      <div class="flex flex-col space-y-4 mt-8 w-full px-2">
        <nuxt-link
          v-for="(data, i) in pages"
          :key="i"
          :to="data.route"
          :event="data.isDisabled ? '' : 'click'"
        >
          <div
            class="p-4 border border-gray-200 dark:border-gray-800 rounded-lg w-full flex items-center space-x-2 gap-4"
          >
            <div class="w-8 h-8">
              <img
                :src="require(`~/assets/icons/${data.icon}`)"
                :alt="data.title"
                style="min-width: 32px"
              />
            </div>
            <div>
              <p class="font-medium dark:text-white">{{ data.title }}</p>
              <p class="text-sm text-gray-600 dark:text-white opacity-50">
                {{ data.description }}
              </p>
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'isAuthenticated',
  data() {
    return {
      pages: [
        {
          title: 'Mint',
          route: '/mint',
          icon: 'mint.svg',
          description:
            'Collateralize your liquidity pool tokens to generate UND or uETH.',
          isDisabled: false,
        },
        {
          title: 'Unlock',
          route: '/unlock',
          icon: 'burn.svg',
          description: 'Unlock your liquidity pool tokens.',
          isDisabled: false,
        },
        {
          title: 'Earn',
          route: '/earn',
          icon: 'earn.svg',
          description: 'Add liquidity and earn minting fees.',
          isDisabled: false,
        },
      ],
    }
  },
}
</script>

<style></style>
