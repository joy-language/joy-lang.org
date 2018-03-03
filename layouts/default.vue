<template>
  <div class="container" lang="en" v-once>
    <BaseNavigation />
    <nuxt />
    <BaseFooter />
  </div>
</template>

<script>
import BaseNavigation from '~/components/base-navigation.vue'
import BaseFooter from '~/components/base-footer.vue'

export default {
  components: {
    BaseNavigation,
    BaseFooter
  }
}
</script>

<style src="assets/main.css">
</style>
