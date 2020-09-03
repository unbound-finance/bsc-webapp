<template>
  <Mint />
</template>

<script>
import Mint from '@/components/screens/Mint'
export default {
  layout: 'default',
  middleware: 'isAuthenticated',
  components: {
    Mint,
  },
}
</script>
