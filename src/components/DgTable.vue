<template lang="pug">
.dg-table
  table
    thead: tr
      th
      th.header.header--expandable(v-for="header in headers", :class="'header--' + header") {{ header | capitalize }}
    tbody
      tr(v-for="(record, index) in sortedRecords")
        td.cell.cell--group(v-if="isfirstOfDateGroup(index)", :rowspan="getNumOfDateGroupByIndex(index)")
          span.cell-content {{record['date']}}
        td.cell(v-for="header in headers", :class="'cell--' + header" )
          span.cell-content(v-if="isCurrency(header)") {{record[header] | toCurrency}}
          span.cell-content(v-else) {{record[header]}}
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import _ from 'lodash'
import { records } from '../data.json'
import { toCurrency, toMMMMYYYY, capitalize } from 'utils/filters'

Vue.filter('toCurrency', toCurrency)
Vue.filter('toMMMMYYYY', toMMMMYYYY)
Vue.filter('capitalize', capitalize)

export default {
  data: () => ({
    headers: ['customer', 'company', 'contact', 'address', 'revenue', 'VAT', 'totalPrice', 'status'],
    records: records
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
    }
  }
}

</script>

<style lang="sass" scoped>
@import "../sass/variables"
@import "../sass/utils"

table
  table-layout: fixed
  width: 75%
  margin: 0 auto
  border-collapse: collapse
  text-align: left

.header
  border: 1px solid $border-color
  padding: $cell-padding
  background: $hover-color

.header--customer
  background: none

.header--company
  width: fitted-cell-width(7)

.header--contact
  width: fitted-cell-width(7)

.header--address
  width: 16em

.header--revenue
  width: 5em

.header--VAT
  width: 5em

.header--totalPrice
  width: fitted-cell-width(10)

.header--status
  width: fitted-cell-width(7)

$arrow-size: 8px
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

.cell--group
  width: 20px
  font-weight: bold
  background: $hover-color

.cell--customer
  background: $hover-color


</style>
