import { ethers } from 'ethers'
import Web3 from 'web3'

import {
  UNBOUND_LLC_ABI,
  UNBOUND_DOLLAR_ABI,
  UNISWAP_ROUTER_ABI,
  contracts,
} from '~/constants'

import { loanRatioPerLPT } from '~/utils/pricing'
import {
  getEIP712Signature,
  getNonce,
  toFixed,
  isBlocktimeReached,
} from '~/utils'
import { getTokenBalance } from '~/utils/ERC20'

import supportedPoolTokens from '~/configs/supportedPoolTokens'

export default {
  data() {
    return {
      ui: {
        showDialog: false,
        showConfirmation: false,
        showSuccess: false,
        showRejected: false,
        showAwaiting: false,
        showCoolDown: false,
        priceLoader: false,
      },
      poolToken: null,
      LPTAmount: null,
      uTokenAmount: null,
      txLink: '',
      supportedPoolTokens,
      targetBlockNumber: 0,
    }
  },
  asyncComputed: {
    llcDetails() {
      if (!this.poolToken) return null
      return loanRatioPerLPT(this.poolToken)
    },
  },
  methods: {
    async mint(poolToken) {
      this.ui.showAwaiting = true
      const prevTx = await isBlocktimeReached(
        poolToken.llcAddress.toLowerCase()
      )
      if (!prevTx.pending) {
        const { SIGNER } = this.$getProvider()
        const userAddress = await SIGNER.getAddress()

        // get nonce
        const nonce = await getNonce(poolToken.address, SIGNER)

        // deadline is next 5 seconds
        const deadline = +new Date() + 5000

        // converting decimals to 18 decimals format
        let amount = ethers.utils.parseEther(
          this.LPTAmount.toString().slice(0, 18)
        )
        amount = amount.toString()

        // setting min amount (2%)
        let minAmount = toFixed(
          (parseFloat(this.LPTAmount) * this.llcDetails.loanRatioPerLPT -
            parseFloat(this.LPTAmount) *
              this.llcDetails.loanRatioPerLPT *
              0.02) *
            1e18
        )
        minAmount = minAmount.toString()

        let minAmountFees =
          (parseFloat(minAmount) * parseFloat(this.llcDetails.fee)) / 1e6

        minAmountFees = minAmountFees.toString()

        const finalMinAmount = toFixed(minAmount - minAmountFees).toString()

        // Requesting EIP712 signature
        const EIP712Signature = getEIP712Signature(
          poolToken.address,
          poolToken.llcAddress,
          userAddress,
          amount,
          nonce,
          deadline
        )
        const web3 = new Web3(window.ethereum)
        web3.currentProvider.sendAsync(
          {
            method: 'eth_signTypedData_v3',
            params: [userAddress, EIP712Signature],
            from: userAddress,
          },
          async (error, signedData) => {
            if (error || signedData.error) {
              if (error.code !== 4001) {
                this.$logRocket.captureException(error, {
                  tags: {
                    function: 'mintSignature',
                  },
                  extra: {
                    pageName: 'Mint',
                  },
                })
                this.$logRocket.identify(this.$store.state.address)
              }
              this.ui.showAwaiting = false
              return
            }
            const signature = ethers.utils.splitSignature(signedData.result)
            const UnboundLLCContract = new ethers.Contract(
              poolToken.llcAddress,
              UNBOUND_LLC_ABI,
              SIGNER
            )
            try {
              console.log({
                amount,
                deadline,
                v: signature.v,
                r: signature.r,
                s: signature.s,
                finalMinAmount,
              })
              const mintUND = await UnboundLLCContract.lockLPTWithPermit(
                amount,
                deadline,
                signature.v,
                signature.r,
                signature.s,
                finalMinAmount
              )
              localStorage.setItem(
                'txStatus',
                JSON.stringify({
                  pending: true,
                  txHash: mintUND.hash,
                  llcAddress: poolToken.llcAddress,
                  userAddress,
                })
              )
              // close awaiting modal
              this.ui.showAwaiting = false
              // show success screen
              this.ui.showConfirmation = false
              this.txLink = mintUND.hash
              this.ui.showSuccess = true
              this.LPTAmount = null

              mintUND.wait(3).then(() => {
                localStorage.removeItem('txStatus')
              })

              // initiate the UND contract to detect the event so we can update the balances
              const UND = new ethers.Contract(
                poolToken.uToken.address,
                UNBOUND_DOLLAR_ABI,
                SIGNER
              )
              // listen to mint event from UND contract
              UND.on('Mint', async () => {
                const balance = await getTokenBalance(poolToken.address)
                this.poolToken.balance = balance.toFixed
              })
            } catch (error) {
              if (error.code !== 4001) {
                this.$logRocket.captureException(error, {
                  tags: {
                    function: 'mint',
                  },
                  extra: {
                    pageName: 'Mint',
                  },
                })
                this.$logRocket.identify(this.$store.state.address)
              }
              this.ui.showAwaiting = false
              this.ui.showConfirmation = false
              this.ui.showRejected = true
            }
          }
        )
      } else {
        this.ui.showAwaiting = false
        this.targetBlockNumber = prevTx.targetBlockNumber
        this.ui.showCoolDown = true
      }
    },

    async unlock(poolToken) {
      this.ui.showAwaiting = true
      const prevTx = await isBlocktimeReached(
        poolToken.llcAddress.toLowerCase()
      )
      if (!prevTx.pending) {
        const { SIGNER } = this.$getProvider()
        const userAddress = await SIGNER.getAddress()
        const contract = new ethers.Contract(
          poolToken.llcAddress,
          UNBOUND_LLC_ABI,
          SIGNER
        )
        let rawUNDAmount = ethers.utils.parseEther(
          this.uTokenAmount.toString().slice(0, 18)
        )
        rawUNDAmount = rawUNDAmount.toString()

        try {
          const unlock = await contract.unlockLPT(rawUNDAmount)
          localStorage.setItem(
            'txStatus',
            JSON.stringify({
              pending: true,
              txHash: unlock.hash,
              llcAddress: poolToken.llcAddress,
              userAddress,
            })
          )
          this.ui.showAwaiting = false
          this.txLink = unlock.hash
          this.ui.showSuccess = true
          this.LPTAmount = null
          unlock.wait(3).then(() => {
            localStorage.removeItem('txStatus')
          })
        } catch (error) {
          if (error.code !== 4001) {
            this.$logRocket.captureException(error, {
              tags: {
                function: 'unlock',
              },
              extra: {
                pageName: 'Unlock',
              },
            })
            this.$logRocket.identify(this.$store.state.address)
          }
          this.ui.showAwaiting = false
          this.ui.showRejected = true
        }
      } else {
        this.ui.showAwaiting = false
        this.targetBlockNumber = prevTx.targetBlockNumber
        this.ui.showCoolDown = true
      }
    },

    async addLiquidity(tokenA, tokenB, amountA, amountB) {
      this.ui.showAwaiting = true
      const { SIGNER } = this.$getProvider()
      const contract = new ethers.Contract(
        contracts.uniswapRouter,
        UNISWAP_ROUTER_ABI,
        SIGNER
      )
      const formatAmountA = toFixed(amountA * 1e18).toString()
      const formatAmountB = toFixed(amountB * 1e18).toString()

      const amountADesired = formatAmountB
      const amountBDesired = formatAmountB
      const amountAMin = toFixed(
        formatAmountA - (formatAmountA * 10) / 100
      ).toString()
      const amountBMin = toFixed(
        formatAmountB - (formatAmountB * 10) / 100
      ).toString()
      const to = await SIGNER.getAddress()
      const deadline = +new Date() + 5000

      try {
        const transaction = await contract.addLiquidity(
          tokenA,
          tokenB,
          amountADesired,
          amountBDesired,
          amountAMin,
          amountBMin,
          to,
          deadline
        )
        this.txLink = transaction.hash
        this.ui.showAwaiting = false
        this.ui.showSuccess = true
      } catch (error) {
        if (error.code !== 4001) {
          if (error) throw new Error(error)
          this.$logRocket.captureException(error, {
            tags: {
              function: 'addLiquidity',
            },
            extra: {
              pageName: 'Add Liquidity',
            },
          })
          this.$logRocket.identify(this.$store.state.address)
        }
        this.ui.showAwaiting = false
        this.ui.showRejected = true
      }
    },
  },
}
