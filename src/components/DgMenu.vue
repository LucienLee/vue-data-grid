<template lang="pug">
.dg-menu(:style="posStyle")
  .panel
    .option(v-for="(value, key) in options", v-if="!shouldBeEscaped(key)")
      round-check-box(:label="key | capitalize", v-model="options[key]", :isBlock="true")
</template>

<script>
import RoundCheckBox from 'components/RoundCheckBox'
export default {
  props: {
    position: Object,
    options: Object,
    escaped: Array
  },
  components: {
    RoundCheckBox
  },
  computed: {
    posStyle () {
      return {
        left: `${this.position.x}px`,
        top: `${this.position.y}px`
      }
    }
  },
  methods: {
    shouldBeEscaped (option) {
      return this.escaped ? this.escaped.includes(option) : false
    }
  }
}

</script>

<style lang="sass" scoped>
@import "../sass/variables"
.dg-menu
  position: absolute

.panel
  background: $menu-color
  padding: 0.5em 2em
  box-shadow: $shadow

.option
  margin: 1em 0

</style>
