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
@import url('https://fonts.googleapis.com/css?family=Lato:700,900')
@import "./sass/variables"

body
  font-size: 12px
  background: $bg-color
  color: $text-color

#app
  font-family: Lato, Arial, sans-serif
  font-weight: 700
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  margin-top: 60px
</style>
