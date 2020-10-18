<template>
  <div>
    <div class="flex flex-col items-center w-full py-8 space-y-6 px-4">
      <div class="flex w-full items-center justify-between">
        <nuxt-link to="/">
          <button class="focus:outline-none">
            <i
              class="fas fa-chevron-left text-gray-900 dark:text-white text-lg"
            ></i>
          </button>
        </nuxt-link>
        <p class="text-center font-medium dark:text-white text-lg">Mint</p>
        <button
          v-tooltip.auto="{
            content: 'Mint UND by locking your liquidity provider tokens.',
            autoHide: true,
            trigger: 'hover',
          }"
          class="focus:outline-none"
        >
          <i class="far fa-question-circle text-gray-600 text-lg"></i>
        </button>
      </div>

      <input-field
        v-model="LPTAmount"
        label="Supply"
        :pool-token.sync="poolToken"
      />
      <i
        v-if="poolToken"
        class="fas fa-arrow-down text-gray-800 dark:text-gray-600"
      ></i>

      <input-field
        v-if="poolToken"
        :value="(Number(UNDOutput) && UNDOutput) || ''"
        label="Mint"
        :readonly="true"
      >
        <template v-slot:append>
          <div class="flex flex-col">
            <div class="flex items-center focus:outline-none">
              <img src="~/assets/tokens/und.webp" width="16" alt="und logo" />
              <div class="flex items-center p-1">
                <p
                  class="text-gray-900 dark:text-gray-500 font-semibold text-right"
                >
                  {{ poolToken.uToken.symbol }}
                </p>
              </div>
            </div>
            <span class="text-xs text-right text-gray-500 dark:text-gray-700"
              >Unbound</span
            >
          </div>
        </template>
      </input-field>

      <div
        v-if="LPTAmount"
        class="w-full flex items-center justify-between px-2"
      >
        <p class="text-sm text-gray-600">Price Per LP Token</p>
        <p class="font-medium text-sm dark:text-white">
          {{ LPTPrice }} {{ poolToken && poolToken.uToken.symbol }}
        </p>
      </div>

      <!-- Show fees -->
      <div
        v-if="LPTAmount"
        class="bg-gray-300 dark:bg-gray-800 rounded-lg w-full border border-gray-300 dark:border-gray-800"
      >
        <p
          class="text-gray-800 dark:text-gray-400 font-medium text-sm mx-4 my-2"
        >
          Fees
        </p>
        <div class="bg-white dark:bg-dark-bg rounded-lg p-4">
          <div class="flex flex-col space-y-1">
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-600">Minting Fees</p>
              <p class="font-medium text-sm dark:text-white">
                {{ (parseInt(UNDOutput) * parseInt(llc.fee)) / 1e5 }}
                {{ poolToken.uToken.symbol }}
              </p>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-600">Funding Rate</p>
              <p class="font-medium text-sm dark:text-white">
                {{ (llc.loanRate * 100) / 1e6 }}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        v-if="isWalletConnected"
        class="font-medium w-full py-2 rounded-md focus:outline-none"
        :class="[
          !LPTAmount ? getDisabledClass : getActiveClass,
          isSufficentBalance ? getDisabledClass : getActiveClass,
        ]"
        :disabled="shouldDisableMint"
        @click="
          mint(
            poolToken.address,
            poolToken.llcAddress,
            poolToken.uToken.address
          )
        "
      >
        <span v-if="!LPTAmount">Enter An Amount</span>
        <span v-else-if="isSufficentBalance">Insufficient Balance</span>
        <span v-else>Mint</span>
      </button>

      <ConnectWalletBtn v-else class="w-full" />
    </div>

    <!-- Transaction confirmation Modal -->
    <!-- <Modal v-model="ui.showConfirmation">
      <template>
        <div class="flex flex-col space-y-4">
          <div class="flex justify-between items-center">
            <p class="font-medium dark:text-white">Confirm Mint</p>
            <button
              type="button"
              class="focus:outline-none"
              @click="ui.showConfirmation = false"
            >
              <i class="fas fa-times text-gray-900 dark:text-gray-500"></i>
            </button>
          </div>

          <div class="flex flex-col space-y-4">
            <div class="flex w-full items-center justify-between">
              <div class="flex items-center space-x-2">
                <img src="~/assets/pool-tokens/eth-dai.svg" width="40" alt />
                <span class="text-2xl dark:text-white">
                  {{ LPTAmount }}
                </span>
              </div>
              <p class="text-lg font-medium dark:text-white">UNIETH-DAI</p>
            </div>
            <i
              class="fas fa-arrow-down text-lg text-gray-800 dark:text-gray-500 mx-2"
            ></i>
            <div class="flex w-full items-center justify-between">
              <div class="flex items-center space-x-2">
                <img class="h-6" src="~/assets/icons/crypto/dai.webp" alt />
                <span class="text-2xl dark:text-white">{{ UNDOutput }}</span>
              </div>
              <p class="text-lg font-medium dark:text-white">UND</p>
            </div>
          </div>

          <div class="bg-gray-200 dark:bg-gray-800 p-4 rounded-md">
            <div class="flex flex-col space-y-1">
              <div class="flex items-center justify-between">
                <p class="text-sm text-gray-600">Fees</p>
                <p class="font-medium text-sm dark:text-white">
                  {{ (parseInt(UNDOutput) * 0.25) / 100 }} UND
                </p>
              </div>
              <div class="flex items-center justify-between">
                <p class="text-sm text-gray-600">Funding Rate</p>
                <p class="font-medium text-sm dark:text-white">50%</p>
              </div>
            </div>
            <button
              class="w-full mt-4 py-2 bg-light-primary dark:bg-dark-primary font-medium text-white rounded-md"
              @click="
                mint(selectedPoolToken.address, selectedPoolToken.llcAddress)
              "
            >
              Confirm Mint
            </button>
          </div>
        </div>
      </template>
    </Modal> -->

    <SuccessModal v-model="ui.showSuccess" :hash="txLink" />
    <RejectedModal v-model="ui.showRejected" />
    <AwaitingModal v-model="ui.showAwaiting" />
  </div>
