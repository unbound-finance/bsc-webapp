<template>
  <div class="flex flex-col items-center space-y-2">
    <div class="w-full md:w-2/5 bg-white dark:bg-dark-bg rounded-lg my-4 p-4">
      <p class="text-gray-600 text-sm font-medium">Your unclaimed UNB</p>
      <div class="flex items-center justify-between">
        <p
          class="text-4xl font-medium font-mono text-gray-800 dark:text-gray-200"
        >
          0.0000
        </p>
        <div>
          <button
            class="flex items-center rounded-lg p-2 px-4 bg-dark-primary bg-opacity-25 text-accent font-medium focus:outline-none"
          >
            ⚡ claim
          </button>
        </div>
      </div>
    </div>
    <div class="w-full md:w-2/5 bg-white dark:bg-dark-bg rounded-lg my-4 p-4">
      <p class="text-gray-600 text-sm font-medium">Your unclaimed UNI</p>
      <div class="flex items-center justify-between">
        <p
          class="text-4xl font-medium font-mono text-gray-800 dark:text-gray-200"
        >
          0.0000
        </p>
        <div>
          <button
            class="flex items-center rounded-lg p-2 px-4 bg-dark-primary bg-opacity-25 text-accent font-medium focus:outline-none"
          >
            ⚡ claim
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'claim',
}
</script>

<style></style>
