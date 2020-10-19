<template>
  <div>
    <form @submit.prevent="calculate">
      <div class="space-y-1">
        <label class="block text-sm leading-5 font-medium text-gray-700 p-1">
          Select Pair
        </label>
        <div class="relative">
          <span class="inline-block w-full rounded-md">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded="true"
              aria-labelledby="listbox-label"
              class="cursor-default relative w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:text-white dark:bg-dark-bg pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
              @click="ui.dropModal = !ui.dropModal"
            >
              <div class="flex items-center space-x-3">
                <double-logo
                  :token0logo="selectedPair.currencyOneLogo"
                  :token1logo="selectedPair.currencyTwoLogo"
                />
                <span class="block truncate"> {{ selectedPair.name }} </span>
              </div>
              <span
                class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
              >
                <svg
                  class="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </button>
          </span>

          <div
            v-if="ui.dropModal"
            class="absolute mt-1 w-full rounded-md bg-white dark:bg-dark-bg dark:text-white shadow-lg"
          >
            <ul
              tabindex="-1"
              role="listbox"
              aria-labelledby="listbox-label"
              aria-activedescendant="listbox-item-3"
              class="max-h-56 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
            >
              <li
                v-for="pair in pairs"
                id="listbox-item-0"
                :key="pair.address"
                role="option"
                class="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-accent hover:text-white"
                @click="selectPair(pair)"
              >
                <div class="flex items-center space-x-3">
                  <double-logo
                    :token0logo="pair.currencyOneLogo"
                    :token1logo="pair.currencyTwoLogo"
                  />
                  <span class="font-normal block truncate dark:text-white"
                    >{{ pair.name }}
                  </span>
                </div>
              </li>

              <!-- More options... -->
            </ul>
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-4 mt-4">
        <div>
          <label class="block text-sm leading-5 font-medium text-gray-700 p-1">
            LTV (%)
          </label>
          <input
            v-model="calcData.ltv"
            class="appearance-none block w-full dark:bg-dark-bg text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:border-gray-500"
            type="text"
            placeholder="Enter LTV (Eg. 30)"
            required
          />
        </div>
        <div>
          <label class="block text-sm leading-5 font-medium text-gray-700 p-1">
            Duration (days)
          </label>
          <input
            v-model="calcData.days"
            class="appearance-none block w-full dark:bg-dark-bg text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:border-gray-500"
            type="text"
            placeholder="Enter Days (Eg. 30)"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        class="rounded-md text-light-primary dark:text-dark-primary bg-light-primary bg-opacity-25 text-sm w-full py-2 font-medium mt-4 focus:outline-none"
      >
        <loader v-if="ui.loading" />
        <span v-else>Calculate</span>
      </button>
    </form>

    <div v-if="calcResult" class="mt-4">
      <!-- <p class="text-sm font-medium">
        {{
          calcResult.liquidate
            ? 'Your position will get liquidate 😔'
            : 'Great! Your position will not get liquidate 😃'
        }}
      </p> -->
      <div class="flex items-center justify-between mt-4">
        <p class="text-sm text-gray-600">
          Current {{ selectedPair.asset }} Price
        </p>
        <p class="text-sm font-medium dark:text-white">
          $
          {{ Number(calcResult.assetValue).toFixed(2) }}
        </p>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-600">
          {{ selectedPair.asset }} Break Even Price
        </p>
        <p class="text-sm font-medium dark:text-white">
          $
          {{ Number(calcResult.breakEvenPrice).toFixed(2) }}
        </p>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-600">
          Fees Earned per {{ selectedPair.asset }}
        </p>
        <p class="text-sm font-medium dark:text-white">
          $
          {{
            (
              calcResult.breakEvenPrice - calcResult.breakEvenPriceWithFees
            ).toFixed(2)
          }}
        </p>
      </div>

      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-600">Net Break Even Price</p>
        <p class="text-sm font-medium dark:text-white">
          $
          {{ calcResult.breakEvenPriceWithFees.toFixed(4) }}
        </p>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-600">Net Break Even Price Percentage</p>
        <p class="text-sm font-medium dark:text-white">
          -
          {{
            100 -
            (
              (parseFloat(calcResult.breakEvenPriceWithFees) /
                parseFloat(calcResult.assetValue)) *
              100
            ).toFixed(4)
          }}%
        </p>
      </div>
      <!-- <div class="flex items-center justify-between">
        <p class="text-sm text-gray-600">Total Pool Value</p>
        <p class="text-sm font-medium">
          $
          {{ Number(calcResult.totalPoolValue / 1e18).toFixed(4) }}
        </p>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-600">Total Fees Earned</p>
        <p class="text-sm font-medium">
          $
          {{ Number(calcResult.totalFees).toFixed(4) * 2 }}
        </p>
      </div> -->
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import pairs from '../configs/pairs'
export default {
  data() {
    return {
      ui: {
        dropModal: false,
        loading: false,
      },
      pairs,
      selectedPair: {
        name: 'USDC-ETH',
        exchange: 'Uniswap',
        address: '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc',
        currencyOneLogo:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
        currencyTwoLogo: 'https://uniswap.info/static/media/eth.73dabb37.png',
        stablecoin: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        assetAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        asset: 'ETH',
      },
      calcData: {
        lossPercentage: '',
        days: '',
        ltv: '',
      },
      calcResult: null,
    }
  },

  watch: {
    selectedPair(a) {
      this.calcResult = null
    },
  },
  methods: {
    selectPair(pair) {
      this.selectedPair = pair
      this.ui.dropModal = false
    },
    async calculate() {
      this.ui.loading = true
      try {
        const result = await axios({
          method: 'post',
          url: 'https://unbound-liquidation-check.vercel.app/api/getNetValue',
          data: {
            pair: this.selectedPair.address,
            stablecoinAddress: this.selectedPair.stablecoin,
            assetAddress: this.selectedPair.assetAddress,
            loanPercentage: this.calcData.ltv,
            days: this.calcData.days,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        })
        this.calcResult = result.data
        this.ui.loading = false
      } catch (error) {
        this.ui.loading = false
      }
    },
  },
}
</script>
