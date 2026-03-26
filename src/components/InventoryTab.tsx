import { useState } from 'react'
import { InventoryItem, ItemMaster, Category, Location, InventoryTab as InventoryTabType } from '../types'
import InventoryView from './InventoryView'
import InventoryAdd from './InventoryAdd'

interface InventoryTabProps {
  filteredInventory: InventoryItem[]
  currentInventory: InventoryItem[]
  currentCategories: Category[]
  currentLocations: Location[]
  currentItemMasters: ItemMaster[]
  searchQuery: string
  setSearchQuery: (v: string) => void
  filterCategory: string
  setFilterCategory: (v: string) => void
  filterLocation: string
  setFilterLocation: (v: string) => void
  showLowStockOnly: boolean
  setShowLowStockOnly: (v: boolean) => void
  sortBy: 'name' | 'date' | 'remaining'
  setSortBy: (v: 'name' | 'date' | 'remaining') => void
  updateInventoryUsage: (id: string, usagePercentage: number) => void
  deleteInventoryItem: (id: string) => void
  newInventoryItem: { itemMasterId: string; locationId: string; totalAmount: string; price: string; lowStockThreshold: string; imageUrl: string; comments: string }
  setNewInventoryItem: (v: { itemMasterId: string; locationId: string; totalAmount: string; price: string; lowStockThreshold: string; imageUrl: string; comments: string }) => void
  addInventoryItem: (e: React.FormEvent) => void
  handleInventoryImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeInventoryImage: () => void
  successMessage: string
}

export default function InventoryTab(props: InventoryTabProps) {
  const [activeInventoryTab, setActiveInventoryTab] = useState<InventoryTabType>('view')

  return (
    <div className="inventory-section">
      <h2>Inventory Management</h2>

      <div className="setup-tabs">
        <button
          className={`setup-tab ${activeInventoryTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveInventoryTab('view')}
        >View Inventory</button>
        <button
          className={`setup-tab ${activeInventoryTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveInventoryTab('add')}
        >Add Inventory</button>
      </div>

      {activeInventoryTab === 'view' && (
        <InventoryView
          filteredInventory={props.filteredInventory}
          currentInventory={props.currentInventory}
          currentCategories={props.currentCategories}
          currentLocations={props.currentLocations}
          currentItemMasters={props.currentItemMasters}
          searchQuery={props.searchQuery}
          setSearchQuery={props.setSearchQuery}
          filterCategory={props.filterCategory}
          setFilterCategory={props.setFilterCategory}
          filterLocation={props.filterLocation}
          setFilterLocation={props.setFilterLocation}
          showLowStockOnly={props.showLowStockOnly}
          setShowLowStockOnly={props.setShowLowStockOnly}
          sortBy={props.sortBy}
          setSortBy={props.setSortBy}
          updateInventoryUsage={props.updateInventoryUsage}
          deleteInventoryItem={props.deleteInventoryItem}
        />
      )}

      {activeInventoryTab === 'add' && (
        <InventoryAdd
          currentItemMasters={props.currentItemMasters}
          currentLocations={props.currentLocations}
          newInventoryItem={props.newInventoryItem}
          setNewInventoryItem={props.setNewInventoryItem}
          addInventoryItem={props.addInventoryItem}
          handleInventoryImageUpload={props.handleInventoryImageUpload}
          removeInventoryImage={props.removeInventoryImage}
          successMessage={props.successMessage}
        />
      )}
    </div>
  )
}
