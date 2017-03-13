<template lang="pug">
.dg-cell-menu
  ul.panel
    li.item(v-for="item in items")
      a.button(href="#")
        span.icon(:class="item.class"): icon(:symbol="item.symbol")
        span.label {{item.label}}
</template>

<script>
import Icon from 'components/Icon'

export default {
  components: {
    Icon
  },
  data () {
    return {
      items: [
        {
          symbol: 'compare',
          label: 'Compare with',
          class: 'icon--compare'
        }, {
          symbol: 'edit',
          label: 'Edit'
        }, {
          symbol: 'revision',
          label: 'View Revisions'
        }
      ]
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../sass/variables'

$icon-size: 1.6em
$icon-rect-size: 1.8em

.dg-cell-menu
  position: absolute
  z-index: $popup-index
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
  margin: 1.2em
  vertical-align: middle
  user-select: none
  cursor: pointer

.icon
  display: inline-block
  vertical-align: middle
  width: $icon-size
  height: $icon-size

.icon--compare
  width: $icon-rect-size
  height: $icon-rect-size
  margin: ($icon-size - $icon-rect-size) / 2

.label
  display: inline-block
  vertical-align: middle

.button
  color: $secondary-color
  font-weight: 900
  &:hover .label
    color: #fff
</style>
