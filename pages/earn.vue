<template>
  <div class="main_container my-4 md:my-8">
    <div class="flex flex-col items-center w-full space-y-4 p-4">
      <div class="flex w-full items-center justify-between">
        <nuxt-link to="/">
          <button class="focus:outline-none">
            <i
              class="fas fa-chevron-left text-gray-900 dark:text-white text-lg"
            ></i>
          </button>
        </nuxt-link>
        <p class="text-center font-medium dark:text-white text-lg">Earn</p>
        <span></span>
      </div>
      <nuxt-link class="w-full" to="/add">
        <button
          class="w-full py-3 mt-8 rounded-lg bg-light-primary dark:bg-dark-primary font-medium text-white focus:outline-none"
        >
          Add Liquidity
        </button>
      </nuxt-link>
    </div>
    <div class="mt-4 px-4">
      <p class="font-medium text-sm dark:text-gray-400">Your Liquidity</p>
      <div
        v-if="!liquidity"
        class="h-24 mt-4 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-800"
      >
        <span v-if="ui.loading" class="text-gray-500">Loading...</span>
        <span v-else class="text-gray-500">No Liquidity Found.</span>
      </div>

      <div v-else class="mt-4">
        <div v-for="(data, i) in liquidity" :key="i">
          <div class="flex w-full items-center justify-between p-2">
            <div class="flex items-center space-x-2">
              <double-logo
                :token0logo="data.token.icon"
                :token1logo="require(`~/assets/tokens/${data.icon}`)"
              />
              <p class="font-medium dark:text-white">
                {{ data.token.name }} / {{ data.name }}
              </p>
            </div>

            <button
              class="focus:outline-none"
              @click="data.expanded = !data.expanded"
            >
              <i
                class="text-sm dark:text-white"
                :class="
                  data.expanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down'
                "
              ></i>
            </button>
          </div>
          <div v-if="data.expanded" class="flex flex-col pt-2">
            <div class="flex flex-wrap px-4 w-full dark:text-white text-sm">
              <div class="w-1/2">
                <p>Pooled Dai</p>
              </div>
              <div class="w-1/2 text-right">
                <p>{{ Number(data.poolInfo.token0).toFixed(4) }}</p>
              </div>
            </div>
            <div class="flex flex-wrap px-4 w-full dark:text-white text-sm">
              <div class="w-1/2">
                <p>Pooled UND</p>
              </div>
              <div class="w-1/2 text-right">
                <p>{{ Number(data.poolInfo.token1).toFixed(4) }}</p>
              </div>
            </div>

            <div class="flex flex-wrap px-4 w-full dark:text-white text-sm">
              <div class="w-1/2">
                <p>Your pool share</p>
              </div>
              <div class="w-1/2 text-right">
                <p>{{ Number(data.poolInfo.poolShare).toFixed(6) }} %</p>
              </div>
            </div>

            <div class="flex items-center py-4">
              <div class="w-1/2 px-1">
                <nuxt-link class="w-full" to="/add">
                  <button
                    class="w-full text-sm rounded py-1 bg-light-primary bg-opacity-25 text-light-primary dark:bg-dark-primary dark:text-white"
                  >
                    Add
                  </button>
                </nuxt-link>
              </div>
              <div class="w-1/2 px-1">
                <nuxt-link class="w-full" to="/remove">
                  <button
                    class="w-full text-sm rounded py-1 bg-light-primary bg-opacity-25 text-light-primary dark:bg-dark-primary dark:text-white"
                  >
                    Remove
                  </button>
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers'

import UniswapLPTABI from '~/configs/abi/UniswapLPTABI'
import { getAmountOfLockedTokens } from '~/mixins/stake'

import supportedUTokens from '~/configs/supportedUTokens'
// import { ethers } from 'ethers'
// import Web3 from 'web3'
// import contractAddresses from '~/configs/addresses'
// import stakingABI from '~/configs/abi/UnboundStaking'

export default {
  data() {
    return {
      ui: {
        loading: false,
        active: false,
      },
      liquidity: null,
    }
  },

  mounted() {
    this.fetchLiquidity()
  },

  methods: {
    async fetchLiquidity() {
      this.ui.loading = true
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const userAddress = provider.getSigner().getAddress()

      try {
        this.liquidity = (
          await Promise.all(
            supportedUTokens.map(async (e) => {
              const poolTokenContract = new ethers.Contract(
                e.lptAddress,
                UniswapLPTABI,
                signer
              )
              await poolTokenContract.balanceOf(userAddress)
              const poolInfo = await getAmountOfLockedTokens(e.lptAddress)
              return { ...e, poolInfo, expanded: false }
            })
          )
        ).filter((ev) => {
          return ev.poolInfo.token0 > 0
        })
      } catch (error) {
        this.ui.loading = false
      }
    },
  },
}
</script>
