export default function formatCurrency(amount: number, locale: string = 'uk-UA') {
    const num = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
    return `${num} ₴`;
}