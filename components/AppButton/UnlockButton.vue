<template>
  <AppButton :disable="shouldDisableUnlock" v-on="$listeners">
    <span v-if="!poolToken">Select Pool Token</span>
    <span v-else-if="!LPTAmount">Enter An Amount</span>
    <span v-else-if="Number(LPTAmount).toFixed(18) == 0.0"
      >Amount should be greater than 0</span
    >
    <span v-else-if="isSufficientBalance">Insufficient Balance</span>
    <template v-else-if="llcDetails && uTokenAmount < llcDetails.minValue">
      <span class="text-sm"
        >you need min. {{ llcDetails.minValue }}
        {{ poolToken.uToken.symbol }} to unlock</span
      >
    </template>
    <span v-else>Unlock</span>
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
    uTokenAmount: [String, Number],
    llcDetails: Object,
  },
  computed: {
    isSufficientBalance() {
      return (
        (this.poolToken &&
          parseFloat(this.LPTAmount) >
            parseFloat(this.poolToken.lockedBalance)) ||
        parseFloat(this.uTokenAmount) > parseFloat(this.poolToken.uTokenBalance)
      )
    },
    shouldDisableUnlock() {
      return (
        !this.poolToken ||
        !this.LPTAmount ||
        // eslint-disable-next-line eqeqeq
        Number(this.LPTAmount).toFixed(18) == 0.0 ||
        this.isSufficientBalance ||
        (this.llcDetails && this.uTokenAmount < this.llcDetails.minValue)
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
