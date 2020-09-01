<template>
  <div class="w-full min-h-screen">
    <div class="max-w-6xl mx-auto">
      <Navbar />

      <div class="w-full h-full flex justify-center px-4">
        <div
          class="w-full md:w-2/5 bg-white dark:bg-dark-bg rounded-lg mt-4 md:mt-8 p-4"
        >
          <nuxt />
        </div>
      </div>
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
