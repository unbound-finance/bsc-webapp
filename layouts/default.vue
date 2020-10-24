<template>
  <div class="w-full min-h-screen">
    <Navbar />

    <div class="max-w-6xl mx-auto">
      <div class="w-full flex justify-center px-4">
        <nuxt />
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
  // $g-color-1: #ffe7d6;
  // $g-color-2: #f2f7ff;

  $g-color-1: #26bcb424;
  $g-color-2: #ffffff;

  background: radial-gradient($g-color-1, $g-color-2);
}

.dark-mode {
  $g-color-1: #2b3546;
  $g-color-2: #2c2f36;

  background: radial-gradient($g-color-1, $g-color-2);

  .bottom-container {
    background: rgba(0, 0, 0, 0.1);
  }

  .main_container {
    background: rgb(33, 36, 41);
  }
}
</style>
