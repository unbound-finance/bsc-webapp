<template>
  <Earn />
</template>

<script>
import Earn from '@/components/screens/Earn'
export default {
  layout: 'default',
  middleware: 'isAuthenticated',
  components: {
    Earn,
  },
}
</script>
