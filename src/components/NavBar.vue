<template lang="pug">
nav
  img.logo(src="../assets/logo.png")
  ul.menu
    li.item.user(v-if="name"): a(href="#") {{ name }}
    li.item.icon: a(href="#"): icon(symbol="gear")
    li.item.icon: a(href="#"): icon(symbol="power")
    li.item.icon: a(href="https://github.com/LucienLee/vue-data-grid"): icon(symbol="github")
</template>

<script>
import Icon from 'components/Icon'

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
  display: flex
  align-items: center
  position: fixed
  top: 0
  z-index: $nav-index
  width: 100%
  height: $nav-height
  background: $primary-color

.logo
  width: 72px
  margin: 0 1em

.menu
  position: absolute
  right: 2em
  top: 0
  bottom: 0
  margin: 0
  list-style: none

.user
  line-height: $nav-height

.item
  display: inline-block
  vertical-align: middle
  margin: 0 0.5em
  color: #fff
  a
    color: inherit

.icon
  width: 1.6em
  height: 1.6em
</style>