</template>

<script>
// import components

import { ethers } from 'ethers'
import Web3 from 'web3'

import UnboundDaiABI from '~/configs/abi/UnboundDai.js'
import UniswapLPTABI from '~/configs/abi/UniswapLPTABI'
import UnboundLLCABI from '~/configs/abi/UnboundLLCABI'

// import contractAddresses from '~/configs/addresses'
import supportedPoolTokens from '~/configs/supportedPoolTokens'

// import signature from '~/mixins/signature'
import { getNonce, getEIP712Signature } from '~/mixins/crypto'
import { getTokenBalance, getDecimals } from '~/mixins/ERC20'
import { getLLC } from '~/mixins/valuator'

export default {
  data() {
    return {
      ui: {
        showDialog: false,
        showConfirmation: false,
        showSuccess: false,
        showRejected: false,
        showAwaiting: false,
      },
      poolToken: null,
      LPTAmount: '',
      LPTPrice: '',
      loanRatioPerLPT: '',
      txLink: '',
      supportedPoolTokens,
      llc: {
        loanRate: '',
        fee: '',
      },
    }
  },

  computed: {
    UNDOutput() {
      const loanRatioPerLPT = this.LPTAmount * this.loanRatioPerLPT
      console.log(this.loanRatioPerLPT)
      return loanRatioPerLPT.toFixed(4).slice(0, -1)
    },

    isWalletConnected() {
      return !!this.$store.state.address
    },

    isSufficentBalance() {
      return parseFloat(this.LPTAmount) > parseFloat(this.balance)
    },

    shouldDisableMint() {
      return !this.LPTAmount || this.isSufficentBalance
    },

    getDisabledClass() {
      return 'bg-gray-500 dark:bg-gray-900 text-gray-600 dark:text-gray-700 cursor-not-allowed'
    },

    getActiveClass() {
      return 'bg-light-primary text-light-primary dark:bg-dark-primary bg-opacity-25 dark:text-white'
    },
  },

  watch: {
    poolToken(a) {
      this.getLoanRatioPerLPT(a)
    },
  },

  methods: {
    async getLoanRatioPerLPT(poolToken) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = await new ethers.Contract(
        poolToken.address,
        UniswapLPTABI,
        signer
      )
      const reserve = await contract.getReserves()
      const LPTTotalSupply = await contract.totalSupply()
      const token0 = await contract.token0()
      const token1 = await contract.token1()
      const llc = await getLLC(poolToken.llcAddress)
      this.llc.loanRate = llc.loanRate
      this.llc.fee = llc.fee
      if (token0.toLowerCase() === poolToken.stablecoin.toLowerCase()) {
        const stablecoinDecimal = await getDecimals(token0)
        let difference
        let totalValueInDai
        totalValueInDai = reserve[0].toString() * 2
        console.log(totalValueInDai)
        // first case: tokenDecimal is smaller than 18
        // for stablecoins with less than 18 decimals
        if (stablecoinDecimal < '18' && stablecoinDecimal >= '0') {
          // calculate amount of decimals under 18
          difference = 18 - stablecoinDecimal
          totalValueInDai = totalValueInDai * 10 ** difference
        } else if (stablecoinDecimal > '18') {
          // caclulate amount of decimals over 18
          difference = stablecoinDecimal - 18
          // removes decimals to match 18
          totalValueInDai = totalValueInDai / 10 ** difference
        }
        this.loanRatioPerLPT =
          ((totalValueInDai / LPTTotalSupply) * llc.loanRate) / 1e6
        this.LPTPrice = (totalValueInDai / LPTTotalSupply)
          .toFixed(4)
          .slice(0, -1)
      } else {
        const stablecoinDecimal = await getDecimals(token1)
        let difference
        let totalValueInDai
        // first case: tokenDecimal is smaller than 18
        // for stablecoins with less than 18 decimals
        totalValueInDai = reserve[1].toString() * 2
        if (stablecoinDecimal < '18' && stablecoinDecimal >= '0') {
          // calculate amount of decimals under 18
          difference = 18 - stablecoinDecimal
          totalValueInDai = totalValueInDai * 10 ** difference
        } else if (stablecoinDecimal > '18') {
          // caclulate amount of decimals over 18
          difference = stablecoinDecimal - 18
          // removes decimals to match 18
          totalValueInDai = totalValueInDai / 10 ** difference
        }
        console.log('totalValueInDai', totalValueInDai)
        console.log('LPTTotalSupply', LPTTotalSupply)
        console.log('loanRate', llc.loanRate)

        this.loanRatioPerLPT =
          ((totalValueInDai / LPTTotalSupply) * llc.loanRate) / 1e6
        this.LPTPrice = (totalValueInDai / LPTTotalSupply)
          .toFixed(4)
          .slice(0, -1)
      }
    },

    async mint(poolTokenAddress, llcAddress, uToken) {
      this.ui.showAwaiting = true
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()

      const userAddress = await signer.getAddress()
      const nonce = await getNonce(poolTokenAddress, signer)
      const deadline = +new Date() + 5000
      const amount = ethers.utils.parseEther(this.LPTAmount).toString()

      const EIP712Signature = await getEIP712Signature(
        poolTokenAddress,
        llcAddress,
        userAddress,
        amount,
        nonce,
        deadline
      )
      const web3 = new Web3(window.ethereum)
      const metamaskSigner = await web3.eth.getAccounts()

      web3.currentProvider.sendAsync(
        {
          method: 'eth_signTypedData_v3',
          params: [metamaskSigner[0], EIP712Signature],
          from: metamaskSigner[0],
        },
        async (error, signedData) => {
          if (error || signedData.error) {
            this.ui.showAwaiting = false
            return console.error(signedData)
          }
          const signature = ethers.utils.splitSignature(signedData.result)
          const UnboundLLCContract = await new ethers.Contract(
            llcAddress,
            UnboundLLCABI,
            signer
          )
          try {
            const mintUND = await UnboundLLCContract.lockLPTWithPermit(
              amount,
              uToken,
              deadline,
              signature.v,
              signature.r,
              signature.s
            )
            // close awaiting modal
            this.ui.showAwaiting = false
            // show success screen
            this.ui.showConfirmation = false
            this.txLink = mintUND.hash
            this.ui.showSuccess = true

            // initiate the UND contract to detect the event so we can update the balances
            const UND = new ethers.Contract(uToken, UnboundDaiABI, signer)
            // listen to mint event from UND contract
            UND.on('Mint', async (user, amount) => {
              const balance = await getTokenBalance(poolTokenAddress)
              this.poolToken.balance = balance.toFixed
            })
          } catch (error) {
            this.ui.showAwaiting = false
            this.ui.showConfirmation = false
            this.ui.showRejected = true
          }
        }
      )
    },

    setInputMax() {
      this.LPTAmount = this.poolToken.balance
    },
  },
}
</script>
