<template>
  <div>
    <div class="flex flex-col items-center w-full py-8 space-y-6 px-4">
      <div class="flex w-full items-center justify-between">
        <nuxt-link to="/">
          <button class="focus:outline-none">
            <i
              class="fas fa-chevron-left text-gray-900 dark:text-white text-lg"
            ></i>
          </button>
        </nuxt-link>
        <p class="text-center font-medium dark:text-white text-lg">Mint</p>
        <button class="focus:outline-none">
          <i class="far fa-question-circle text-gray-600 text-lg"></i>
        </button>
      </div>

      <div
        class="w-full p-2 px-4 border border-gray-200 dark:border-gray-700 rounded-lg"
      >
        <p class="text-sm text-gray-700 font-medium">Supply</p>
        <form class="w-full max-w-sm">
          <div class="flex items-center py-2">
            <input
              class="appearance-none bg-transparent text-2xl text-gray-800 dark:text-gray-300 font-medium w-full mr-3 py-1 leading-tight focus:outline-none"
              type="number"
              placeholder="0.0"
            />
            <button
              class="flex-shrink-0 text-light-primary dark:text-white bg-light-primary dark:bg-dark-primary bg-opacity-25 hover:bg-opacity-100 hover:text-white transition-all duration-200 text-sm font-medium py-1 px-4 rounded flex items-center space-x-2 focus:outline-none"
              type="button"
              @click="ui.showDialog = !ui.showDialog"
            >
              <span>Select Token</span>
              <i class="fas fa-chevron-down pt-1"></i>
            </button>
          </div>
        </form>
      </div>

      <i class="fas fa-arrow-down text-gray-800 dark:text-gray-600"></i>

      <div
        class="w-full p-2 px-4 border border-gray-200 dark:border-gray-700 rounded-lg"
      >
        <p class="text-sm text-gray-700 font-medium">Mint</p>
        <form class="w-full max-w-sm">
          <div class="flex items-center py-2">
            <input
              class="appearance-none bg-transparent text-2xl text-gray-800 dark:text-gray-300 font-medium w-full mr-3 py-1 leading-tight focus:outline-none"
              type="number"
              placeholder="0.0"
            />
            <button
              class="flex-shrink-0 text-light-primary dark:text-white bg-light-primary dark:bg-dark-primary bg-opacity-25 hover:bg-opacity-100 hover:text-white transition-all duration-200 text-sm font-medium py-1 px-4 rounded flex items-center space-x-2 focus:outline-none"
              type="button"
              @click="ui.showDialog = !ui.showDialog"
            >
              <span>Select Token</span>
              <i class="fas fa-chevron-down pt-1"></i>
            </button>
          </div>
        </form>
      </div>

      <button
        class="bg-light-primary text-light-primary font-medium dark:bg-dark-primary bg-opacity-25 dark:text-white w-full py-2 rounded-md focus:outline-none"
      >
        Mint
      </button>
    </div>
    <Modal :show="ui.showDialog" @close="ui.showDialog = false">
      <template>
        <div class="flex flex-col space-y-4">
          <div class="flex justify-between items-center">
            <p class="font-medium dark:text-white">Select Token</p>
            <button
              type="button"
              class="focus:outline-none"
              @click="ui.showDialog = false"
            >
              <i class="fas fa-times text-gray-900 dark:text-gray-500"></i>
            </button>
          </div>

          <div
            class="h-24 w-24 border border-gray-300 dark:border-gray-700 p-4 rounded-md flex flex-col items-center justify-center hover:shadow-md cursor-pointer"
          >
            <img src="~/assets/icons/crypto/dai.svg" width="40" alt="Dai" />
            <p class="font-medium text-center pt-2 dark:text-white">Dai</p>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/_app/Modal'
export default {
  components: { Modal },
  data() {
    return {
      ui: {
        showDialog: false,
      },
    }
  },
}
</script>

<style></style>
