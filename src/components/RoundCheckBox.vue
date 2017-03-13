<template lang="pug">
label.roundCheckBox(:class="{'roundCheckBox--block': isBlock}")
  input(type="checkbox", :value="value", :checked="value", @change="onChange")
  span.roundBox(:class="{'roundBox--checked': value}")
  span.label {{label}}
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    isBlock: Boolean
  },
  methods: {
    onChange (event) {
      this.$emit('input', event.target.checked)
    }
  }
}
</script>

<style lang="sass">
@import "../sass/variables"

$radio-size: 0.8em
$shrink-factor: 0.6
$border-color: #395374

.roundCheckBox
  cursor: pointer
  padding: 0.25em 0

  &:hover .label
    color: #fff

.roundCheckBox--block
  display: block

.roundCheckBox > input[type='checkbox']
  position: absolute
  clip: rect(0,0,0,0)
  pointer-events: none

.roundBox
  position: relative
  display: inline-block
  vertical-align: middle
  width: $radio-size
  height: $radio-size
  border: 2px solid $border-color
  border-radius: 50%

// Selected Dot
.roundBox--checked::after
    content: ''
    position: absolute
    top: $radio-size * (1 - $shrink-factor) / 2
    left: $radio-size * (1 - $shrink-factor) / 2
    background: $primary-color
    width: $radio-size * $shrink-factor
    height: $radio-size * $shrink-factor
    border-radius: 50%

.label
  color: $secondary-color
  font-weight: 900
  padding: 0 1em
  vertical-align: middle
  user-select: none
</style>
