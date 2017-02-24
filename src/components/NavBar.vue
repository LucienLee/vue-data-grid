<template lang="pug">
nav
  ul.menu
    li.item.user: a(href="#") {{ name }}
    li.item.icon: a(href="#"): icon(symbol="gear")
    li.item.icon: a(href="#"): icon(symbol="power")
</template>

<script>
import Icon from 'components/icon'

export default {
  props: {
    name: String
  },
  components: {
    Icon
  }
}

</script>

<style lang="sass" scoped>
@import "../sass/variables"

nav
  position: relative
  width: 100%
  height: $nav-height
  background: $primary-color

.menu
  position: absolute
  right: 2em
  top: 0
  bottom: 0
  list-style: none
  margin: 0

.user
  line-height: $nav-height

.item
  display: inline-block
  vertical-align: middle
  color: #fff
  margin: 0 0.5em
  a
    color: inherit

.icon
  width: 1.6em
  height: 1.6em
</style>
