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
        <div className="search-bar">
          <span className="search-icon">&#128269;</span>
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="btn-clear-search"
              type="button"
            >
              &#x2715;
            </button>
          )}
        </div>

        <div className="filter-grid">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {currentCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <select
              className="form-select"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {currentLocations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Sort By</label>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'remaining')}
            >
              <option value="name">Name (A-Z)</option>
              <option value="date">Purchase Date (Newest)</option>
              <option value="remaining">Stock Level (Low to High)</option>
            </select>
          </div>

          <div className="form-group" style={{ justifyContent: 'flex-end' }}>
            <label className="checkbox-label">
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

      <div className="items-grid">
        {filteredInventory.map(item => {
          const itemMaster = getItemMaster(item.itemMasterId)
          const category = itemMaster ? getCategory(itemMaster.categoryId) : null
          const location = getLocation(item.locationId)
          const remainingPercentage = getRemainingPercentage(item)
          const lowStock = isLowStock(item)

          return (
            <div key={item.id} className={`item-card ${lowStock ? 'low-stock' : ''}`}>
              {item.imageUrl && (
                <div className="item-image">
                  <img src={item.imageUrl} alt={itemMaster?.name} />
                </div>
              )}

              <div className="item-header">
                <h3>{itemMaster?.name}</h3>
                <div className="badges">
                  {category && <span className="badge badge-category">{category.name}</span>}
                  {location && <span className="badge badge-location">{location.name}</span>}
                </div>
              </div>

              <div className="item-details">
                <p><strong>Total:</strong> {item.totalAmount} {itemMaster?.defaultUnit}</p>
                <p><strong>Remaining:</strong> {getRemainingAmount(item).toFixed(2)} {itemMaster?.defaultUnit} ({remainingPercentage.toFixed(1)}%)</p>
                <p><strong>Purchased:</strong> {new Date(item.purchaseDate).toLocaleDateString()}</p>
              </div>

              <div className="price-info">
                <div className="price-row">
                  <span>Price</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{'\u20B9'}{item.price.toFixed(2)}</strong>
                </div>
                <div className="price-row">
                  <span>Per {itemMaster?.defaultUnit}</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{'\u20B9'}{getPricePerUnit(item).toFixed(2)}</strong>
                </div>
                <div className="price-row">
                  <span>Remaining Value</span>
                  <strong style={{ color: 'var(--success)' }}>{'\u20B9'}{getRemainingValue(item).toFixed(2)}</strong>
                </div>
              </div>

              {item.comments && (
                <div className="comments-section">
                  <strong>Comments</strong>
                  <p>{item.comments}</p>
                </div>
              )}

              {lowStock && (
                <div className="alert alert-warning">
                  Low Stock! Below {item.lowStockThreshold}% threshold
                </div>
              )}

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${remainingPercentage}%` }}
                ></div>
              </div>

              <div className="usage-update">
                <label>Update Usage (%):</label>
                <div className="usage-input-group">
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

              <div style={{ marginTop: '0.75rem' }}>
                <button onClick={() => deleteInventoryItem(item.id)} className="btn btn-danger btn-sm">Delete</button>
              </div>
            </div>
          )
        })}
        {filteredInventory.length === 0 && currentInventory.length > 0 && (
          <div className="empty-state">
            <p>No items match your search/filter criteria.</p>
          </div>
        )}
        {currentInventory.length === 0 && (
          <div className="empty-state">
            <p>No inventory items yet. Switch to "Add Inventory" tab to add items!</p>
          </div>
        )}
      </div>
    </>
  )
}
