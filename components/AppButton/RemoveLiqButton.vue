<template>
  <AppButton :disable="shouldDisableRemove" v-on="$listeners">
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
    <span v-else>Remove Liquidity</span>
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
        this.liquidity &&
        parseFloat(this.uTokenAmount) > parseFloat(this.liquidity.token0)
      ) {
        return { cd: true, msg: `Insufficient Liquidity` }
      } else if (
        this.liquidity &&
        parseFloat(this.uTokenAmount) > parseFloat(this.liquidity.token1)
      ) {
        return {
          cd: true,
          msg: `Insufficient Liquidity`,
        }
      } else return false
    },

    shouldDisableRemove() {
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
