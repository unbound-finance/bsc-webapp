<template>
  <Unlock />
</template>

<script>
import Unlock from '@/components/screens/Unlock'
export default {
  layout: 'default',
  middleware: 'isAuthenticated',
  components: {
    Unlock,
  },
}
</script>
