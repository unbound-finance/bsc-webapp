import { ethers } from 'ethers'
import Web3 from 'web3'

import { UNBOUND_LLC_ABI, UNBOUND_DOLLAR_ABI } from '~/constants'

import { loanRatioPerLPT } from '~/utils/pricing'
import { getEIP712Signature, getNonce, toFixed } from '~/utils'
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
        priceLoader: false,
      },
      poolToken: null,
      LPTAmount: null,
      uTokenAmount: null,
      txLink: '',
      supportedPoolTokens,
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
          parseFloat(this.LPTAmount) * this.llcDetails.loanRatioPerLPT * 0.02) *
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
            const mintUND = await UnboundLLCContract.lockLPTWithPermit(
              amount,
              deadline,
              signature.v,
              signature.r,
              signature.s,
              finalMinAmount
            )
            // close awaiting modal
            this.ui.showAwaiting = false
            // show success screen
            this.ui.showConfirmation = false
            this.txLink = mintUND.hash
            this.ui.showSuccess = true
            this.LPTAmount = ''

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
    },

    async unlock(poolToken) {
      this.ui.showAwaiting = true
      const { SIGNER } = this.$getProvider()

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
        this.ui.showAwaiting = false
        this.txLink = unlock.hash
        this.ui.showSuccess = true
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
    },
  },
}
