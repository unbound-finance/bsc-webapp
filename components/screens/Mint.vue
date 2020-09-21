<template>
  <div>
    <div class="flex flex-col items-center w-full py-2 space-y-4 px-4">
      <div class="flex w-full items-center justify-between">
        <nuxt-link to="/">
          <button class="focus:outline-none">
            <i
              class="fas fa-chevron-left text-gray-900 dark:text-white text-lg"
            ></i>
          </button>
        </nuxt-link>
        <p class="text-center font-medium dark:text-white text-lg">Mint</p>
        <button class="focus:outline-none">
          <i class="far fa-question-circle text-gray-600 text-lg"></i>
        </button>
      </div>

      <p
        v-if="!selectedPoolToken"
        class="text-center border-1 rounded-full px-8 bg-opacity-25 text-light-primary dark:text-white text-gray-600"
      >
        Please select pool token you want to stake
      </p>
      <div
        class="w-full p-2 px-4 border border-gray-200 dark:border-gray-700 rounded-lg"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-700 font-medium">Supply</p>
          <p v-if="selectedPoolToken" class="text-gray-600 text-sm">
            Balance: {{ selectedPoolToken.balance }}
          </p>
        </div>
        <form class="w-full max-w-sm">
          <div class="flex items-center py-2">
            <input
              v-model="LPTAmount"
              class="appearance-none bg-transparent text-2xl text-gray-800 dark:text-gray-300 font-medium w-full mr-3 py-1 leading-tight focus:outline-none"
              type="number"
              placeholder="0.0"
              :disabled="!selectedPoolToken"
            />

            <button
              v-if="selectedPoolToken"
              type="button"
              class="px-1 mx-2 text-sm rounded border border-light-primary dark:border-dark-primary bg-opacity-25 text-light-primary dark:text-white focus:outline-none"
              @click="setInputMax"
            >
              Max
            </button>
            <button
              v-if="selectedPoolToken"
              class="flex-shrink-0 dark:text-white transition-all duration-200 text-sm font-medium py-1 rounded flex items-center space-x-2 focus:outline-none"
              type="button"
              @click="ui.showDialog = !ui.showDialog"
            >
              <!-- <img src="~/assets/pool-tokens/eth-dai.svg" width="24" alt /> -->
              <span>{{ selectedPoolToken.name }}</span>
              <i class="fas fa-chevron-down pt-1"></i>
            </button>

            <button
              v-else
              class="flex-shrink-0 text-light-primary dark:text-white bg-light-primary dark:bg-dark-primary bg-opacity-25 hover:bg-opacity-100 hover:text-white transition-all duration-200 text-sm font-medium py-1 px-4 rounded flex items-center space-x-2 focus:outline-none"
              type="button"
              @click="ui.showDialog = !ui.showDialog"
            >
              <span>Select Pool Token</span>
              <i class="fas fa-chevron-down pt-1"></i>
            </button>
          </div>
        </form>
      </div>

      <i class="fas fa-arrow-down text-gray-800 dark:text-gray-600"></i>

      <div
        class="w-full p-2 px-4 border border-gray-200 dark:border-gray-700 rounded-lg"
      >
        <p class="text-sm text-gray-700 font-medium">Mint</p>
        <form class="w-full max-w-sm">
          <div class="flex items-center py-2">
            <input
              v-model="UBDOutput"
              class="appearance-none bg-transparent text-2xl text-gray-800 dark:text-gray-300 font-medium w-full mr-3 py-1 leading-tight focus:outline-none"
              type="number"
              placeholder="0.0"
              readonly
            />
            <button
              class="flex-shrink-0 text-light-primary dark:text-white bg-light-primary dark:bg-dark-primary bg-opacity-25 hover:bg-opacity-100 hover:text-white transition-all duration-200 text-sm font-medium py-1 px-4 rounded flex items-center space-x-2 focus:outline-none"
              type="button"
            >
              <span>UBD</span>
              <!-- <i class="fas fa-chevron-down pt-1"></i> -->
            </button>
          </div>
        </form>
      </div>
      <div
        v-if="LPTAmount"
        class="w-full flex items-center justify-between px-2"
      >
        <p class="text-sm text-gray-600">Price Per LP Token</p>
        <p class="font-medium text-sm dark:text-white">
          {{ LPTAmount * LPTPrice }} DAI
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
                {{ (parseInt(UBDOutput) * 0.25) / 100 }} UBD
              </p>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-600">Funding Rate</p>
              <p class="font-medium text-sm dark:text-white">
                {{ 100 / llc.loanRate }}%
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
        @click="ui.showConfirmation = true"
      >
        <span v-if="!LPTAmount">Enter an amount</span>
        <span v-else-if="isSufficentBalance">Insufficient Balance</span>
        <span v-else>Mint</span>
      </button>

      <ConnectWalletBtn v-else class="w-full" />
    </div>

    <!-- Select LP Tokens Modal -->
    <Modal v-model="ui.showDialog">
      <template>
        <div class="flex flex-col space-y-4">
          <div class="flex justify-between items-center">
            <p class="font-medium dark:text-white">Select Pool Token</p>
            <button
              type="button"
              class="focus:outline-none"
              @click="ui.showDialog = false"
            >
              <i class="fas fa-times text-gray-900 dark:text-gray-500"></i>
            </button>
          </div>

          <div class="pt-4">
            <div v-for="(poolToken, index) in supportedPoolTokens" :key="index">
              <a @click="selectPoolToken(poolToken)">
                <div
                  class="w-full flex items-center justify-between cursor-pointer hover:text-light-primary py-2"
                >
                  <div class="space-x-2 flex items-center">
                    <div class="relative flex w-12">
                      <div class="flex items-center self-center">
                        <img
                          class="rounded-full"
                          :src="poolToken.currencyOneLogo"
                          style="z-index: 2"
                          width="24"
                        />
                      </div>
                      <div class="absolute" style="left: 16px">
                        <img
                          class="rounded-full"
                          :src="poolToken.currencyTwoLogo"
                          style="width: 24px; height: 24px"
                        />
                      </div>
                    </div>
                    <span class="font-medium dark:text-white text-sm"
                      >{{ poolToken.name }} ({{ poolToken.exchange }})</span
                    >
                  </div>
                  <div>
                    <span class="dark:text-white text-gray-800 font-medium">
                      {{ poolToken.balance }}
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </template>
    </Modal>

    <!-- Transaction confirmation Modal -->
    <Modal v-model="ui.showConfirmation">
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
                <span class="text-2xl dark:text-white">{{ UBDOutput }}</span>
              </div>
              <p class="text-lg font-medium dark:text-white">UBD</p>
            </div>
          </div>

          <div class="bg-gray-200 dark:bg-gray-800 p-4 rounded-md">
            <div class="flex flex-col space-y-1">
              <div class="flex items-center justify-between">
                <p class="text-sm text-gray-600">Fees</p>
                <p class="font-medium text-sm dark:text-white">
                  {{ (parseInt(UBDOutput) * 0.25) / 100 }} UBD
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
    </Modal>

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

