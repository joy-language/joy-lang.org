<template>
  <main>
    <CSources />
    <JoyLibraries style="margin-top: 3vh;" />
  </main>
</template>

<script>
import CSources from '~/components/libraries-and-c-sources/c-sources.vue'
import JoyLibraries from '~/components/libraries-and-c-sources/joy-libraries.vue'

export default {
  components: {
    CSources,
    JoyLibraries
  }
}
</script>