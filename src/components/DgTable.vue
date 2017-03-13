<template lang="pug">
.dg-table
  table(@click="closeMenu")
    thead
      transition-group(name="fade", tag="tr")
        th.header--date(key="header--date")
        th.header(v-for="attribute in filteredAttributes",
          :key="'header--'+attribute", :class="headerClass(attribute)",
          @click.self="onHeaderClick(attribute, $event)", @contextmenu.prevent="openMenu") {{ attribute | capitalize }}
          dg-filter(v-if="filterables.includes(attribute)", :isActive="activefilterables[attribute]",
            :bound="filterBounds[attribute]", :range="filterRanges[attribute]",
            @change="onFilterMenuChange(attribute, $event)", @sort="onSort(attribute, $event)", @range="onRange(attribute, $event)")
    transition-group(name="fade", tag="tbody")
      transition-group(v-for="(record, index) in sortedRecords", :key="index", name="fade", tag="tr")
        td.cell.cell--placeholder(key="cell--date", :class="{'is-visible': isfirstOfDateGroup(index)}")
          span.cell-content.forgedCell(:style="getHeightStyleByDate(record['date'])") {{ record['date'] | toMMMMYYYY }}
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
import { toCurrency, toMMMMYYYY, capitalize, toGMapQuery, toUpperMagnitude } from 'utils/filters'
import { normPagePosInEvent } from 'utils/mouse'
import DgMenu from 'components/DgMenu'
import DgCellMenu from 'components/DgCellMenu'
import DgCellDetail from 'components/DgCellDetail'
import DgFilter from 'components/DgFilter'

Vue.filter('toCurrency', toCurrency)
Vue.filter('toMMMMYYYY', toMMMMYYYY)
Vue.filter('capitalize', capitalize)

export default {
  components: {
    DgMenu,
    DgCellMenu,
    DgCellDetail,
    DgFilter
  },
  data () {
    let sortOrders = {}
    let filterRanges = {}
    let filterBounds = {}
    let activefilterables = {}
    settings.filterables.forEach((attribute) => {
      activefilterables[attribute] = false
      sortOrders[attribute] = 0
      filterBounds[attribute] = [0, toUpperMagnitude(records.reduce((acc, cur) => {
        return cur[attribute] > acc ? cur[attribute] : acc
      }, 0))]
      filterRanges[attribute] = _.clone(filterBounds[attribute])
    })
    return {
      records: records,
      attributes: settings.attributes,
      expandables: settings.expandables,
      interactables: settings.interactables,
      currencies: settings.currencies,
      hasDetails: settings.hasDetails,
      filterables: settings.filterables,
      omitOnMenu: settings.omitOnMenu,
      sortAttribute: '',
      sortOrders: sortOrders,
      filterRanges: filterRanges,
      filterBounds: filterBounds,
      activefilterables: activefilterables,
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
      const {sortAttribute, sortOrders, filterRanges, records} = this
      const order = sortOrders[sortAttribute] || 0

      // Filtered fitted in ranges records
      const filteredRecords = records.filter((record) => {
        return Object.keys(filterRanges).reduce((acc, key) => {
          return filterRanges[key][0] <= record[key] && filterRanges[key][1] >= record[key]
        }, true)
      })

      if (sortAttribute) {
        // Sort by sortAttribute locally and by date globally
        return filteredRecords.slice().sort((a, b) => {
          const aSort = a[sortAttribute]
          const bSort = b[sortAttribute]
          const localOrder = (aSort === bSort ? 0 : aSort > bSort ? 1 : -1) * order
          const aDate = moment(a.date.replace(/(-\d+)$/, ''))
          const bDate = moment(b.date.replace(/(-\d+)$/, ''))
          return moment(aDate).isSame(bDate) ? localOrder : moment(aDate).isBefore(bDate) ? -1 : 1
        })
      } else {
        // Only sort by date
        return filteredRecords.slice().sort((a, b) => {
          return moment(a.date).isBefore(b.date) ? -1 : 1
        })
      }
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
    getHeightStyleByDate (date) {
      return {
        height: `calc(${this.numOfDateGroup[toMMMMYYYY(date)] * 100}% + 1px)` // 1px for cell collapsed
      }
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
      this.closeFilterMenu()
      this.expandCol(attribute, event)
    },
    onCellClick (attribute, id, event) {
      this.closeFilterMenu()
      // behave as same as clicking header if it's expanable but not expanded yet
      if (this.expandables.includes(attribute) && this.expanding !== attribute) return this.onHeaderClick(attribute, event)
      // reset when clicking the same cell
      if (this.focusCell.recordId === id && this.focusCell.attribute === attribute) return this.clearFocusCell()

      this.focusCell.recordId = id
      this.focusCell.attribute = attribute
      this.expandCol(attribute, event)
    },
    openMenu (event) {
      const rect = this.$el.getBoundingClientRect()
      const OFFSET = 1 // show menu with 1px offset to mouse
      event = normPagePosInEvent(event)

      this.menuPos.x = event.pageX - rect.left + OFFSET
      this.menuPos.y = event.pageY - rect.top + OFFSET
      this.clearFocusCell()
      this.closeFilterMenu()
      this.showMenu = true
    },
    closeMenu () {
      this.showMenu = false
    },
    clearFocusCell () {
      this.focusCell.recordId = ''
      this.focusCell.attribute = ''
    },
    closeFilterMenu () {
      for (let attribute in this.activefilterables) this.activefilterables[attribute] = false
    },
    onSort (attribute, order) {
      this.sortAttribute = order ? attribute : ''
      this.sortOrders[attribute] = order
    },
    onRange (attribute, range) {
      this.filterRanges[attribute] = range
    },
    onFilterMenuChange (attribute, active) {
      this.clearFocusCell()
      this.activefilterables[attribute] = active
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

.cell--placeholder
  border: none
  visibility: hidden

.cell--customer
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

.forgedCell
  display: flex
  align-items: center
  position: absolute
  top: 0
  padding-left: $cell-padding
  border: 1px solid $border-color
  border-right: none
  background: $hover-color
  font-weight: 900
  transition: $fast height

</style>
