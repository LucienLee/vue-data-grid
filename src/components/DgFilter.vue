<template lang="pug">
.filter(:class="{'filter--active': isActive}")
  img.square(src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7")
  .button(@click="isActive = !isActive")
    icon.icon--filter(symbol="filter")
  transition(name="fade")
    .panel(v-if="isActive")
      .control
        p.control-label SORT
        round-checkbox.sortOption(v-for="(val, key) in sort", :label="key", :value="sort[key]", :isBlock="false", @input="onCheck(key, $event)")
      .control
        p.control-label LIMIT RANGE

</template>

<script>
import RoundCheckbox from 'components/RoundCheckbox'
import Icon from 'components/Icon'

export default {
  props: {
  },
  data () {
    return {
      isActive: false,
      sort: {
        ascending: false,
        descending: false
      }
    }
  },
  components: {
    RoundCheckbox,
    Icon
  },
  methods: {
    onCheck (key, value) {
      console.log(key, value)
      if (value) {
        for (let prop in this.sort) {
          if (prop !== key) this.$emit('input', {key, value: false})
        }
      }
      this.$emit('input', {key: key, value: value})
    }
  }
}

</script>

<style lang="sass" scoped>
@import "../sass/variables"
@import "../sass/utils"
@import "../sass/transition"

.filter
  position: absolute
  top: 0
  right: 0
  height: 100%
  z-index: $popup-index
  cursor: pointer
  transition: background $medium

.filter--active
  background: $cell-color
  box-shadow: $half-shadow

.button
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  text-align: center

.square
  display: block
  height: 100%
  width: auto

.icon--filter
  width: 1.6em
  height: 1.6em
  margin-top: 50%
  transform: translateY(-50%)

.panel
  position: absolute
  top: 100%
  right: 0
  width: 240px
  padding: 0.5em 1em
  background: $cell-color
  box-shadow: $shadow

.control
  @extend %clearfix
  padding: 0.5em 0

.control-label
  margin: 0.5em 0
  font-weight: 900

.sortOption
  &:first-of-type
    float: left
  &:last-of-type
    float: right
</style>
