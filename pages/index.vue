<template>
  <main class="wrapper" role="main">
    <IndexHeader />
    <IndexBody />
  </main>
</template>

<script>
import IndexHeader from '~/components/index/index-header.vue'
import IndexBody from '~/components/index/index-body.vue'

export default {
  components: {
    IndexHeader,
    IndexBody
  }
}
</script>
