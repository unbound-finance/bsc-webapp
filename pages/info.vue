<template>
  <div class="md:max-w-6xl mx-auto p-4">
    <div class="flex justify-between items-center">
      <nuxt-link to="/">
        <p class="font-medium text-md md:text-xl dark:text-gray-200">
          Unbound Statistics
        </p>
      </nuxt-link>
      <div class="flex items-center space-x-4">
        <ConnectWalletBtn />

        <button
          class="p-3 rounded bg-gray-300 focus:outline-none"
          @click="toggleMode"
        >
          <img
            class="text-light-primary"
            :src="
              require(`~/assets/icons/${
                this.$colorMode.value === 'light' ? 'moon' : 'sun'
              }.svg`)
            "
            width="18"
            alt="mode"
          />
        </button>
      </div>
    </div>

    <div class="mt-8 w-full grid grid-cols-1 md:grid-cols-3 gap-2">
      <div
        class="w-full border-gray-200 dark:border-gray-800 rounded p-4"
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
        class="w-full border-gray-200 dark:border-gray-800 rounded p-4"
        :class="showFees ? '' : 'border'"
      >
        <div class="flex flex-col">
          <p class="font-medium text-sm text-gray-600">Total UBD Minted</p>
          <div class="flex items-center justify-between">
            <p class="font-medium text-3xl text-accent">
              {{ totalMinted }} UND
            </p>
            <!-- <p class="text-sm text-green-500 font-medium">8.36%</p> -->
          </div>
        </div>
      </div>
      <div
        class="w-full border-gray-200 dark:border-gray-800 rounded p-4 cursor-pointer"
        :class="showFees ? 'shadow-xl rounded-lg' : 'border'"
        @click="showFees = !showFees"
      >
        <div class="flex flex-col">
          <p class="font-medium text-sm text-gray-600">Total Fees</p>
          <div class="flex items-center justify-between">
            <p class="font-medium text-3xl text-accent">
              $
              {{
                (
                  parseFloat(collectedFees.safu) +
                  parseFloat(collectedFees.team)
                ).toFixed(3)
              }}
            </p>

            <button class="focus:outline-none">
              <i
                class="fas text-gray-600 px-4"
                :class="showFees ? 'fa-chevron-up' : 'fa-chevron-down'"
              ></i>
            </button>
          </div>

          <div v-if="showFees" class="transition-all duration-200">
            <div
              class="mt-4 border-b border-gray-200 dark:border-gray-800 w-full"
            ></div>
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
                <p class="text-right text-accent font-medium">
                  ${{ collectedFees.safu }}
                </p>
              </div>
              <div>
                <p class="text-gray-600 font-medium text-sm">Team</p>
              </div>
              <div>
                <p class="text-right text-accent font-medium">
                  ${{ collectedFees.team }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <div class="w-full flex items-center justify-between">
        <p class="text-gray-900 dark:text-gray-200 font-medium text-lg py-4">
          Transaction History
        </p>
        <div v-if="!ui.loading" class="flex items-center space-x-4">
          <button
            class="focus:outline-none"
            type="button"
            :disabled="ui.page === 1 ? true : false"
            @click="prevPage"
          >
            <i
              class="fas fa-arrow-left text-sm"
              :class="
                ui.page == 1
                  ? 'text-gray-500 dark:text-gray-700 cursor-not-allowed'
                  : 'text-accent'
              "
            ></i>
          </button>
          <span class="text-sm dark:text-gray-600">Page {{ ui.page }}</span>
          <button
            class="focus:outline-none text-accent"
            type="button"
            @click="nextPage"
          >
            <i class="fas fa-arrow-right text-sm"></i>
          </button>
        </div>
      </div>
      <div v-if="ui.loading || !getAddress" class="dark:text-gray-600">
        Loading...
      </div>
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
              <p>
                {{ $dayjs.unix(props.row.timeStamp).format('DD MMM YYYY') }}
              </p>
              <span class="text-gray-500 dark:text-gray-700">{{
                $dayjs.unix(props.row.timeStamp).format('hh:mm:ss a')
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
              {{ props.row.amount.toFixed(2) }} UND
            </td>
            <td :class="props.tdClass">
              {{ parseInt(props.row.gasUsed * props.row.gasPrice) / 1e18 }}
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
        page: 1,
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
      collectedFees: {
        safu: '',
        team: '',
      },
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
    this.getTotalUBD()
    this.getCollectedFees()
  },

  methods: {
    toggleMode() {
      this.$colorMode.preference =
        this.$colorMode.value === 'light' ? 'dark' : 'light'
    },
    nextPage() {
      this.ui.page++
      this.getTransactions()
    },

    prevPage() {
      this.ui.page--
      this.getTransactions()
    },

    async getCollectedFees() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const UBD = new ethers.Contract(
        config.contracts.unboundDai,
        UnboundDai,
        signer
      )
      const safu = await UBD.balanceOf(config.safuFund)
      const team = await UBD.balanceOf(config.devFund)
      this.collectedFees.safu = (safu.toString() / 1e18).toFixed(3)
      this.collectedFees.team = (team.toString() / 1e18).toFixed(3)
    },

    async getTransactions() {
      this.ui.errorMsg = null
      this.ui.loading = true

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
        page: this.ui.page,
        offset: '10',
        sort: 'desc',
        apikey: 'HUWMR5VJHDQ7EEZYEUWQAAHBNMURE1R1CH',
      }
      const result = await this.$axios.get(url, { params })
      if (result.data.status === '0') {
        this.ui.loading = false
        this.ui.errorMsg = result.data.message
      } else {
        await this.decodeTransaction(result.data.result)
        this.ui.loading = false
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
          timeStamp: etherScanData[i].timeStamp,
          hash: etherScanData[i].hash,
          gasPrice: etherScanData[i].gasPrice,
          gasUsed: etherScanData[i].gasUsed,
          amount: parseInt('0x' + value) / 1e18,
          smartContractFunction: rawFunction,
        }
        tempArray.push(data)
      }
      this.txTable.data = tempArray
    },

    async getTotalLiquidity() {
      const totalLiquidity = await getPoolTokenReserves()
      this.totalLiquidity = (totalLiquidity.reserve1 / 1e18).toFixed(2)
    },

    async getTotalUBD() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const UBD = new ethers.Contract(
        config.contracts.unboundDai,
        UnboundDai,
        signer
      )
      const supply = await UBD.totalSupply()
      this.totalMinted = (supply / 1e18).toFixed(2)
    },
  },
}
</script>

<style></style>
