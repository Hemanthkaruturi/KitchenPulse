import { InventoryItem, ItemMaster, Category, Location } from '../types'
import { getRemainingPercentage, getRemainingAmount, isLowStock, getPricePerUnit, getRemainingValue } from '../utils'

interface InventoryViewProps {
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
}

export default function InventoryView({
  filteredInventory, currentInventory,
  currentCategories, currentLocations, currentItemMasters,
  searchQuery, setSearchQuery,
  filterCategory, setFilterCategory,
  filterLocation, setFilterLocation,
  showLowStockOnly, setShowLowStockOnly,
  sortBy, setSortBy,
  updateInventoryUsage, deleteInventoryItem
}: InventoryViewProps) {
  const getItemMaster = (id: string) => currentItemMasters.find(i => i.id === id)
  const getCategory = (id: string) => currentCategories.find(c => c.id === id)
  const getLocation = (id: string) => currentLocations.find(l => l.id === id)

  return (
    <>
      <div className="filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="search-clear" type="button">
              ✕
            </button>
          )}
        </div>

        <div className="filter-grid">
          <div className="filter-group">
            <label>Category</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="">All Categories</option>
              {currentCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Location</label>
            <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}>
              <option value="">All Locations</option>
              {currentLocations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'remaining')}>
              <option value="name">Name (A-Z)</option>
              <option value="date">Purchase Date (Newest)</option>
              <option value="remaining">Stock Level (Low to High)</option>
            </select>
          </div>

          <div className="filter-checkbox">
            <label>
              <input
                type="checkbox"
                checked={showLowStockOnly}
                onChange={(e) => setShowLowStockOnly(e.target.checked)}
              />
              <span>Low Stock Only</span>
            </label>
          </div>
        </div>

        {(searchQuery || filterCategory || filterLocation || showLowStockOnly) && (
          <div className="filter-summary">
            <span>Showing {filteredInventory.length} of {currentInventory.length} items</span>
            <button
              onClick={() => {
                setSearchQuery('')
                setFilterCategory('')
                setFilterLocation('')
                setShowLowStockOnly(false)
              }}
              className="btn-clear-filters"
              type="button"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      <div className="inventory-grid">
        {filteredInventory.map(item => {
          const itemMaster = getItemMaster(item.itemMasterId)
          const category = itemMaster ? getCategory(itemMaster.categoryId) : null
          const location = getLocation(item.locationId)
          const remainingPercentage = getRemainingPercentage(item)
          const lowStock = isLowStock(item)

          return (
            <div key={item.id} className={`inv-card ${lowStock ? 'low-stock' : ''}`}>
              {item.imageUrl && (
                <div className="inv-card-image">
                  <img src={item.imageUrl} alt={itemMaster?.name} />
                </div>
              )}

              <div className="inv-card-header">
                <div>
                  <h3>{itemMaster?.name}</h3>
                  <div className="inv-card-badges">
                    {category && <span className="badge badge-category">{category.name}</span>}
                    {location && <span className="badge badge-location">{location.name}</span>}
                  </div>
                </div>
              </div>

              <div className="inv-card-details">
                <div className="detail-row">
                  <span className="label">Total Amount</span>
                  <span className="value">{item.totalAmount} {itemMaster?.defaultUnit}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Used</span>
                  <span className="value">{item.usedAmount.toFixed(2)} {itemMaster?.defaultUnit}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Remaining</span>
                  <span className="value">{getRemainingAmount(item).toFixed(2)} {itemMaster?.defaultUnit} ({remainingPercentage.toFixed(1)}%)</span>
                </div>
                <div className="detail-row">
                  <span className="label">Purchase Date</span>
                  <span className="value">{new Date(item.purchaseDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="inv-card-price">
                <div className="price-row">
                  <span className="label">Price</span>
                  <span className="value">₹{item.price.toFixed(2)}</span>
                </div>
                <div className="price-row">
                  <span className="label">Per {itemMaster?.defaultUnit}</span>
                  <span className="value">₹{getPricePerUnit(item).toFixed(2)}</span>
                </div>
                <div className="price-row">
                  <span className="label">Remaining Value</span>
                  <span className="value success">₹{getRemainingValue(item).toFixed(2)}</span>
                </div>
              </div>

              {item.comments && (
                <div className="inv-card-comments">
                  <strong>Comments</strong>
                  <p>{item.comments}</p>
                </div>
              )}

              {lowStock && (
                <div className="alert-warning">
                  Low Stock! Below {item.lowStockThreshold}% threshold
                </div>
              )}

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${remainingPercentage}%` }}
                />
              </div>

              <div className="usage-section">
                <label>Update Usage (%):</label>
                <div className="usage-input-row">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Enter % used"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement
                        updateInventoryUsage(item.id, parseFloat(input.value) || 0)
                        input.value = ''
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                      updateInventoryUsage(item.id, parseFloat(input.value) || 0)
                      input.value = ''
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    Update
                  </button>
                </div>
              </div>

              <div className="inv-card-actions">
                <button onClick={() => deleteInventoryItem(item.id)} className="btn btn-danger btn-sm">Delete</button>
              </div>
            </div>
          )
        })}
        {filteredInventory.length === 0 && currentInventory.length > 0 && (
          <div className="empty-state"><p>No items match your search/filter criteria.</p></div>
        )}
        {currentInventory.length === 0 && (
          <div className="empty-state"><p>No inventory items yet. Switch to "Add Inventory" tab to add items!</p></div>
        )}
      </div>
    </>
  )
}
