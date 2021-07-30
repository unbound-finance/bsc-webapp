<template>
  <div class="w-full min-h-screen">
    <notifications group="general" position="top center" />
    <Navbar />

    <div class="w-full h-full md:max-w-4xl md:mx-auto">
      <nuxt />
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
export default {
  components: { Navbar },
}
</script>

<style lang="scss">
.light-mode {
  // $g-color-1: #ffe7d6;
  // $g-color-2: #f2f7ff;

  $g-color-1: #ced8fd;
  $g-color-2: #ffffff;

  background: radial-gradient($g-color-1, $g-color-2);
}

.dark-mode {
  $g-color-1: #2c313a;
  $g-color-2: #2b3546;

  background: radial-gradient($g-color-1, $g-color-2);
}
</style>
