<template lang="pug">
svg.Icon(:class="iconClass")
  use(v-bind:xlink:href="'#' + symbol")
</template>

<script>
// require all icons in the directory
const _require = require.context('../assets/icons', true, /\.svg$/)
_require.keys().forEach(key => _require(key))

export default {
  props: [
    'symbol',
    'className'
  ],
  computed: {
    iconClass () {
      const { symbol, className } = this
      return className ? `icon-${symbol} ${className}` : `icon-${symbol}`
    }
  }
}
</script>

<style lang="sass">
.Icon
  width: 100%
  height: 100%
  fill: currentColor
  overflow: hidden
</style>
