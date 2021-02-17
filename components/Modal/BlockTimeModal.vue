<template>
  <Modal v-model="modal">
    <div class="flex flex-col justify-center px-4 py-8 items-center space-y-4">
      <div class="text-center">
        <p class="text-lg text-gray-800 dark:text-white font-medium">
          Cool Down ❄️
        </p>
        <p class="text-xs text-gray-600 dark:text-gray-700">
          Ruko jara, sabar karo 🖐
        </p>
        <button
          class="w-full px-4 py-2 rounded mt-4 bg-blue-600 bg-opacity-25 text-blue-600 font-medium focus:outline-none"
          @click="modal = false"
        >
          Close
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal'

export default {
  extends: Modal,
}
</script>

<style></style>
