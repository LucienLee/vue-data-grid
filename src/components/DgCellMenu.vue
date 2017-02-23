<template lang="pug">
.dg-cell-menu
  ul.panel
    li.item: a(src="#") Compare with
    li.item: a(src="#") Edit
    li.item: a(src="#") View Revisions
</template>

<script>
export default {

}

</script>

<style lang="sass">
@import '../sass/variables'

.dg-cell-menu
  position: absolute
  z-index: 100
  top: 100%
  left: 0

.panel
  display: inline-block
  list-style: none
  margin: 0
  padding: 0.5em 2em 0.5em 1em
  background: $cell-color
  box-shadow: $shadow

.item
  color: $secondary-color
  font-weight: 900
  margin: 1.2em
  vertical-align: middle
  user-select: none
  cursor: pointer

  &:hover
    color: #fff
</style>
