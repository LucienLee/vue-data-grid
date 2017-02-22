<template lang="pug">
.dg-table
  table(@click="closeMenu")
    thead
      transition-group(name="fade", tag="tr")
        th.header--date(key="header-date")
        th.header(v-for="attribute in filteredAttributes",
          :key="'header--'+attribute", :class="['header--'+attribute, headerClass(attribute)]",
          @click="onExpand(attribute)", @contextmenu.prevent="openMenu") {{ attribute | capitalize }}
    tbody
      transition-group(v-for="(record, index) in sortedRecords", name="fade", tag="tr")
        td.cell.cell--date(v-if="isfirstOfDateGroup(index)", key="cell-date", :rowspan="getNumOfDateGroupByIndex(index)")
          span.cell-content {{ record['date'] | toMMMMYYYY }}
        td.cell(v-for="attribute in filteredAttributes", :key="'cell--' + attribute", :class="'cell--' + attribute"
          @click="onExpand(attribute)")
          span.cell-content(v-if="isCurrency(attribute)") {{ record[attribute] | toCurrency }}
          span.cell-content(v-else) {{ record[attribute] }}
  transition(name="fade")
    dg-menu(v-if="showMenu", :options="attributes", :escaped="omitOnMenu",:position="menuPos")
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import _ from 'lodash'
import { TweenMax, Linear } from 'gsap'
import { records } from '../data.json'
import { toCurrency, toMMMMYYYY, capitalize } from 'utils/filters'
import { offsets } from 'utils/mouse'
import DgMenu from 'components/DgMenu'

Vue.filter('toCurrency', toCurrency)
Vue.filter('toMMMMYYYY', toMMMMYYYY)
Vue.filter('capitalize', capitalize)

export default {
  components: {
    DgMenu
  },
  data () {
    return {
      attributes: {
        customer: true,
        company: true,
        contact: true,
        address: true,
        revenue: true,
        VAT: true,
        totalPrice: true,
        status: true
      },
      expandables: ['company', 'contact', 'address'],
      omitOnMenu: ['customer'],
      records: records,
      expanding: '',
      lastExpanded: '',
      showMenu: false,
      menuPos: {
        x: 0,
        y: 0
      }
    }
  },
  computed: {
    sortedRecords () {
      return this.records.sort((a, b) => {
        return moment(a.date).isBefore(b.date) ? -1 : 1
      })
    },
    filteredAttributes () {
      return Object.keys(this.attributes).filter((el) => {
        return this.attributes[el]
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
      }, Object.keys(this.attributes).reduce((acc, prop) => {
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
    headerClass (attribute) {
      return {
        'header--expandable': this.expanding !== attribute && this.expandables.includes(attribute)
      }
    },
    onExpand (attribute) {
      if (this.expandables.includes(attribute) && attribute !== this.expanding && !this.showMenu) {
        this.expanding = attribute
        this.lastExpanded && this.lastExpanded.reverse()

        const col = document.getElementsByClassName('header--' + attribute)[0]
        const targetWidth = this.maxLenOfCols[attribute] / 2 + 1 // 1 for cell padding

        this.lastExpanded = TweenMax.to(col, 0.2, {
          width: `${targetWidth}em`,
          ease: Linear.easeNone
        })
      }
    },
    openMenu (event) {
      const {x, y} = offsets(event)
      this.menuPos.x = x + event.target.offsetLeft
      this.menuPos.y = y + event.target.offsetTop
      this.showMenu = true
    },
    closeMenu () {
      this.showMenu = false
    }
  }
}

</script>

<style lang="sass" scoped>
@import "../sass/variables"
@import "../sass/utils"
@import "../sass/transition"

$fixed-cell-width: 10em
$arrow-size: 8px

.dg-table
  position: relative

table
  table-layout: fixed
  width: 80%
  margin: 0 auto
  border-collapse: collapse
  text-align: left

.header
  position: relative
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
  cursor: pointer

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
  font-weight: 900
  background: $hover-color

.cell--customer
  background: $hover-color


</style>
