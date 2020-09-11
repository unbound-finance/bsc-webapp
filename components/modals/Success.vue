<template>
  <Modal :show="show">
    <template>
      <div class="flex flex-col justify-center py-4 items-center space-y-4">
        <img src="~/assets/icons/modal/success.svg" width="128" alt="success" />
        <div>
          <p class="text-xl dark:text-white font-medium text-gray-800">
            Transaction Successful
          </p>
          <a href="">
            <p class="text-xs text-center text-accent">View on Etherscan</p>
          </a>
          <button
            class="w-full px-4 py-2 rounded mt-4 bg-dark-primary bg-opacity-25 text-dark-primary font-medium focus:outline-none"
            @click="show = false"
          >
            Close
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from '@/components/_app/Modal'

export default {
  components: { Modal },
  props: {
    show: Boolean,
  },
}
</script>

<style></style>
