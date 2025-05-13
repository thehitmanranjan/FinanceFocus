// Format currency for display
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format percentage for display
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
}

// Format transaction amount with + or - prefix
export function formatTransactionAmount(amount: number, type: string): string {
  const formattedAmount = formatCurrency(Math.abs(amount));
  return type === "income" ? `+${formattedAmount}` : `-${formattedAmount}`;
}

// Calculate percentage
export function getPercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}