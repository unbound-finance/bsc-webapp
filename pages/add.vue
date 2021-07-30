<template>
  <div class="main_container my-4 md:my-8">
    <div class="flex flex-col items-center w-full space-y-4 p-4">
      <div class="flex w-full items-center justify-between">
        <nuxt-link to="/earn">
          <button class="focus:outline-none">
            <i
              class="fas fa-chevron-left text-gray-900 dark:text-white text-lg"
            ></i>
          </button>
        </nuxt-link>
        <p class="text-center font-medium dark:text-white text-lg">
          Add Liquidity
        </p>
        <button
          v-tooltip.auto="{
            content: 'Add liquidity and earn fees.',
            autoHide: true,
            trigger: 'hover',
          }"
          class="focus:outline-none"
        >
          <i class="far fa-question-circle text-gray-600 text-lg"></i>
        </button>
      </div>

      <input-field
        v-model="uTokenAmount"
        label="Input"
        :u-token.sync="uToken"
        type="add"
      />

      <i
        v-if="uToken"
        class="fas fa-plus text-gray-800 text-sm dark:text-gray-500"
      ></i>

      <input-field
        v-if="uToken"
        :value="uTokenAmount"
        label="Input"
        :readonly="true"
      >
        <template v-slot:showBalance>
          <p v-if="uToken" class="text-xs text-gray-500">
            Balance:
            <span
              class="font-mono text-gray-900 dark:text-gray-500 font-medium"
              >{{ uToken.tokenBalance | toFixed(6) }}</span
            >
          </p>
        </template>
        <template v-slot:append>
          <div class="flex flex-col">
            <div class="flex items-center space-x-2 focus:outline-none">
              <button
                v-if="uToken && uToken.tokenAllowance == '0'"
                type="button"
                class="px-2 py-1 text-sm rounded border focus:outline-none"
                :class="
                  approveState.cd
                    ? 'border-gray-600 dark:border-gray-700 text-gray-600 dark:text-gray-700 cursor-not-allowed'
                    : 'border-light-primary dark:border-dark-primary text-light-primary dark:text-dark-primary'
                "
                :disabled="approveState.cd"
                @click="approve(uToken.token.address)"
              >
                {{ approveState.msg }}
              </button>
              <div class="flex items-center">
                <img :src="uToken.token.icon" width="16" />

                <div class="flex items-center p-1">
                  <p
                    class="text-gray-900 dark:text-gray-500 font-semibold text-right"
                  >
                    {{ uToken.token.name }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </input-field>

      <!-- Show fees -->
      <!-- <div
        v-if="uTokenAmount"
        class="bg-gray-300 dark:bg-gray-800 rounded-lg w-full border border-gray-300 dark:border-gray-800"
      >
        <p
          class="text-gray-800 dark:text-gray-400 font-medium text-sm mx-4 my-2"
        >
          Earn
        </p>
        <div class="bg-white dark:bg-dark-bg rounded-lg p-4">
          <div class="flex flex-col space-y-1">
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-600">
                Estimated Earning (for a month)
              </p>
              <p class="font-medium text-sm dark:text-white">
                {{ uTokenAmount * 0.01 }}
              </p>
            </div>
          </div>
        </div>
      </div> -->
      <add-liq-button
        v-if="isWalletConnected"
        :u-token="uToken"
        :u-token-amount="uTokenAmount"
        @click="
          addLiquidity(
            uToken.token.address,
            uToken.address,
            uTokenAmount,
            uTokenAmount
          )
        "
      />
      <ConnectWalletBtn v-else class="w-full" />
    </div>

    <SuccessModal v-model="ui.showSuccess" :hash="txLink" />
    <RejectedModal v-model="ui.showRejected" />
    <AwaitingModal v-model="ui.showAwaiting" />
  </div>
</template>

<script>
import { ethers } from 'ethers'
import { ERC20_ABI, contracts } from '~/constants'
import core from '~/mixins/core'

export default {
  mixins: [core],
  data() {
    return {
      uTokenAmount: null,
      uToken: null,
      ui: {
        showDialog: false,
        showConfirmation: false,
        showSuccess: false,
        showRejected: false,
        showAwaiting: false,
      },
      txLink: '',
      approveState: {
        cd: false,
        msg: 'Approve',
      },
    }
  },

  computed: {
    isWalletConnected() {
      return !!this.$store.state.address
    },
  },

  methods: {
    async approve(tokenAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer)
      try {
        const totalSupply = contract.totalSupply()
        await contract.approve(contracts.pancakeRouter, totalSupply)
        // this.ui.showSuccess = true
        // this.txLink = approve.hash
        this.approveState = {
          cd: true,
          msg: 'Approving...',
        }
        await contract.on('Approval', (owner, spender, value) => {
          this.uToken.tokenAllowance = value.toString()
          this.approveState = {
            cd: false,
            msg: 'Approve',
          }
        })
      } catch (error) {
        this.ui.showRejected = true
      }
    },
  },
}
</script>

<style></style>
