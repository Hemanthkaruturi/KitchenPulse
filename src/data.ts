import { User, Kitchen, Category, Location, ItemMaster, InventoryItem } from './types'

export interface AppData {
  users: User[]
  kitchens: Kitchen[]
  categories: Category[]
  locations: Location[]
  itemMasters: ItemMaster[]
  inventory: InventoryItem[]
  currentUser: User | null
  currentKitchen: Kitchen | null
}

export function initializeAppData(): AppData {
  const APP_VERSION = 'v2.2-auth'
  const storedVersion = localStorage.getItem('appVersion')

  if (storedVersion !== APP_VERSION) {
    localStorage.clear()
    console.log('App version updated, clearing old data...')
  }

  const storedUsers = localStorage.getItem('users')
  const storedKitchens = localStorage.getItem('kitchens')

  if (storedUsers && storedKitchens) {
    return {
      users: JSON.parse(storedUsers) as User[],
      kitchens: JSON.parse(storedKitchens) as Kitchen[],
      categories: JSON.parse(localStorage.getItem('categories') || '[]') as Category[],
      locations: JSON.parse(localStorage.getItem('locations') || '[]') as Location[],
      itemMasters: JSON.parse(localStorage.getItem('itemMasters') || '[]') as ItemMaster[],
      inventory: JSON.parse(localStorage.getItem('inventory') || '[]') as InventoryItem[],
      currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null') as User | null,
      currentKitchen: JSON.parse(localStorage.getItem('currentKitchen') || 'null') as Kitchen | null,
    }
  }

  const dummyUsers: User[] = [
    { id: '1', username: 'john_owner', password: 'pass123', name: 'John Doe' },
    { id: '2', username: 'jane_user', password: 'pass123', name: 'Jane Smith' },
    { id: '3', username: 'bob_user', password: 'pass123', name: 'Bob Wilson' }
  ]
  const dummyKitchens: Kitchen[] = [
    { id: '1', name: 'Home Kitchen', ownerId: '1', memberIds: ['1', '2', '3'] }
  ]
  const dummyCategories: Category[] = [
    { id: '1', kitchenId: '1', name: 'Spices' },
    { id: '2', kitchenId: '1', name: 'Dairy' },
    { id: '3', kitchenId: '1', name: 'Grains' },
    { id: '4', kitchenId: '1', name: 'Oils' },
    { id: '5', kitchenId: '1', name: 'Beverages' }
  ]
  const dummyLocations: Location[] = [
    { id: '1', kitchenId: '1', name: 'Top Shelf' },
    { id: '2', kitchenId: '1', name: 'Middle Shelf' },
    { id: '3', kitchenId: '1', name: 'Pantry' },
    { id: '4', kitchenId: '1', name: 'Fridge' },
    { id: '5', kitchenId: '1', name: 'Spice Rack' }
  ]
  const dummyItemMasters: ItemMaster[] = [
    { id: '1', kitchenId: '1', name: 'Garam Masala', categoryId: '1', defaultUnit: 'g', comments: 'Brand: MDH, Best for biryani' },
    { id: '2', kitchenId: '1', name: 'Turmeric Powder', categoryId: '1', defaultUnit: 'g', comments: 'Organic variant' },
    { id: '3', kitchenId: '1', name: 'Olive Oil', categoryId: '4', defaultUnit: 'ml', comments: 'Extra Virgin, Cold Pressed' },
    { id: '4', kitchenId: '1', name: 'Basmati Rice', categoryId: '3', defaultUnit: 'kg', comments: 'Premium aged rice' },
    { id: '5', kitchenId: '1', name: 'Milk', categoryId: '2', defaultUnit: 'l', comments: 'Full cream' },
    { id: '6', kitchenId: '1', name: 'Coffee Powder', categoryId: '5', defaultUnit: 'g', comments: 'Filter coffee blend' }
  ]
  const dummyInventory: InventoryItem[] = [
    {
      id: '1', kitchenId: '1', itemMasterId: '1', locationId: '5',
      totalAmount: 100, usedAmount: 30,
      purchaseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      price: 120, lowStockThreshold: 20, comments: 'Bought from local store, good quality'
    },
    {
      id: '2', kitchenId: '1', itemMasterId: '2', locationId: '5',
      totalAmount: 200, usedAmount: 180,
      purchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      price: 80, lowStockThreshold: 15, comments: 'Running low, need to refill soon'
    },
    {
      id: '3', kitchenId: '1', itemMasterId: '3', locationId: '3',
      totalAmount: 1000, usedAmount: 250,
      purchaseDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      price: 850, lowStockThreshold: 20, comments: 'Bought on sale - 30% off!'
    }
  ]

  localStorage.setItem('users', JSON.stringify(dummyUsers))
  localStorage.setItem('kitchens', JSON.stringify(dummyKitchens))
  localStorage.setItem('categories', JSON.stringify(dummyCategories))
  localStorage.setItem('locations', JSON.stringify(dummyLocations))
  localStorage.setItem('itemMasters', JSON.stringify(dummyItemMasters))
  localStorage.setItem('inventory', JSON.stringify(dummyInventory))
  localStorage.setItem('appVersion', APP_VERSION)

  return {
    users: dummyUsers,
    kitchens: dummyKitchens,
    categories: dummyCategories,
    locations: dummyLocations,
    itemMasters: dummyItemMasters,
    inventory: dummyInventory,
    currentUser: null,
    currentKitchen: null,
  }
}
