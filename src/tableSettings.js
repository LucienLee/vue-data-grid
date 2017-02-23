export default {
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
  interactables: ['revenue', 'VAT', 'totalPrice'],
  currencies: ['revenue', 'VAT', 'totalPrice'],
  hasDetails: ['address'],
  filterables: ['VAT'],
  omitOnMenu: ['customer']
}
