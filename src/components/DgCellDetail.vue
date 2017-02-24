<template lang="pug">
.dg-cell-detail
  .panel(@click.stop.self="onClick")
    slot
</template>

<script>
export default {
  methods: {
    onClick () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../sass/variables'

.dg-cell-detail
  position: absolute
  z-index: 100
  top: 0
  left: 0
  right: 0

.panel
  display: inline-block
  box-sizing: border-box
  width: 100%
  list-style: none
  margin: 0
  padding: 0 $cell-padding $cell-padding $cell-padding
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
