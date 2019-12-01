<template>
  <div class="home">
    <WatchingNow/>
    <Library/>
  </div>
</template>

<script>
import Library from '@/components/Library.vue'
import WatchingNow from '@/components/WatchingNow.vue'

export default {
  name: 'home',
  components: {
    Library,
    WatchingNow
  }
}
</script>
