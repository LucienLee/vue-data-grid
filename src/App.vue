<template lang="pug">
#app
  nav-bar
  dg-table.table
</template>

<script>
import DgTable from 'components/DgTable'
import NavBar from 'components/NavBar'

export default {
  name: 'app',
  components: {
    NavBar,
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
  margin: 0

#app
  font-family: Lato, Arial, sans-serif
  font-weight: 700
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale

.table
  margin-top: 60px

a
  color: $primary-color
  text-decoration: none
</style>
