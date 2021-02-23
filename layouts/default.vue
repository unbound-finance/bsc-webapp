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
import { getProvider } from '~/plugins/web3provider'

export default {
  components: { Navbar },
  computed: {
    currentBlock() {
      return this.$store.state.currentBlock
    },
    txStatus() {
      return this.$store.state.localStorage.txStatus
    },
  },
  watch: {
    txStatus(e) {
      if (e) this.removeConfirmedTx(e.txHash)
    },
  },
  mounted() {
    this.getCurrentBlock()
    if (this.txStatus) {
      this.removeConfirmedTx(this.txStatus.txHash)
    }
  },
  methods: {
    getCurrentBlock() {
      getRealtimeCurrentBlock.bind(this)()
    },
    removeConfirmedTx(hash) {
      if (hash) {
        console.log('hash provided')
        const { PROVIDER } = getProvider()
        PROVIDER.waitForTransaction(hash, 5).then((tx) => {
          this.$store.commit('localStorage/SET_TX_STATUS', null)
        })
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
