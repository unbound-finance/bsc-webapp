<template>
  <div class="bg-white md:max-w-6xl mx-auto p-4">
    <div class="flex justify-between items-center">
      <p class="font-medium text-md md:text-xl">Unbound Statistics</p>
    </div>

    <div class="mt-8 w-full grid grid-cols-1 md:grid-cols-3 gap-2">
      <div
        class="w-full border-gray-200 rounded p-4"
        :class="showFees ? '' : 'border'"
      >
        <div class="flex flex-col">
          <p class="font-medium text-sm text-gray-600">Total Liquidity</p>
          <div class="flex items-center justify-between">
            <p class="font-medium text-3xl text-accent">$100.5m</p>
            <p class="text-sm text-green-500 font-medium">15.36%</p>
          </div>
        </div>
      </div>
      <div
        class="w-full border-gray-200 rounded p-4"
        :class="showFees ? '' : 'border'"
      >
        <div class="flex flex-col">
          <p class="font-medium text-sm text-gray-600">Total uDAI Minted</p>
          <div class="flex items-center justify-between">
            <p class="font-medium text-3xl text-accent">$400.5m</p>
            <p class="text-sm text-green-500 font-medium">8.36%</p>
          </div>
        </div>
      </div>
      <div
        class="w-full border-gray-200 rounded p-4 cursor-pointer"
        :class="showFees ? 'shadow-xl rounded-lg' : 'border'"
        @click="showFees = !showFees"
      >
        <div class="flex flex-col">
          <p class="font-medium text-sm text-gray-600">Total Fees</p>
          <div class="flex items-center justify-between">
            <p class="font-medium text-3xl text-accent">$8.5m</p>

            <button class="focus:outline-none">
              <i
                class="fas text-gray-600 px-4"
                :class="showFees ? 'fa-chevron-up' : 'fa-chevron-down'"
              ></i>
            </button>
          </div>

          <div v-if="showFees" class="transition-all duration-200">
            <div class="mt-4 border-b border-gray-200 w-full"></div>
            <div class="mt-4 grid grid-cols-2 px-2">
              <div>
                <p class="text-gray-600 font-medium text-sm">
                  Liquidity Providers
                </p>
              </div>
              <div>
                <p class="text-right text-accent font-medium">$3.4m</p>
              </div>
              <div>
                <p class="text-gray-600 font-medium text-sm">SAFU</p>
              </div>
              <div>
                <p class="text-right text-accent font-medium">$3.4m</p>
              </div>
              <div>
                <p class="text-gray-600 font-medium text-sm">Team</p>
              </div>
              <div>
                <p class="text-right text-accent font-medium">$1.7m</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <p class="text-gray-900 font-medium text-lg py-4">Transaction History</p>
      <t-table
        :headers="txTable.headers"
        :data="txTable.data"
        :responsive="true"
        :responsive-breakpoint="520"
      >
        <template slot="row" slot-scope="props">
          <tr :class="props.trClass">
            <td :class="props.tdClass">
              {{ props.row.timeStamp }}
            </td>
            <td :class="props.tdClass">
              <a
                class="text-accent"
                :href="`https://kovan.etherscan.io/tx/${props.row.hash}`"
                target="_blank"
                >{{
                  props.row.hash.substring(0, 8) +
                  '...' +
                  props.row.hash.substring(props.row.hash.length - 8)
                }}</a
              >
            </td>
            <td :class="props.tdClass">
              {{ props.row.value }}
            </td>
            <td :class="props.tdClass">
              {{
                parseInt(props.row.gasUsed * props.row.gasPrice) /
                1000000000000000000
              }}
              Eth
            </td>
          </tr>
        </template>
      </t-table>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'info',
  data() {
    return {
      showFees: false,
      txTable: {
        headers: ['Date', 'Txn Hash', 'Amount', 'Txn Fees'],
        data: [],
      },
    }
  },

  mounted() {
    this.getTransactions()
  },

  methods: {
    async getTransactions() {
      const address = await this.$store.state.address
      console.log(address)
      const url = `https://api-kovan.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=YourApiKeyToken`

      const result = await this.$axios.get(url)
      this.txTable.data = result.data.result
    },
  },
}
</script>

<style></style>
