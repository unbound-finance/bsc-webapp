<template>
  <div class="bg-white">
    <nuxt />
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.light-mode {
  $g-color-1: #ffe7d6;
  $g-color-2: #f2f7ff;

  background: radial-gradient($g-color-1, $g-color-2);
}

.dark-mode {
  $g-color-1: #2c313a;
  $g-color-2: #2b3546;

  background: radial-gradient($g-color-1, $g-color-2);
}
</style>
