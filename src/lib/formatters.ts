export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return '£0.00'
  }
  return `£${value.toFixed(2)}`
}

export function formatKWh(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return '0.000 kWh'
  }
  return `${value.toFixed(3)} kWh`
}

export function formatPercentage(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return '0.0%'
  }
  return `${value.toFixed(1)}%`
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export function formatCarbon(kg: number | undefined | null): string {
  if (kg === undefined || kg === null || isNaN(kg)) {
    return '0.0 kg CO₂'
  }
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} tonnes CO₂`
  }
  return `${kg.toFixed(1)} kg CO₂`
}
