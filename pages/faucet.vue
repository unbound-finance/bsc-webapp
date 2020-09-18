<template>
  <div class="max-w-4xl mx-auto p-8">
    <p class="text-2xl text-accent font-medium p-2 text-center">
      unbound faucet
    </p>
    <div class="rounded-lg w-full p-8 mt-8 bg-gray-200 dark:bg-gray-800">
      <div v-if="isAuthenticated">
        <p class="dark:text-white">
          This faucet allows you to request test dai and test eth once every
          24h.
        </p>
        <div class="flex flex-wrap items-center my-3 space-x-4">
          <input
            class="appearance-none block w-full md:w-1/2 bg-white dark:bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
            type="text"
            placeholder="Your Kovan Address..."
          />
          <button
            class="py-2 px-6 mt-2 md:mt-0 bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800 rounded-sm focus:outline-none"
          >
            Send me tokens
          </button>
        </div>
      </div>
      <div v-else>
        <p class="dark:text-white">
          This faucet allows you to request test dai and test eth on kovan
          testnet. <br />A Github account is required to request test tokens.
        </p>
        <button
          class="py-2 px-6 bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800 mt-8 font-medium rounded-sm focus:outline-none"
        >
          Login with Github
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'info',
  data() {
    return {
      isAuthenticated: false,
    }
  },
}
</script>

<style></style>
