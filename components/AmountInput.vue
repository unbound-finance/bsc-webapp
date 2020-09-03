<template>
  <div
    class="w-full p-2 px-4 border border-gray-200 dark:border-gray-700 rounded-lg"
  >
    <div class="flex items-center justify-between">
      <p class="text-sm text-gray-700 font-medium">Supply</p>
      <p v-if="selectedPoolToken" class="text-gray-600 text-sm">
        Balance: {{ balance }}
      </p>
    </div>
    <form class="w-full max-w-sm">
      <div class="flex items-center py-2">
        <input
          class="appearance-none bg-transparent text-2xl text-gray-800 dark:text-gray-300 font-medium w-full mr-3 py-1 leading-tight focus:outline-none"
          type="number"
          placeholder="0.0"
          :disabled="disabled"
          @input="$emit('input', $event.target.value)"
        />

        <button
          v-if="!isTokenApproved && selectedPoolToken"
          type="button"
          class="px-2 py-1 mx-2 text-sm rounded border border-light-primary dark:border-dark-primary bg-opacity-25 text-light-primary dark:text-white focus:outline-none"
          @click="$emit('approve')"
        >
          Approve
        </button>

        <button
          v-else-if="showMaxButton"
          type="button"
          class="px-2 py-1 mx-2 text-sm rounded border border-light-primary dark:border-dark-primary bg-opacity-25 text-light-primary dark:text-white focus:outline-none"
          @click="setInputMax"
        >
          Max
        </button>
        <button
          class="flex-shrink-0 text-light-primary dark:text-white bg-light-primary dark:bg-dark-primary bg-opacity-25 hover:bg-opacity-100 hover:text-white transition-all duration-200 text-sm font-medium py-1 px-4 rounded flex items-center space-x-2 focus:outline-none"
          type="button"
          @click="$emit('button-click')"
        >
          <span>{{ buttonText }}</span>
          <i class="fas fa-chevron-down pt-1"></i>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Label',
    },
    buttonText: {
      type: String,
      default: 'SeletButtonText',
    },
    showMaxButton: {
      type: Boolean,
      default: false,
    },
    showApproveButton: {
      type: Boolean,
      default: false,
    },
    balance: {
      type: String,
      default: '100',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
