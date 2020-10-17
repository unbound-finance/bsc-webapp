<template>
  <div>
    <div class="flex flex-col items-center w-full py-2 space-y-4 px-4">
      <div class="flex w-full items-center justify-between">
        <nuxt-link to="/earn">
          <button class="focus:outline-none">
            <i
              class="fas fa-chevron-left text-gray-900 dark:text-white text-lg"
            ></i>
          </button>
        </nuxt-link>
        <p class="text-center font-medium dark:text-white text-lg">
          Remove Liquidity
        </p>
        <button class="focus:outline-none">
          <i class="far fa-question-circle text-gray-600 text-lg"></i>
        </button>
      </div>

      <input-field v-model="lpTokenAmount" label="Input">
        <template v-slot:showBalance>
          <p v-if="selectedToken" class="text-xs text-gray-500">
            Balance:
            <span class="font-mono text-gray-900 font-medium">{{
              Number(balance).toFixed(4)
            }}</span>
          </p>
        </template>
        <template v-slot:append>
          <div class="flex flex-col">
            <div class="flex items-center space-x-2 focus:outline-none">
              <button
                v-if="selectedToken.allowance == 0 && selectedToken"
                type="button"
                class="px-2 py-1 text-sm rounded border border-light-primary dark:border-dark-primary bg-opacity-25 text-light-primary dark:text-white focus:outline-none"
                @click="approve(selectedToken.address)"
              >
                Approve
              </button>
              <div class="flex items-center">
                <img :src="selectedToken.tokenIcon" width="20" alt="dai logo" />
                <div class="flex items-center p-1">
                  <p class="text-gray-900 font-semibold text-right">DAI</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </input-field>

      <i class="fas fa-plus text-gray-800 text-sm dark:text-gray-500"></i>

      <input-field
        :value="(Number(UNDOutput) && UNDOutput) || ''"
        label="Input"
        :readonly="true"
      >
        <template v-slot:showBalance>
          <p v-if="selectedUToken" class="text-xs text-gray-500">
            Supplied:
            <span class="font-mono text-gray-900 font-medium">{{
              Number(UNDBalance).toFixed(4)
            }}</span>
          </p>
        </template>
        <template v-slot:append>
          <div class="flex flex-col">
            <div class="flex items-center space-x-2 focus:outline-none">
              <button
                v-if="selectedUToken.allowance == 0 && selectedUToken"
                type="button"
                class="px-2 py-1 text-sm rounded border border-light-primary dark:border-dark-primary bg-opacity-25 text-light-primary dark:text-white focus:outline-none"
                @click="approve(selectedUToken.address)"
              >
                Approve
              </button>
              <div class="flex items-center">
                <img src="~/assets/tokens/und.svg" width="24" alt="und logo" />
                <div class="flex items-center p-1">
                  <p class="text-gray-900 font-semibold text-right">UND</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </input-field>

      <div
        class="bg-gray-300 dark:bg-gray-800 rounded-lg w-full border border-gray-300 dark:border-gray-800"
      >
        <p
          class="text-gray-800 dark:text-gray-400 font-medium text-sm mx-4 my-2"
        >
          Pool Share
        </p>
        <div class="bg-white dark:bg-dark-bg rounded-lg p-4">
          <div class="flex flex-col space-y-1">
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-600">Pool Share</p>
              <p class="font-medium text-sm dark:text-white">
                {{ Number(liquidity.poolShare).toFixed(2) }}%
              </p>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-600">Your Positions</p>
              <p class="font-medium text-sm dark:text-white">
                <span class="text-gray-600">DAI</span>:
                {{ Number(liquidity.token1).toFixed(2) }},
                <span class="text-gray-600">UND</span>:
                {{ Number(liquidity.token0).toFixed(2) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        class="bg-light-primary text-light-primary font-medium dark:bg-dark-primary bg-opacity-25 dark:text-white w-full py-2 rounded-md focus:outline-none"
        @click="removeLiquidity"
      >
        Remove Liquidity
      </button>
    </div>

    <SuccessModal v-model="ui.showSuccess" :hash="txLink" />
    <RejectedModal v-model="ui.showRejected" />
    <AwaitingModal v-model="ui.showAwaiting" />
  </div>
</template>

<script>
import { ethers } from 'ethers'

import ERC20ABI from '~/configs/abi/ERC20'
import UniswapLPTABI from '~/configs/abi/UniswapLPTABI'
// import UniswapRouterABI from '~/configs/abi/UniswapRouter'

import { removeLiquidity, getAmountOfLockedTokens } from '~/mixins/stake'

import config from '~/configs/config'

export default {
  data() {
    return {
      ui: {
        showSuccess: false,
        showRejected: false,
        showAwaiting: false,
      },
      selectedToken: {
        name: 'dai',
        exchange: 'Uniswap',
        address: config.contracts.dai,
        allowance: '',
        tokenIcon:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      },
      selectedUToken: {
        name: 'UND',
        address: config.contracts.unboundDai,
        allowance: '',
        tokenIcon:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      },
      balance: '--.--',
      lpTokenAmount: '',
      // isTokenApproved: '',
      txLink: '',
      UNDBalance: '',
      liquidity: '',
      supportedPoolTokens: [
        {
          name: 'Dai',
          exchange: 'Uniswap',
          address: '0x5124d2A8e3A02f906d86803D703FD6CcCf492EF8',
          currencyOneLogo:
            'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
          currencyTwoLogo: 'https://uniswap.info/static/media/eth.73dabb37.png',
        },
      ],
    }
  },

  computed: {
    UNDOutput() {
      return this.lpTokenAmount
    },
  },

  mounted() {
    this.checkAllowances()
    this.fetchLiquidity()
    // this.calculateLoanRatio()
    // this.mint()
  },

  methods: {
    selectPoolToken(poolToken) {
      this.selectedToken = poolToken
      this.ui.showDialog = false
    },

    async fetchLiquidity() {
      this.ui.loading = true
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const userAddress = provider.getSigner().getAddress()

      const poolTokenContract = new ethers.Contract(
        config.contracts.UNDUniswapPool,
        UniswapLPTABI,
        signer
      )

      try {
        const ptBalance = await poolTokenContract.balanceOf(userAddress)
        if (ptBalance > 0) {
          const data = await getAmountOfLockedTokens()
          this.liquidity = data

          this.balance = data.token0
          this.UNDBalance = data.token1
        }
        this.ui.loading = false
      } catch (error) {
        this.ui.loading = false
      }
    },

    async getBalanceOfToken(tokenAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = await new ethers.Contract(tokenAddress, ERC20ABI, signer)
      const userAddress = signer.getAddress()
      const getBalance = await contract.balanceOf(userAddress)
      const balance = ethers.utils.formatEther(getBalance.toString())
      const formattedBalance =
        Math.round((parseInt(balance) + Number.EPSILON) * 100) / 100
      return formattedBalance
    },

    async approve(tokenAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = await new ethers.Contract(tokenAddress, ERC20ABI, signer)
      try {
        const totalSupply = contract.totalSupply()
        await contract.approve(config.contracts.uniswapRouter, totalSupply)
        this.$toasted.show('Token approveed Successfully', {
          theme: 'bubble',
          position: 'top-center',
          duration: 5000,
        })
        this.checkAllowances()
      } catch (error) {
        this.$toasted.show('Transaction Rejected', {
          theme: 'bubble',
          position: 'top-center',
          duration: 5000,
        })
      }
    },

    async removeLiquidity() {
      this.ui.showAwaiting = true
      try {
        const transaction = await removeLiquidity(
          config.contracts.dai,
          config.contracts.unboundDai,
          this.lpTokenAmount,
          this.lpTokenAmount
        )
        this.txLink = transaction.hash
        this.ui.showAwaiting = false
        this.ui.showSuccess = true
      } catch (error) {
        this.ui.showAwaiting = false
        this.ui.showRejected = true
      }
    },

    async getAllowance(tokenAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const userAddress = provider.getSigner().getAddress()
      const contract = await new ethers.Contract(tokenAddress, ERC20ABI, signer)
      const allowance = await contract.allowance(
        userAddress,
        config.contracts.uniswapRouter
      )
      console.log(allowance.toString())
      return allowance
    },

    async checkAllowances() {
      const UNDAllowance = await this.getAllowance(config.contracts.unboundDai)
      const daiAllowance = await this.getAllowance(config.contracts.dai)
      this.selectedToken.allowance = daiAllowance.toString()
      this.selectedUToken.allowance = UNDAllowance.toString()
      console.log(UNDAllowance.toString(), daiAllowance.toString())
    },

    setInputMax() {
      this.lpTokenAmount = this.balance
    },
  },
}
</script>

<style></style>
