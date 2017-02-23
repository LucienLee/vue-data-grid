<template lang="pug">
.dg-table
  table(@click="closeMenu")
    thead
      transition-group(name="fade", tag="tr")
        th.header--date(key="header-date")
        th.header(v-for="attribute in filteredAttributes",
          :key="'header--'+attribute", :class="headerClass(attribute)",
          @click="onHeaderClick(attribute, $event)", @contextmenu.prevent="openMenu") {{ attribute | capitalize }}
          dg-filter(v-if="filterables.includes(attribute)")
    tbody
      transition-group(v-for="(record, index) in sortedRecords", name="fade", tag="tr")
        td.cell.cell--date(v-if="isfirstOfDateGroup(index)", key="cell-date", :rowspan="getNumOfDateGroupByIndex(index)")
          span.cell-content {{ record['date'] | toMMMMYYYY }}
        td.cell(v-for="attribute in filteredAttributes",
          :key="'cell--' + attribute", :class="cellClass(attribute, record['uid'])")
          transition(name="fade")
            dg-cell-menu(v-if="interactables.includes(attribute) && focusCell.recordId === record['uid'] && focusCell.attribute === attribute")
            dg-cell-detail(v-if="hasDetails.includes(attribute) && focusCell.recordId === record['uid'] && focusCell.attribute === attribute", @click="clearFocusCell")
              p {{ record[attribute] }}
              a(:href="getAddressLink(record[attribute])", target="_blank") View in Google Maps
          span.cell-content(v-if="isCurrency(attribute)", @click="onCellClick(attribute, record['uid'], $event)") {{ record[attribute] | toCurrency }}
          span.cell-content(v-else, @click="onCellClick(attribute, record['uid'], $event)") {{ record[attribute] }}
  transition(name="fade")
    dg-menu(v-if="showMenu", :options="attributes", :escaped="omitOnMenu", :position="menuPos")
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import _ from 'lodash'
import { TweenMax, Linear } from 'gsap'
import { records } from '../data.json'
import settings from '../tableSettings'
import { toCurrency, toMMMMYYYY, capitalize, toGMapQuery } from 'utils/filters'
import { offsets } from 'utils/mouse'
import DgMenu from 'components/DgMenu'
import DgCellMenu from 'components/DgCellMenu'
import DgCellDetail from 'components/DgCellDetail'
import DgFilter from 'components/DgFilter'

Vue.filter('toCurrency', toCurrency)
Vue.filter('toMMMMYYYY', toMMMMYYYY)
Vue.filter('capitalize', capitalize)

let conditionsStore = settings.filterables.reduce((acc, cur) => {
  acc[cur] = {
    sort: '',
    range: []
  }
  return acc
}, {})

export default {
  components: {
    DgMenu,
    DgCellMenu,
    DgCellDetail,
    DgFilter
  },
  data () {
    return {
      attributes: settings.attributes,
      expandables: settings.expandables,
      interactables: settings.interactables,
      currencies: settings.currencies,
      hasDetails: settings.hasDetails,
      filterables: settings.filterables,
      conditionsOfFilterables: conditionsStore,
      omitOnMenu: ['customer'],
      records: records,
      expanding: '',
      focusCell: {
        recordId: '',
        attribute: ''
      },
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
      return this.currencies.includes(str)
    },
    isfirstOfDateGroup (index) {
      return index === 0
        ? true
        : toMMMMYYYY(this.sortedRecords[index].date) !== toMMMMYYYY(this.sortedRecords[index - 1].date)
    },
    getNumOfDateGroupByIndex (index) {
      return this.numOfDateGroup[toMMMMYYYY(this.sortedRecords[index].date)]
    },
    getAddressLink (text) {
      return toGMapQuery(text)
    },
    headerClass (attribute) {
      return [`header--${attribute}`,
        {'header--expandable': this.expanding !== attribute && this.expandables.includes(attribute)}]
    },
    cellClass (attribute, recordId) {
      return [`cell--${attribute}`,
        {'cell--focus': (this.interactables.includes(attribute) || this.hasDetails.includes(attribute)) &&
          this.focusCell.recordId === recordId && this.focusCell.attribute === attribute}]
    },
    expandCol (attribute, event) {
      if (this.showMenu) return
      const isClickedHeader = event.target.classList.contains('header')
      const isClickedSame = this.expanding === attribute
      const isExpandables = this.expandables.includes(attribute)

      // Collapsing when click the same one's header or not expandable one
      if (isClickedSame && isClickedHeader || !isExpandables) {
        this.expanding = ''
        this.lastExpanded && this.lastExpanded.reverse()
      }

      // Expanding when click not the same expandable one
      if (isExpandables && !isClickedSame) {
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
    onHeaderClick (attribute, event) {
      this.clearFocusCell()
      this.expandCol(attribute, event)
    },
    onCellClick (attribute, id, event) {
      // behave as same as clicking header if it's expanable but not expanded yet
      if (this.expandables.includes(attribute) && this.expanding !== attribute) return this.onHeaderClick(attribute, event)
      // reset when clicking the same cell
      if (this.focusCell.recordId === id && this.focusCell.attribute === attribute) return this.clearFocusCell()

      this.focusCell.recordId = id
      this.focusCell.attribute = attribute
      this.expandCol(attribute, event)
    },
    openMenu (event) {
      const {x, y} = offsets(event)
      this.menuPos.x = x + event.target.offsetLeft
      this.menuPos.y = y + event.target.offsetTop
      this.clearFocusCell()
      this.showMenu = true
    },
    closeMenu () {
      this.showMenu = false
    },
    clearFocusCell () {
      this.focusCell.recordId = ''
      this.focusCell.attribute = ''
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
  position: relative
  box-sizing: border-box
  border: 1px solid $border-color
  white-space: nowrap
  padding: 0
  transition: background $medium

  &:hover
    background: $hover-color

.cell--focus, .cell--focus:hover
  background: $cell-color
  box-shadow: $half-shadow


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
