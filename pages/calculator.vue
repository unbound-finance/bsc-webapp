<template>
  <div>
    <form @submit.prevent="calculate">
      <input
        v-model="calcData.pair"
        class="appearance-none block w-full dark:bg-dark-bg text-gray-700 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:border-gray-500"
        type="text"
        placeholder="Pair Address"
      />
      <input
        v-model="calcData.stablecoinAddress"
        class="appearance-none mt-4 block w-full dark:bg-dark-bg text-gray-700 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:border-gray-500"
        type="text"
        placeholder="Stablecoin Address"
      />
      <div class="flex items-center space-x-4 mt-4">
        <input
          v-model="calcData.ltv"
          class="appearance-none block w-full dark:bg-dark-bg text-gray-700 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:border-gray-500"
          type="text"
          placeholder="LTV"
        />
      </div>
      <div class="flex items-center space-x-4 mt-4">
        <input
          v-model="calcData.lossPercentage"
          class="appearance-none block w-full dark:bg-dark-bg text-gray-700 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:border-gray-500"
          type="text"
          placeholder="Price Change (%)"
        />
        <input
          v-model="calcData.days"
          class="appearance-none block w-full dark:bg-dark-bg text-gray-700 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:border-gray-500"
          type="text"
          placeholder="Days"
        />
      </div>
      <button
        type="submit"
        class="rounded-md text-white bg-dark-primary text-sm w-full py-2 font-medium mt-4 focus:outline-none"
      >
        Calculate
      </button>
    </form>

    <div v-if="calcResult" class="mt-4">
      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-600">Pool Share</p>
        <p class="text-sm font-medium">
          {{ Number(calcResult.poolShare).toFixed(4) }}%
        </p>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-600">Impermanent Loss</p>
        <p class="text-sm font-medium">
          {{ Number(calcResult.implLoss).toFixed(4) }}%
        </p>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-600">Fees Earned</p>
        <p class="text-sm font-medium">
          ${{ Number(calcResult.feesEarned).toFixed(4) }}
        </p>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-600">Net Value</p>
        <p class="text-sm font-medium">
          ${{ Number(calcResult.netValue).toFixed(4) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      calcData: {
        pair: '',
        stablecoinAmt: '',
        lossPercentage: '',
        days: '',
        ltv: '',
        stablecoinAddress: '',
      },
      calcResult: null,
    }
  },
  methods: {
    async calculate() {
      try {
        const result = await axios({
          method: 'post',
          url: 'https://unbound-liquidation-check.vercel.app/api/getNetValue',
          data: this.calcData,
          headers: {
            'Content-Type': 'application/json',
          },
        })
        console.log(result)
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style></style>
