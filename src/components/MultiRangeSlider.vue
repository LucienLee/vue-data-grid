<template lang="pug">
.multiRangeSlider
  input.multiRange.multiRange--min(name="min", type="range", :min="min", :max="max", :value="value[0]", @input="onChange")
  input.multiRange.multiRange--max(name="max", type="range", :min="min", :max="max", :value="value[1]", @input="onChange")
  .rangeBar(:style="barLenStyle")
  .rangeLabel
    label.label.label--min {{ toNumberAbbr(value[0]) }}
    label.label.label--max {{ toNumberAbbr(value[1]) }}
</template>

<script>
const rangeColor = '#15a4fa'

export default {
  props: {
    min: Number,
    max: Number,
    value: Array
  },
  computed: {
    rangePercentage () {
      return {
        start: `${this.value[0] / (this.max - this.min) * 100}%`,
        end: `${this.value[1] / (this.max - this.min) * 100}%`
      }
    },
    barLenStyle () {
      return {background: `linear-gradient(to right, transparent ${this.rangePercentage.start}, ${rangeColor} ${this.rangePercentage.start}, ${rangeColor} ${this.rangePercentage.end}, transparent ${this.rangePercentage.end}) no-repeat`}
    }
  },
  methods: {
    onChange (event) {
      let result = event.target.name === 'min'
        ? [Math.min(event.target.value, this.value[1] - 1), this.value[1]]
        : [this.value[0], Math.max(this.value[0] - 1, event.target.value)]
      this.$emit('input', result)
    },
    toNumberAbbr (num) {
      return num < 1000 ? num : `${Math.floor(num / 1000)}k`
    }
  }
}

</script>

<style lang="sass" scoped>
@import '../sass/variables'
@import '../sass/utils'

$track-color: $bg-color
$range-color: $primary-color
$knob-color: #fff
$knob-size: 16px

.multiRangeSlider
  position: relative
  width: 100%

=bar
  position: absolute
  top: $knob-size / 4
  width: 100%
  height: $knob-size / 2
  border-radius: $knob-size / 2
  pointer-events: none

=knob
  width: $knob-size
  height: $knob-size
  border-radius: 50%
  background: $knob-color
  cursor: pointer
  z-index: 3


.multiRange
  display: inline-block
  vertical-align: top
  width: 100%
  padding: 0
  margin: 0
  outline: none
  -webkit-appearance: none
  -moz-appearance: none
  background: none

  &::-webkit-slider-thumb
    position: relative
    -webkit-appearance: none
    -moz-appearance: none
    +knob

  &::-moz-range-thumb
    transform: scale(1)
    +knob

  &::-moz-focus-outer
    border: 0

  &::-moz-range-track
    +bar
    background: $track-color

  &::before
    content: ''
    +bar
    background: $track-color

.multiRange--min
  position: absolute

.multiRange--max
  position: relative

.rangeBar
  +bar
  z-index: 2

.rangeLabel
  @extend %clearfix

.label
  padding: 0.5em 0 0

.label--min
  float: left

.label--max
  float: right
</style>
