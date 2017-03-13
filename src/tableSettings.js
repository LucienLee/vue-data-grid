/**
 * Table Data and Interaction Settings
 * ---
 * attributes: the attributes showed on the table, whose the boolean values determind whether showing on the table at first.
 * expandables: the data of the attributes could be expand when clicking.
 * interactables: the data of attributes have actions.
 * currencies: the data of the attributes should be transformed to currency format.
 * hasDetails: the data of the attributes have more detail, such as google map link.
 * filterables: the attributes could be filtered.
 * omitOnMneu: the attributes not used on the context menu.
 */

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
