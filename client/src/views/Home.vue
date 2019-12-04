<template>
  <div class="home">
    <WatchingNow/>
    <Library/>
  </div>
</template>

<script>
import Library from '@/components/Library.vue'
import WatchingNow from '@/components/WatchingNow.vue'

/**
 * Home component acts as parent component to the Library and Watching Now sections
 */
export default {
  name: 'home',
  components: {
    Library,
    WatchingNow
  }
}
</script>
