<template>
  <Modal v-model="modal">
    <div class="flex flex-col justify-center px-4 py-8 items-center space-y-4">
      <!-- <img
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgaWQ9IlNvbGlkIj48cGF0aCBkPSJNMjU2LDM1MmMtMy4yNTIsOS45MTgtMTQuOTcsMTguNzI1LTMyLjcxMSwyNC4yNDYtNDUuMDU0LDE0LjAyLTcyLjkyOCwzNC4wMi03OC4zMjYsNTUuNzU0SDM2Ny4wMzdjLTUuNC0yMS43MzQtMzMuMjcyLTQxLjczNC03OC4zMjYtNTUuNzU0QzI3MC45NywzNzAuNzI1LDI1OS4yNTIsMzYxLjkxOCwyNTYsMzUyWiIgZmlsbD0iIzMxODJjZSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjxwYXRoIGQ9Ik0xNjAuMSwxMjhjMTMuNDMsMjUuNTgsMzQuOTMsNDguNDgsNjMuMTksNjYuNTVBNzIuNTI1LDcyLjUyNSwwLDAsMSwyNTYsMjQ0LjM2YTcyLjUyNSw3Mi41MjUsMCwwLDEsMzIuNzEtNDkuODFjMjguMjYtMTguMDcsNDkuNzYtNDAuOTcsNjMuMTktNjYuNTVaIiBmaWxsPSIjMzE4MmNlIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+PHBhdGggZD0iTTMwNS45NDksMjIxLjUwN0MzNjMuMjA2LDE4NC45LDQwMCwxMjcuOTU5LDQwMCw2NGgwYTE2LDE2LDAsMCwwLDE2LTE2VjI0SDk2VjQ3YTE2Ljk4NSwxNi45ODUsMCwwLDAsMTYsMTYuOTQ5VjY0YzAsNjMuOTU5LDM2Ljc5NCwxMjAuOSw5NC4wNTEsMTU3LjUwNywyNS4xNTksMTYuMDg2LDI1LjE1OSw1Mi45LDAsNjguOTg2QzE0OC43OTQsMzI3LjEsMTEyLDM4NC4wNDEsMTEyLDQ0OHYuMDUxQTE2Ljk4NSwxNi45ODUsMCwwLDAsOTYsNDY1djIzSDQxNlY0NjRhMTYsMTYsMCwwLDAtMTYtMTZoMGMwLTYzLjk1OS0zNi43OTQtMTIwLjktOTQuMDUxLTE1Ny41MDdDMjgwLjc5LDI3NC40MDcsMjgwLjc5LDIzNy41OTMsMzA1Ljk0OSwyMjEuNTA3Wk0yNzEuMDgsMjU2YTU2LjY4LDU2LjY4LDAsMCwwLDI2LjI1LDQ3Ljk3M0MzNTIuNDEsMzM5LjE4OCwzODQsMzkxLjY4NSwzODQsNDQ4SDEyOGMwLTU2LjMxNSwzMS41OS0xMDguODEyLDg2LjY3LTE0NC4wMjdhNTYuOTYxLDU2Ljk2MSwwLDAsMCwwLTk1Ljk0NkMxNTkuNTksMTcyLjgxMiwxMjgsMTIwLjMxNSwxMjgsNjRIMzg0YzAsNTYuMzE1LTMxLjU5LDEwOC44MTItODYuNjcsMTQ0LjAyN0E1Ni42OCw1Ni42OCwwLDAsMCwyNzEuMDgsMjU2WiIgZmlsbD0iIzMxODJjZSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjxwYXRoIGQ9Ik0yNTYsMjg3LjQ4N2E3LjUsNy41LDAsMCwwLDcuNS03LjVWMjcyYTcuNSw3LjUsMCwwLDAtMTUsMHY3Ljk4N0E3LjUsNy41LDAsMCwwLDI1NiwyODcuNDg3WiIgZmlsbD0iIzMxODJjZSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjxwYXRoIGQ9Ik0yNDguNSwzMTkuOTg3YTcuNSw3LjUsMCwxLDAsMTUsMFYzMTJhNy41LDcuNSwwLDAsMC0xNSwwWiIgZmlsbD0iIzMxODJjZSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+"
        width="48"
      /> -->
      <!-- <img src="~/assets/icons/modal/success.svg" width="128" alt="success" /> -->
      <div class="text-center">
        <p class="text-xl dark:text-white font-medium text-gray-800">
          Cool Down
        </p>
        <p
          v-if="targetBlockNumber > 0 && blocksRemaining > 0"
          class="text-gray-600 dark:text-gray-700 text-xs py-1"
        >
          please wait for
          <span class="font-medium text-blue-600">{{ blocksRemaining }}</span>
          more blocks
        </p>
        <p
          v-if="
            !txStatus &&
            blocksRemaining &&
            (blocksRemaining == 0 || blocksRemaining < 0)
          "
          class="text-gray-600 dark:text-gray-700 text-xs py-1"
        >
          You can now mint or unlock 🎉
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
  props: {
    targetBlockNumber: {
      type: [String, Number],
      default: 0,
    },
  },
  computed: {
    txStatus() {
      return this.$store.state.localStorage.txStatus
    },
    blocksRemaining() {
      return (
        Number(this.targetBlockNumber) - Number(this.$store.state.currentBlock)
      )
    },
  },
  // mounted() {
  //   this.getCurrentBlock()
  // },
  // methods: {
  //   getCurrentBlock() {
  //     getRealtimeCurrentBlock.bind(this)()
  //   },
  // },
}
</script>
