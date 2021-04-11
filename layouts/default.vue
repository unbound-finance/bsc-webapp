<template>
  <div class="w-full min-h-screen">
    <Navbar />

    <div class="max-w-6xl mx-auto">
      <div class="w-full flex justify-center px-4">
        <nuxt />
      </div>
    </div>

    <div class="fixed" style="bottom: 0.5rem; right: 1rem">
      <div class="flex space-x-1 items-center">
        <a
          :href="`https://kovan.etherscan.io/block/${currentBlock}`"
          target="_blank"
        >
          <span class="text-xs text-green-500 dark:text-green-600 font-mono">{{
            currentBlock
          }}</span>
        </a>
        <div
          class="w-2 h-2 rounded-full bg-green-500 dark:bg-green-600"
          style="margin-top: 2px"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import { getRealtimeCurrentBlock } from '~/utils'

export default {
  components: { Navbar },
  computed: {
    currentBlock() {
      return this.$store.state.currentBlock
    },
  },
  watch: {
    currentBlock() {
      this.removeTxStatus()
    },
  },
  mounted() {
    this.getCurrentBlock()
    this.removeTxStatus()
  },
  methods: {
    getCurrentBlock() {
      getRealtimeCurrentBlock.bind(this)()
    },
    removeTxStatus() {
      const txStatus = JSON.parse(localStorage.getItem('txStatus'))
      if (txStatus) {
        if (this.currentBlock >= txStatus.targetBlock) {
          localStorage.removeItem('txStatus')
        }
      }
    },
  },
}
</script>

<style lang="scss">
.light-mode {
  // $g-color-1: #ffe7d6;
  // $g-color-2: #f2f7ff;

  $g-color-1: #26bcb424;
  $g-color-2: #ffffff;

  background: radial-gradient($g-color-1, $g-color-2);
}

.dark-mode {
  $g-color-1: #2b3546;
  $g-color-2: #2c2f36;

  background: radial-gradient($g-color-1, $g-color-2);

  .bottom-container {
    background: rgba(0, 0, 0, 0.1);
  }

  .main_container {
    background: rgb(33, 36, 41);
  }
}
</style>