import config from '~/configs/config'

// import signature from '~/mixins/signature'
import { getNonce, getEIP712Signature } from '~/mixins/crypto'
import { getTokenBalance } from '~/mixins/ERC20'
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
      selectedPoolToken: '',
      balance: '--.--',
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
    UBDOutput() {
      const loanRatioPerLPT = this.LPTAmount * this.loanRatioPerLPT
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
      return 'bg-gray-500 dark:bg-gray-800 text-gray-600 cursor-not-allowed'
    },

    getActiveClass() {
      return 'bg-light-primary text-light-primary dark:bg-dark-primary bg-opacity-25 dark:text-white'
    },
  },

  mounted() {
    this.getSupportedPoolTokens()
  },

  methods: {
    selectPoolToken(poolToken) {
      this.selectedPoolToken = poolToken
      this.ui.showDialog = false
      this.getLoanRatioPerLPT(poolToken)
    },

    async getSupportedPoolTokens() {
      let i
      const poolTokens = []
      for (i = 0; i < supportedPoolTokens.length; i++) {
        const balance = await getTokenBalance(supportedPoolTokens[i].address)
        const poolTokenObj = {
          name: supportedPoolTokens[i].name,
          exchange: supportedPoolTokens[i].exchange,
          address: supportedPoolTokens[i].address,
          llcAddress: supportedPoolTokens[i].llcAddress,
          currencyOneLogo: supportedPoolTokens[i].currencyOneLogo,
          currencyTwoLogo: supportedPoolTokens[i].currencyTwoLogo,
          stablecoin: supportedPoolTokens[i].stablecoin,
          balance: balance.toFixed,
        }
        poolTokens.push(poolTokenObj)
        this.supportedPoolTokens = poolTokens
      }
    },

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
      const llc = await getLLC(poolToken.llcAddress)
      this.llc.loanRate = llc.loanRate
      this.llc.fee = llc.fee
      if (token0.toLowerCase() === poolToken.stablecoin) {
        const totalValueInDai = reserve[0].toString() * 2
        this.loanRatioPerLPT = totalValueInDai / LPTTotalSupply / llc.loanRate
        this.LPTPrice = (totalValueInDai / LPTTotalSupply)
          .toFixed(4)
          .slice(0, -1)
      } else {
        const totalValueInDai = reserve[1].toString() * 2
        this.loanRatioPerLPT = totalValueInDai / LPTTotalSupply / llc.loanRate
        this.LPTPrice = (totalValueInDai / LPTTotalSupply)
          .toFixed(4)
          .slice(0, -1)
      }
    },

    async mint(poolTokenAddress, llcAddress) {
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
            const mintUBD = await UnboundLLCContract.lockLPTWithPermit(
              amount,
              config.contracts.unboundDai,
              deadline,
              signature.v,
              signature.r,
              signature.s
            )
            // close awaiting modal
            this.ui.showAwaiting = false
            // show success screen
            this.ui.showConfirmation = false
            this.txLink = mintUBD.hash
            this.ui.showSuccess = true

            // initiate the UBD contract to detect the event so we can update the balances
            const UBD = new ethers.Contract(
              config.contracts.unboundDai,
              UnboundDaiABI,
              signer
            )
            // listen to mint event from UBD contract
            UBD.on('Mint', async (user, amount) => {
              const balance = await getTokenBalance(poolTokenAddress)
              this.selectedPoolToken.balance = balance.toFixed
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
      this.LPTAmount = this.selectedPoolToken.balance
    },
  },
}
</script>
