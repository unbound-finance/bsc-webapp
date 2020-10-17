<template>
  <Modal v-model="modal">
    <div class="flex flex-col justify-center py-4 items-center space-y-4">
      <img
        src="~/assets/loader.svg"
        width="72"
        class="animateLoader"
        alt="success"
      />
      <div class="pt-4">
        <p class="text-xl dark:text-white font-medium text-gray-700">
          Waiting For Confirmation
        </p>
        <p class="text-xs text-center text-gray-500 dark:text-gray-700">
          Confirm this transaction in your wallet.
        </p>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal'
export default {
  props: {
    hash: String,
  },
  extends: Modal,
}
</script>

<style>
.animateLoader {
  animation: 2s linear 0s infinite normal none rotateIt;
}

@keyframes rotateIt {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
