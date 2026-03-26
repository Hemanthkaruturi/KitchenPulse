import { InventoryItem } from './types'

export const getRemainingPercentage = (item: InventoryItem) => {
  return ((item.totalAmount - item.usedAmount) / item.totalAmount) * 100
}

export const getRemainingAmount = (item: InventoryItem) => {
  return item.totalAmount - item.usedAmount
}

export const isLowStock = (item: InventoryItem) => {
  return getRemainingPercentage(item) <= item.lowStockThreshold
}

export const getPricePerUnit = (item: InventoryItem) => {
  return item.price / item.totalAmount
}

export const getRemainingValue = (item: InventoryItem) => {
  return (getRemainingAmount(item) / item.totalAmount) * item.price
}

export const getUnitLabel = (unit: string) => {
  switch (unit) {
    case 'g': return 'Grams'
    case 'kg': return 'Kilograms'
    case 'l': return 'Liters'
    case 'ml': return 'Milliliters'
    case 'pcs': return 'Pieces'
    default: return ''
  }
}
