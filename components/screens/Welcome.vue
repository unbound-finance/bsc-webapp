<template>
  <div class="flex flex-col items-center w-full py-8">
    <p class="text-center font-medium dark:text-white text-lg">
      Welcome to Unbound
    </p>

    <div class="flex flex-col space-y-4 mt-8 w-full px-2 md:px-8">
      <nuxt-link v-for="(data, i) in pages" :key="i" :to="data.route">
        <div
          class="p-4 border border-gray-200 dark:border-gray-800 rounded-lg w-full flex space-x-4"
        >
          <img
            :src="require(`~/assets/icons/${data.icon}.svg`)"
            width="32"
            :alt="data.title"
          />
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
</template>

<script>
export default {
  data() {
    return {
      pages: [
        {
          title: 'Mint',
          route: '/mint',
          icon: 'mint',
          description: 'Mint ETH/DAI by Locking Uniswap Pool Tokens.',
        },
        {
          title: 'Burn',
          route: '/burn',
          icon: 'burn',
          description: 'Get Back Uniswap Pool Tokens.',
        },
        {
          title: 'Earn',
          route: '/earn',
          icon: 'earn',
          description: 'Stake Unbound Tokens to Keep Earning on Autopilot.',
        },
      ],
    }
  },
}
</script>

<style></style>
