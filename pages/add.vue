<template>
  <AddLiquidity />
</template>

<script>
import AddLiquidity from '@/components/screens/AddLiquidity'
export default {
  layout: 'default',
  middleware: 'isAuthenticated',
  components: {
    AddLiquidity,
  },
}
</script>
