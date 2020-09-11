<template>
  <Modal :show="show">
    <template>
      <div class="flex flex-col justify-center py-4 items-center space-y-4">
        <img src="~/assets/icons/modal/failed.svg" width="64" alt="success" />
        <div>
          <p class="text-red-600 font-medium">Transaction Rejected</p>

          <button
            class="w-full px-4 py-2 rounded mt-4 bg-red-600 dark:bg-dark-primary dark:text-white bg-opacity-25 text-red-600 font-medium focus:outline-none"
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
