<template>
  <Modal v-model="modal">
    <div class="flex flex-col justify-center px-4 py-8 items-center space-y-4">
      <img src="~/assets/icons/modal/success.svg" width="128" alt="success" />
      <div>
        <p class="text-xl dark:text-white font-medium text-gray-800">
          Transaction Submitted
        </p>
        <a :href="`https://testnet.bscscan.io/tx/${hash}`" target="_blank">
          <p class="text-xs text-center text-accent">View on Bscscan</p>
        </a>
        <button
          class="w-full px-4 py-2 rounded mt-4 bg-dark-primary bg-opacity-25 text-dark-primary font-medium focus:outline-none"
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
  props: {
    hash: String,
  },
}
</script>

<style></style>
