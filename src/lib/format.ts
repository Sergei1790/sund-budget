export default function formatCurrency(amount: number, locale:string = 'uk-UA') {
  return new Intl.NumberFormat(locale, {style: 'currency', currency: 'UAH'}).format(amount)
}