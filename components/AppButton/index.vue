<template>
  <button
    class="app-button"
    :disabled="disable"
    :class="{ disable }"
    v-on="$listeners"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    disable: {
      type: Boolean,
      default: false,
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

  &:not(.disable) {
    @apply bg-light-primary;
    @apply text-white;
  }
  &:focus {
    @apply outline-none;
  }
  &.disable {
    @apply bg-gray-300;
    @apply text-gray-600;
    @apply cursor-not-allowed;
  }
}
.dark-mode {
  .app-button {
    &:not(.disable) {
      @apply bg-dark-primary;
    }
    &.disable {
      @apply bg-gray-900;
      @apply text-gray-700;
    }
  }
}
</style>
