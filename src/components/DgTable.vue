<template lang="pug">
  table
    thead: tr
      th.header--date
      th.header(v-for="header in headers",
        :class="['header--'+header, headerClass(header)]",
        @click="onExpand(header)") {{ header | capitalize }}
    tbody
      tr(v-for="(record, index) in sortedRecords")
        td.cell.cell--date(v-if="isfirstOfDateGroup(index)", :rowspan="getNumOfDateGroupByIndex(index)")
          span.cell-content {{record['date']}}
        td.cell(v-for="header in headers", :class="'cell--' + header", @click="onExpand(header)")
          span.cell-content(v-if="isCurrency(header)") {{record[header] | toCurrency}}
          span.cell-content(v-else) {{record[header]}}
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import _ from 'lodash'
import { TweenMax, Linear } from 'gsap'
import { records } from '../data.json'
import { toCurrency, toMMMMYYYY, capitalize } from 'utils/filters'

Vue.filter('toCurrency', toCurrency)
Vue.filter('toMMMMYYYY', toMMMMYYYY)
Vue.filter('capitalize', capitalize)

export default {
  data: () => ({
    headers: ['customer', 'company', 'contact', 'address', 'revenue', 'VAT', 'totalPrice', 'status'],
    expandables: ['company', 'contact', 'address'],
    records: records,
    expanding: '',
    lastExpanded: ''
  }),
  computed: {
    sortedRecords () {
      return this.records.sort((a, b) => {
        return moment(a.date).isBefore(b.date) ? -1 : 1
      })
    },
    numOfDateGroup () {
      const dates = this.sortedRecords.map(el => el.date)
      return _.countBy(dates, toMMMMYYYY)
    },
    maxLenOfCols () {
      return this.records.reduce((acc, record) => {
        Object.keys(record).forEach((prop) => {
          if (acc[prop] < record[prop].length) {
            acc[prop] = record[prop].length
          }
        })
        return acc
      }, this.headers.reduce((acc, prop) => {
        acc[prop] = 0
        return acc
      }, {}))
    }
  },
  methods: {
    isCurrency (str) {
      return ['revenue', 'VAT', 'totalPrice'].includes(str)
    },
    isfirstOfDateGroup (index) {
      return index === 0
        ? true
        : toMMMMYYYY(this.sortedRecords[index].date) !== toMMMMYYYY(this.sortedRecords[index - 1].date)
    },
    getNumOfDateGroupByIndex (index) {
      return this.numOfDateGroup[toMMMMYYYY(this.sortedRecords[index].date)]
    },
    headerClass (header) {
      return {
        'header--expandable': this.expanding !== header && this.expandables.includes(header)
      }
    },
    onExpand (header) {
      if (this.expandables.includes(header) && header !== this.expanding) {
        this.expanding = header
        this.lastExpanded && this.lastExpanded.reverse()

        const col = document.getElementsByClassName('header--' + header)[0]
        const targetWidth = this.maxLenOfCols[header] / 2 + 1 // 1 for cell padding

        this.lastExpanded = TweenMax.to(col, 0.2, {
          width: `${targetWidth}em`,
          ease: Linear.easeNone
        })
      }
    }
  }
}

</script>

<style lang="sass" scoped>
@import "../sass/variables"
@import "../sass/utils"

$fixed-cell-width: 10em
$arrow-size: 8px

table
  table-layout: fixed
  width: 80%
  margin: 0 auto
  border-collapse: collapse
  text-align: left

.header
  width: fitted-cell-width(8)
  padding: $cell-padding
  border: 1px solid $border-color
  background: $hover-color

.header--date
  border: none
  width: $fixed-cell-width

.header--customer
  background: none
  width: $fixed-cell-width

.header--expandable
  position: relative
  &::after
    content: ''
    position: absolute
    right: 0
    bottom: 0
    border-style: solid
    border-width: 0 0 $arrow-size $arrow-size
    border-color: transparent transparent $primary-color transparent

.cell
  border: 1px solid $border-color
  white-space: nowrap

  &:hover
    background: $hover-color

.cell-content
  display: inline-block
  box-sizing: border-box
  width: 100%
  border-left: $cell-padding solid transparent
  border-right: $cell-padding solid transparent
  padding: $cell-padding 0
  overflow: hidden
  cursor: pointer

.cell--date
  font-weight: bold
  background: $hover-color

.cell--customer
  background: $hover-color


</style>
