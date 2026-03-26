import { useState } from 'react'
import { InventoryItem, Category, Location, ItemMaster } from '../types'
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
  const [showAddModal, setShowAddModal] = useState(false)

  const handleAdd = (e: React.FormEvent) => {
    props.addInventoryItem(e)
    setShowAddModal(false)
  }

  return (
    <div>
      <div className="content-card-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2 className="page-title" style={{ marginBottom: 0 }}>Inventory</h2>
          <div className="content-card-subtitle">Manage your kitchen inventory items</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Item
        </button>
      </div>

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

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Inventory Item</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <InventoryAdd
                currentItemMasters={props.currentItemMasters}
                currentLocations={props.currentLocations}
                newInventoryItem={props.newInventoryItem}
                setNewInventoryItem={props.setNewInventoryItem}
                addInventoryItem={handleAdd}
                handleInventoryImageUpload={props.handleInventoryImageUpload}
                removeInventoryImage={props.removeInventoryImage}
                successMessage={props.successMessage}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
