export interface User {
  id: string
  username: string
  password: string
  name: string
}

export interface Kitchen {
  id: string
  name: string
  ownerId: string
  memberIds: string[]
}

export interface Category {
  id: string
  kitchenId: string
  name: string
}

export interface Location {
  id: string
  kitchenId: string
  name: string
}

export interface ItemMaster {
  id: string
  kitchenId: string
  name: string
  categoryId: string
  defaultUnit: 'g' | 'kg' | 'l' | 'ml' | 'pcs'
  imageUrl?: string
  comments?: string
}

export interface InventoryItem {
  id: string
  kitchenId: string
  itemMasterId: string
  locationId: string
  totalAmount: number
  usedAmount: number
  purchaseDate: string
  price: number
  lowStockThreshold: number
  imageUrl?: string
  comments?: string
}

export type Tab = 'inventory' | 'setup' | 'settings'
export type SetupTab = 'categories' | 'locations' | 'items'
export type InventoryTab = 'view' | 'add'
