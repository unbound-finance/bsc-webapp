<template>
  <Modal v-model="modal">
    <div class="flex flex-col justify-center px-4 py-8 items-center space-y-4">
      <div class="flex flex-col items-center">
        <img
          v-if="txStatus || (targetBlockNumber > 0 && blocksRemaining > 0)"
          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDc0IDc0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIiBjbGFzcz0iIj48Zz48cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGQ9Im00MS44NDUgMzdjNS4yODkgMy44OCAxMy4wMTggMTAuNjcgMTMuMDE4IDE3LjE2NHY5LjUzNmgtMzUuNzM3di05LjUzYzAtNi40OTQgNy43NC0xMy4yODQgMTMuMDI5LTE3LjE2NC01LjI4OS0zLjg4LTEzLjAyOS0xMC42Ny0xMy4wMjktMTcuMTY0di05LjU0MmgzNS43Mzd2OS41NGMwIDYuNDkyLTcuNzI5IDEzLjI4My0xMy4wMTggMTcuMTZ6IiBmaWxsPSIjZWVlZmVlIiBkYXRhLW9yaWdpbmFsPSIjZWVlZmVlIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJtNDEuODQgMzdjNS4yOSAzLjg4IDEzLjAyIDEwLjY3IDEzLjAyIDE3LjE3djkuNTNoLTN2LTkuNTNjMC02LjUtNy43My0xMy4yOS0xMy4wMi0xNy4xNyA1LjI5LTMuODggMTMuMDItMTAuNjcgMTMuMDItMTcuMTZ2LTkuNTRoM3Y5LjU0YzAgNi40OS03LjczIDEzLjI4LTEzLjAyIDE3LjE2eiIgZmlsbD0iI2UxZTZlOSIgZGF0YS1vcmlnaW5hbD0iI2UxZTZlOSIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZD0ibTI2LjIzIDIxLjIzN3YuNWMwIDUuOTQ2IDEwLjc3IDEyLjMwNiAxMC43NyAxMi4zMDZzMTAuNzctNi4zNiAxMC43Ny0xMi4zMDh2LS41eiIgZmlsbD0iIzMwODFjZSIgZGF0YS1vcmlnaW5hbD0iI2ZlNzA1OCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZD0ibTM3IDM0LjU0M2EuNS41IDAgMCAxIC0uMjU0LS4wNjljLS40NDYtLjI2Ni0xMS4wMTYtNi41NzQtMTEuMDE2LTEyLjczOXYtLjVhLjUuNSAwIDAgMSAuNS0uNWgyMS41NGEuNS41IDAgMCAxIC41LjV2LjVjMCA2LjE2Mi0xMC41NjUgMTIuNDczLTExLjAxNiAxMi43MzlhLjUuNSAwIDAgMSAtLjI1NC4wNjl6bS0xMC4yNy0xMi44MDZjMCA1LjEgOC42NjIgMTAuNzIxIDEwLjI3IDExLjcyIDEuNjA3LTEgMTAuMjY4LTYuNjIgMTAuMjctMTEuNzJ6IiBmaWxsPSIjMzIzYzZiIiBkYXRhLW9yaWdpbmFsPSIjMzIzYzZiIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJtNTkuMzMzIDYuNjVhMy43NzEgMy43NzEgMCAwIDEgLTMuODgyIDMuNjVoLTM2LjlhMy43NzEgMy43NzEgMCAwIDEgLTMuODgyLTMuNjUgMy43NzEgMy43NzEgMCAwIDEgMy44NzktMy42NWgzNi45YTMuNzcxIDMuNzcxIDAgMCAxIDMuODg1IDMuNjV6IiBmaWxsPSIjOTI5N2FiIiBkYXRhLW9yaWdpbmFsPSIjOTI5N2FiIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJtNTkuMzMzIDY3LjM1YTMuNzcxIDMuNzcxIDAgMCAxIC0zLjg4MSAzLjY1aC0zNi45YTMuNzcxIDMuNzcxIDAgMCAxIC0zLjg4Mi0zLjY1IDMuNzcxIDMuNzcxIDAgMCAxIDMuODgyLTMuNjVoMzYuOWEzLjc3MSAzLjc3MSAwIDAgMSAzLjg4MSAzLjY1eiIgZmlsbD0iIzkyOTdhYiIgZGF0YS1vcmlnaW5hbD0iIzkyOTdhYiIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZD0ibTU5LjMzIDYuNjVhMy43NjMgMy43NjMgMCAwIDEgLTMuODggMy42NWgtMy4zMWEzLjc2OSAzLjc2OSAwIDAgMCAzLjg4LTMuNjUgMy43NjkgMy43NjkgMCAwIDAgLTMuODgtMy42NWgzLjMxYTMuNzYzIDMuNzYzIDAgMCAxIDMuODggMy42NXoiIGZpbGw9IiM4NDg3OWMiIGRhdGEtb3JpZ2luYWw9IiM4NDg3OWMiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGQ9Im01OS4zMyA2Ny4zNWEzLjc2MyAzLjc2MyAwIDAgMSAtMy44OCAzLjY1aC0zLjMxYTMuNjU3IDMuNjU3IDAgMSAwIDAtNy4zaDMuMzFhMy43NjMgMy43NjMgMCAwIDEgMy44OCAzLjY1eiIgZmlsbD0iIzg0ODc5YyIgZGF0YS1vcmlnaW5hbD0iIzg0ODc5YyIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZD0ibTIzIDYzLjdoMjh2LTIuODQ3YzAtNy43MzQtMTQtMTYtMTQtMTZzLTE0IDguMjctMTQgMTZ6IiBmaWxsPSIjMzA4MWNlIiBkYXRhLW9yaWdpbmFsPSIjZmU3MDU4IiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJtNTEgNjQuMmgtMjhhLjUuNSAwIDAgMSAtLjUtLjV2LTIuODQ3YzAtNy45MjggMTMuNjY3LTE2LjA5IDE0LjI0OS0xNi40MzRhLjUuNSAwIDAgMSAuNTA4IDBjLjU4Mi4zNDQgMTQuMjQ5IDguNTA2IDE0LjI0OSAxNi40MzR2Mi44NDdhLjUuNSAwIDAgMSAtLjUwNi41em0tMjcuNS0xaDI3di0yLjM0N2MwLTYuOC0xMS42MjQtMTQuMjU4LTEzLjUtMTUuNDE4LTEuODc5IDEuMTY1LTEzLjUgOC42MTktMTMuNSAxNS40MTh6IiBmaWxsPSIjMzIzYzZiIiBkYXRhLW9yaWdpbmFsPSIjMzIzYzZiIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJtMTguMDIyIDI2LjU2M2MuMDguMTQ3LjE3NS4yOTEuMjU4LjQzOCIgZmlsbD0iI2VlZWZlZSIgZGF0YS1vcmlnaW5hbD0iI2VlZWZlZSIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZD0ibTE4LjI4IDI3LjVhLjUuNSAwIDAgMSAtLjQzNC0uMjUxbC0uMS0uMTczYy0uMDU2LS4wOTEtLjExMS0uMTgyLS4xNjEtLjI3NGEuNS41IDAgMCAxIC44NzktLjQ3OGMuMDQyLjA3OC4wODkuMTU0LjEzNi4yMzFsLjExNy4yYS41LjUgMCAwIDEgLS40MzQuNzQ5eiIgZmlsbD0iIzMyM2M2YiIgZGF0YS1vcmlnaW5hbD0iIzMyM2M2YiIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZD0ibTE2LjEyNiAxNy4xNjd2Mi42NzJhMTIuNzg4IDEyLjc4OCAwIDAgMCAuODY2IDQuNDc0IiBmaWxsPSIjZWVlZmVlIiBkYXRhLW9yaWdpbmFsPSIjZWVlZmVlIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJtMTYuOTkyIDI0LjgxM2EuNS41IDAgMCAxIC0uNDY5LS4zMjUgMTMuMzM1IDEzLjMzNSAwIDAgMSAtLjktNC42NDl2LTIuNjcyYS41LjUgMCAwIDEgMSAwdjIuNjcyYTEyLjM0NSAxMi4zNDUgMCAwIDAgLjgzNSA0LjMuNS41IDAgMCAxIC0uNDY5LjY3NXoiIGZpbGw9IiMzMjNjNmIiIGRhdGEtb3JpZ2luYWw9IiMzMjNjNmIiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGQ9Im01My43MDYgNDRjLS4xMjItLjE1OC0uMjUzLS4zMTItLjM4NS0uNDY2IiBmaWxsPSIjZWVlZmVlIiBkYXRhLW9yaWdpbmFsPSIjZWVlZmVlIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJtNTMuNzA2IDQ0LjVhLjUuNSAwIDAgMSAtLjQtLjE5NGMtLjExNy0uMTUxLS4yNDMtLjMtLjM2OS0uNDQ4YS41LjUgMCAxIDEgLjc2LS42NDljLjEzOC4xNi4yNzMuMzIxLjQuNDg1YS41LjUgMCAwIDEgLS40LjgwNnoiIGZpbGw9IiMzMjNjNmIiIGRhdGEtb3JpZ2luYWw9IiMzMjNjNmIiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGQ9Im01Ny43ODYgNTIuOTI0YTE2LjE0NCAxNi4xNDQgMCAwIDAgLTIuNTU3LTYuNzU3IiBmaWxsPSIjZWVlZmVlIiBkYXRhLW9yaWdpbmFsPSIjZWVlZmVlIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+PGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSIjMzIzYzZiIj48cGF0aCBkPSJtNTcuNzg1IDUzLjQyM2EuNS41IDAgMCAxIC0uNS0uNDQ1IDE1LjY2OSAxNS42NjkgMCAwIDAgLTIuNDgyLTYuNTQ1LjUuNSAwIDEgMSAuODQ2LS41MzIgMTYuNjQgMTYuNjQgMCAwIDEgMi42MzEgNi45NjguNS41IDAgMCAxIC0uNDQyLjU1MnoiIGZpbGw9IiMzMjNjNmIiIGRhdGEtb3JpZ2luYWw9IiMzMjNjNmIiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48cGF0aCBkPSJtNTQuODYzIDY0LjJoLTM1LjczN2EuNS41IDAgMCAxIC0uNS0uNXYtOS41M2MwLTYuMyA2Ljc3Mi0xMi43NDIgMTIuNjg5LTE3LjE2NC01LjkxNS00LjQyNi0xMi42ODktMTAuODY2LTEyLjY4OS0xNy4xNjh2LTkuNTM4YS41LjUgMCAwIDEgLjUtLjVoMzUuNzM3YS41LjUgMCAwIDEgLjUuNXY5LjU0YzAgNi4zMDgtNi43NjcgMTIuNzQ1LTEyLjY3OSAxNy4xNjQgNS45MTYgNC40MTcgMTIuNjc5IDEwLjg1NCAxMi42NzkgMTcuMTYzdjkuNTMzYS41LjUgMCAwIDEgLS41LjV6bS0zNS4yMzctMWgzNC43Mzd2LTkuMDNjMC02LjQtOC4wMjgtMTMuMjUtMTIuODE0LTE2Ljc2MWEuNS41IDAgMCAxIDAtLjgwN2M0Ljc4Ni0zLjUxIDEyLjgxNC0xMC4zNTYgMTIuODE0LTE2Ljc2MXYtOS4wNDFoLTM0LjczN3Y5LjA0YzAgNi40IDguMDM1IDEzLjI0NyAxMi44MjUgMTYuNzYxYS41LjUgMCAwIDEgMCAuODA3Yy00Ljc5IDMuNTE0LTEyLjgyNSAxMC4zNjMtMTIuODI1IDE2Ljc2MXoiIGZpbGw9IiMzMjNjNmIiIGRhdGEtb3JpZ2luYWw9IiMzMjNjNmIiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48cGF0aCBkPSJtNTUuNDUxIDEwLjhoLTM2LjlhNC4yNzYgNC4yNzYgMCAwIDEgLTQuMzgyLTQuMTUgNC4yNzYgNC4yNzYgMCAwIDEgNC4zOC00LjE1aDM2LjlhNC4yNzYgNC4yNzYgMCAwIDEgNC4zODIgNC4xNSA0LjI3NiA0LjI3NiAwIDAgMSAtNC4zOCA0LjE1em0tMzYuOS03LjNhMy4yNzUgMy4yNzUgMCAwIDAgLTMuMzgyIDMuMTUgMy4yNzUgMy4yNzUgMCAwIDAgMy4zOCAzLjE1aDM2LjlhMy4yNzUgMy4yNzUgMCAwIDAgMy4zODItMy4xNSAzLjI3NSAzLjI3NSAwIDAgMCAtMy4zOC0zLjE1eiIgZmlsbD0iIzMyM2M2YiIgZGF0YS1vcmlnaW5hbD0iIzMyM2M2YiIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjxwYXRoIGQ9Im01NS40NTEgNzEuNWgtMzYuOWE0LjE1NiA0LjE1NiAwIDEgMSAwLTguM2gzNi45YTQuMTU2IDQuMTU2IDAgMSAxIDAgOC4zem0tMzYuOS03LjNhMy4xNTggMy4xNTggMCAxIDAgMCA2LjNoMzYuOWEzLjE1OCAzLjE1OCAwIDEgMCAwLTYuM3oiIGZpbGw9IiMzMjNjNmIiIGRhdGEtb3JpZ2luYWw9IiMzMjNjNmIiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg=="
          width="72"
          class="spin-clock mb-4"
        />
        <p class="text-xl dark:text-white font-medium text-gray-800">
          Cool Down
        </p>
        <p
          v-if="targetBlockNumber > 0 && blocksRemaining > 0"
          class="text-gray-600 dark:text-gray-700 text-xs py-1"
        >
          please wait for
          <span class="font-medium text-blue-600">{{ blocksRemaining }}</span>
          more blocks.
        </p>
        <p
          v-if="!txStatus && blocksRemaining && blocksRemaining <= 0"
          class="text-gray-600 dark:text-gray-700 text-xs py-1 pt-4"
        >
          You can now mint or unlock 🎉
        </p>
        <a
          class="text-blue-600 text-xs"
          href="https://docs.unbound.finance/block-limit-lock-mechanism-a-security-layer"
          target="_blank"
          >Learn More</a
        >

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
}
</script>

<style>
.spin-clock {
  animation: spin 2.5s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
