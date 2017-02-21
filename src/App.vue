<template lang="pug">
#app
  dg-table
</template>

<script>
import DgTable from 'components/DgTable'

export default {
  name: 'app',
  components: {
    DgTable
  }
}
</script>

<style lang="sass">
@import "./sass/variables"

body
  background: $bg-color
  color: $text-color

#app
  font-family: HelveticaNeue, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  margin-top: 60px
</style>
