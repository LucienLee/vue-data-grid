import moment from 'moment'

function toCurrency (n) {
  const num = n.toString().split('.')
  const decimal = num[1] ? `.${num[1]}` : ''
  return '$' + num[0].replace(/(\d{1,3})(?=(\d{3})+$)/g, '$1,') + decimal
}

function capitalize (text) {
  return text[0].toUpperCase() + text.slice(1)
}

function toMMMMYYYY (text) {
  return moment(text).format('MMMM  YYYY')
}

export {toCurrency, toMMMMYYYY, capitalize}
