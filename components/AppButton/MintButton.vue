<template>
  <AppButton :disable="shouldDisableMint" v-on="$listeners">
    <span v-if="!poolToken">Select Pool Token</span>
    <span v-else-if="!LPTAmount || LPTAmount === '0'">Enter An Amount</span>
    <span v-else-if="isSufficientBalance">Insufficient Balance</span>
    <span v-else-if="Number(LPTAmount).toFixed(18) == 0.0"
      >Amount should be greater than 0</span
    >
    <span v-else>Mint</span>
  </AppButton>
</template>

<script>
import AppButton from './'
export default {
  components: { AppButton },
  extends: AppButton,
  props: {
    poolToken: Object,
    LPTAmount: [String, Number],
  },
  computed: {
    isSufficientBalance() {
      return (
        this.poolToken &&
        parseFloat(this.LPTAmount) > parseFloat(this.poolToken.balance)
      )
    },
    shouldDisableMint() {
      return (
        !this.poolToken ||
        !this.LPTAmount ||
        // eslint-disable-next-line eqeqeq
        Number(this.LPTAmount).toFixed(18) == 0.0 ||
        this.isSufficientBalance
      )
    },
  },
}
</script>

<style lang="scss">
.app-button {
  @apply font-medium;
  @apply w-full;
  @apply py-2;
  @apply rounded-md;

  &:focus {
    @apply outline-none;
  }
  &.disable {
    @apply bg-gray-300;
    @apply text-gray-600;
    @apply cursor-not-allowed;
  }
  &.active {
    @apply bg-light-primary;
    @apply text-white;
  }
}
.dark-mode {
  .app-button {
    &.disable {
      @apply bg-gray-900;
      @apply text-gray-700;
    }
    &.active {
      @apply bg-dark-primary;
    }
  }
}
</style>
