<template>
  <AppButton :disable="shouldDisableAddLiquidity" v-on="$listeners">
    <span v-if="!uToken">Select Token</span>
    <span v-else-if="!uTokenAmount">Enter An Amount</span>
    <span v-else-if="isSufficentBalance.cd">{{ isSufficentBalance.msg }}</span>
    <span v-else-if="Number(uTokenAmount).toFixed(18) == 0.0"
      >Amount should be greater than 0</span
    >
    <span
      v-else-if="uToken.uTokenAllowance == '0' || uToken.tokenAllowance == '0'"
      >Please Approve Tokens</span
    >
    <span v-else>Add Liquidity</span>
  </AppButton>
</template>

<script>
import AppButton from './'
export default {
  components: { AppButton },
  extends: AppButton,
  props: {
    uToken: Object,
    uTokenAmount: [String, Number],
  },
  computed: {
    isSufficentBalance() {
      if (
        this.uToken &&
        parseFloat(this.uTokenAmount) > parseFloat(this.uToken.uTokenbalance)
      ) {
        return { cd: true, msg: `Insufficient ${this.uToken.name} Balance` }
      } else if (
        this.uToken &&
        parseFloat(this.uTokenAmount) > parseFloat(this.uToken.tokenBalance)
      ) {
        return {
          cd: true,
          msg: `Insufficient ${this.uToken.token.name} Balance`,
        }
      } else return false
    },

    shouldDisableAddLiquidity() {
      return (
        !this.uToken ||
        !this.uTokenAmount ||
        // eslint-disable-next-line eqeqeq
        Number(this.uTokenAmount).toFixed(18) == 0.0 ||
        this.isSufficentBalance.cd ||
        this.uToken.uTokenAllowance === '0' ||
        this.uToken.tokenAllowance === '0'
      )
    },
  },
}
</script>
