<template>
  <div class="min-h-screen">
    <Navbar />
    <div class="md:max-w-6xl mx-auto p-4">
      <nuxt />
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.light-mode {
  // $g-color-1: #ffe7d6;
  // $g-color-2: #f2f7ff;

  $g-color-1: #26bcb424;
  $g-color-2: #ffffff;

  background: radial-gradient($g-color-1, $g-color-2);
}

.dark-mode {
  $g-color-1: #2c313a;
  $g-color-2: #2b3546;

  background: radial-gradient($g-color-1, $g-color-2);
}
</style>
