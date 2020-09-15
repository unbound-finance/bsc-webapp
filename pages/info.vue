<template>
  <div class="md:max-w-6xl mx-auto p-4">
    <div class="flex justify-between items-center">
      <nuxt-link to="/">
        <p class="font-medium text-md md:text-xl">Unbound Statistics</p>
      </nuxt-link>
      <ConnectWalletBtn />
    </div>

    <div class="mt-8 w-full grid grid-cols-1 md:grid-cols-3 gap-2">
      <div
        class="w-full border-gray-200 rounded p-4"
        :class="showFees ? '' : 'border'"
      >
        <div class="flex flex-col">
          <p class="font-medium text-sm text-gray-600">Total Liquidity</p>
          <div class="flex items-center justify-between">
            <p class="font-medium text-3xl text-accent">
              ${{ totalLiquidity }}
            </p>
            <!-- <p class="text-sm text-green-500 font-medium">15.36%</p> -->
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
            <p class="font-medium text-3xl text-accent">
              {{ totalMinted }} uDAI
            </p>
            <!-- <p class="text-sm text-green-500 font-medium">8.36%</p> -->
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
            <p class="font-medium text-3xl text-accent">$0</p>

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
                <p class="text-right text-accent font-medium">$0</p>
              </div>
              <div>
                <p class="text-gray-600 font-medium text-sm">SAFU</p>
              </div>
              <div>
                <p class="text-right text-accent font-medium">$0</p>
              </div>
              <div>
                <p class="text-gray-600 font-medium text-sm">Team</p>
              </div>
              <div>
                <p class="text-right text-accent font-medium">$0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <p class="text-gray-900 font-medium text-lg py-4">Transaction History</p>
      <div v-if="ui.loading || !getAddress">Loading...</div>
      <div v-else-if="ui.errorMsg">{{ ui.errorMsg }}</div>
      <t-table
        v-else
        :headers="txTable.headers"
        :data="txTable.data"
        :responsive="true"
        :responsive-breakpoint="520"
      >
        <template slot="row" slot-scope="props">
          <tr :class="props.trClass">
            <td :class="props.tdClass">
              <p>{{ $dayjs(props.row.timestamp).format('DD MMM YYYY') }}</p>
              <span class="text-gray-500">{{
                $dayjs(props.row.timestamp).format('hh:mm:ss a')
              }}</span>
            </td>
            <td :class="props.tdClass">
              {{ props.row.blockNumber }}
            </td>
            <td :class="props.tdClass">
              <a
                class="text-accent"
                :href="`https://kovan.etherscan.io/tx/${props.row.hash}`"
                target="_blank"
                >{{
                  props.row.hash.substring(0, 16) +
                  '...' +
                  props.row.hash.substring(props.row.hash.length - 16)
                }}</a
              >
            </td>
            <td :class="props.tdClass">
              {{
                props.row.smartContractFunction === functions.mint
                  ? 'Mint'
                  : 'Burn'
              }}
            </td>
            <td :class="props.tdClass">
              {{ props.row.amount.toFixed(2) }} uDAI
            </td>
            <td :class="props.tdClass">
              {{
                parseInt(props.row.gasUsed * props.row.gasPrice) /
                1000000000000000000
              }}
              ETH
            </td>
          </tr>
        </template>
      </t-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ethers } from 'ethers'

// import config from '~/configs/config'
import { getPoolTokenReserves } from '~/mixins/stake'
import config from '~/configs/config'
import UnboundDai from '~/configs/abi/UnboundDai'
// const txDecoder = require('ethereum-tx-decoder')
const provider = new ethers.providers.Web3Provider(window.ethereum)

export default {
  layout: 'info',
  data() {
    return {
      ui: {
        loading: false,
        errorMsg: null,
      },
      showFees: false,
      txTable: {
        headers: ['Date', 'Block', 'Txn Hash', 'Type', 'Amount', 'Txn Fees'],
        data: [],
      },
      functions: {
        mint: '0x04bb770d',
        burn: '0x78208601',
      },
      totalLiquidity: '--',
      totalMinted: '--',
      // getAddress: this.$store.getters.getAddress,
    }
  },

  computed: {
    ...mapGetters({
      getAddress: 'getAddress',
    }),
  },

  mounted() {
    this.ui.loading = true
    this.getTotalLiquidity()
    this.getTransactions()
    this.getTotalUDAI()
  },

  methods: {
    async getTransactions() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const url = 'https://api-kovan.etherscan.io/api'
      const params = {
        module: 'account',
        action: 'txlist',
        address,
        startblock: '0',
        endblock: '99999999',
        page: '1',
        offset: '10',
        sort: 'desc',
        apikey: '',
      }
      const result = await this.$axios.get(url, { params })
      if (result.data.status === '0') {
        this.ui.loading = false
        this.ui.errorMsg = result.data.message
      } else {
        this.ui.loading = false
        console.log(result.data.result)
        this.decodeTransaction(result.data.result)
      }
    },

    async decodeTransaction(etherScanData) {
      const tempArray = []

      let i
      for (i = 0; i < etherScanData.length; i++) {
        const transaction = await provider.getTransaction(etherScanData[i].hash)
        const rawFunction = transaction.data.slice(0, 10)
        const value = transaction.data.slice(10, 74)
        const data = {
          blockNumber: etherScanData[i].blockNumber,
          timeStamp: etherScanData[i].blockNumber,
          hash: etherScanData[i].hash,
          gasPrice: etherScanData[i].gasPrice,
          gasUsed: etherScanData[i].gasUsed,
          amount: parseInt('0x' + value) / 1e18,
          smartContractFunction: rawFunction,
        }
        tempArray.push(data)
      }

      console.log(tempArray)

      this.txTable.data = tempArray
    },

    async getTotalLiquidity() {
      const totalLiquidity = await getPoolTokenReserves()
      this.totalLiquidity = (totalLiquidity.reserve1 / 1e18).toFixed(2)
    },

    async getTotalUDAI() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const udai = new ethers.Contract(
        config.contracts.unboundDai,
        UnboundDai,
        signer
      )
      const supply = await udai.totalSupply()
      this.totalMinted = (supply / 1e18).toFixed(2)
    },
  },
}
</script>

<style></style>
