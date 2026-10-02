/**
 * Formats a number according to the Indian Rupee numbering system (e.g. ₹1,24,500)
 */
export const formatINR = (amount: number, symbol = '₹'): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${symbol}0`;
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  // Format with Indian numbering format (Lakhs and Crores)
  const parts = absAmount.toFixed(absAmount % 1 === 0 ? 0 : 2).split('.');
  let integerPart = parts[0];
  const decimalPart = parts.length > 1 ? `.${parts[1]}` : '';

  // Indian comma grouping: 3 digits from right, then groups of 2
  if (integerPart.length > 3) {
    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);
    integerPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }

  return `${isNegative ? '-' : ''}${symbol}${integerPart}${decimalPart}`;
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(d.getDate()).padStart(2, '0');
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day} ${month} ${year}`;
};

export const getMonthName = (monthNumber: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthNumber - 1] || '';
};
