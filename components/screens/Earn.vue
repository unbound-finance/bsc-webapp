<template>
  <div>
    <div class="flex flex-col items-center w-full py-2 space-y-4 px-4">
      <div class="flex w-full items-center justify-between">
        <nuxt-link to="/">
          <button class="focus:outline-none">
            <i
              class="fas fa-chevron-left text-gray-900 dark:text-white text-lg"
            ></i>
          </button>
        </nuxt-link>
        <p class="text-center font-medium dark:text-white text-lg">Earn</p>
        <button class="focus:outline-none">
          <i class="far fa-question-circle text-gray-600 text-lg"></i>
        </button>
      </div>
      <nuxt-link class="w-full" to="/add">
        <button
          class="w-full py-3 mt-8 rounded-lg bg-light-primary dark:bg-dark-primary font-medium text-white focus:outline-none"
        >
          Add Liquidity
        </button>
      </nuxt-link>
    </div>
    <div class="mt-4 px-4">
      <p class="font-medium text-sm dark:text-gray-400">Your Liquidity</p>
      <div
        class="h-24 mt-4 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-800"
      >
        <span class="text-gray-500">No Liquidity Found.</span>
      </div>
    </div>
  </div>
</template>
