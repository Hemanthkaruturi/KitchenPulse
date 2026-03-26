import { useState } from 'react'
import { Category, Location, ItemMaster, SetupTab as SetupTabType } from '../types'
import { getUnitLabel } from '../utils'

interface SetupTabProps {
  currentCategories: Category[]
  currentLocations: Location[]
  currentItemMasters: ItemMaster[]
  addCategory: (e: React.FormEvent) => void
  deleteCategory: (id: string) => void
  addLocation: (e: React.FormEvent) => void
  deleteLocation: (id: string) => void
  addItemMaster: (e: React.FormEvent) => void
  deleteItemMaster: (id: string) => void
  newCategory: string
  setNewCategory: (v: string) => void
  newLocation: string
  setNewLocation: (v: string) => void
  newItemMaster: { name: string; categoryId: string; defaultUnit: 'g' | 'kg' | 'l' | 'ml' | 'pcs'; imageUrl: string; comments: string }
  setNewItemMaster: (v: { name: string; categoryId: string; defaultUnit: 'g' | 'kg' | 'l' | 'ml' | 'pcs'; imageUrl: string; comments: string }) => void
  handleItemMasterImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeItemMasterImage: () => void
}

export default function SetupTab({
  currentCategories, currentLocations, currentItemMasters,
  addCategory, deleteCategory, addLocation, deleteLocation,
  addItemMaster, deleteItemMaster,
  newCategory, setNewCategory, newLocation, setNewLocation,
  newItemMaster, setNewItemMaster,
  handleItemMasterImageUpload, removeItemMasterImage
}: SetupTabProps) {
  const [activeSetupTab, setActiveSetupTab] = useState<SetupTabType>('categories')
  const getCategory = (id: string) => currentCategories.find(c => c.id === id)

  return (
    <div style={{ maxWidth: 800 }}>
      <h1 className="page-title">Setup</h1>
      <p className="page-subtitle">Configure categories, locations, and item templates</p>

      <div className="tabs">
        <button
          className={`tab-btn ${activeSetupTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveSetupTab('categories')}
        >
          Categories
        </button>
        <button
          className={`tab-btn ${activeSetupTab === 'locations' ? 'active' : ''}`}
          onClick={() => setActiveSetupTab('locations')}
        >
          Locations
        </button>
        <button
          className={`tab-btn ${activeSetupTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveSetupTab('items')}
        >
          Item Masters
        </button>
      </div>

      {activeSetupTab === 'categories' && (
        <div>
          <form onSubmit={addCategory} className="form-inline" style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Enter category name (e.g., Spices, Dairy)"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Add</button>
          </form>

          <div className="simple-list">
            {currentCategories.map(category => (
              <div key={category.id} className="simple-list-item">
                <span>{category.name}</span>
                <button onClick={() => deleteCategory(category.id)} className="btn btn-danger btn-sm">Delete</button>
              </div>
            ))}
            {currentCategories.length === 0 && (
              <div className="empty-state">
                <p>No categories yet. Add your first category above!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSetupTab === 'locations' && (
        <div>
          <form onSubmit={addLocation} className="form-inline" style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Enter location (e.g., Top Shelf, Pantry)"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Add</button>
          </form>

          <div className="simple-list">
            {currentLocations.map(location => (
              <div key={location.id} className="simple-list-item">
                <span>{location.name}</span>
                <button onClick={() => deleteLocation(location.id)} className="btn btn-danger btn-sm">Delete</button>
              </div>
            ))}
            {currentLocations.length === 0 && (
              <div className="empty-state">
                <p>No locations yet. Add your first location above!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSetupTab === 'items' && (
        <div>
          <form onSubmit={addItemMaster} className="add-item-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Item Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Garam Masala"
                  value={newItemMaster.name}
                  onChange={(e) => setNewItemMaster({ ...newItemMaster, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={newItemMaster.categoryId}
                  onChange={(e) => setNewItemMaster({ ...newItemMaster, categoryId: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {currentCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Default Unit</label>
                <select
                  className="form-select"
                  value={newItemMaster.defaultUnit}
                  onChange={(e) => setNewItemMaster({ ...newItemMaster, defaultUnit: e.target.value as any })}
                  required
                >
                  <option value="g">Grams (g)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="l">Liters (l)</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="pcs">Pieces (pcs)</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '0.75rem' }}>
              <label className="form-label">Comments (Optional)</label>
              <textarea
                className="form-textarea"
                placeholder="e.g., Brand name, special notes, etc."
                value={newItemMaster.comments}
                onChange={(e) => setNewItemMaster({ ...newItemMaster, comments: e.target.value })}
                rows={2}
              />
            </div>

            <div className="form-group" style={{ marginTop: '0.75rem' }}>
              <label className="form-label">Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleItemMasterImageUpload}
                className="file-input"
              />
              {newItemMaster.imageUrl && (
                <div className="image-preview">
                  <img src={newItemMaster.imageUrl} alt="Preview" />
                  <button type="button" onClick={removeItemMasterImage} className="btn btn-danger btn-sm">
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1rem' }}>Add Item Master</button>
          </form>

          <div className="items-grid" style={{ marginTop: '1.5rem' }}>
            {currentItemMasters.map(item => (
              <div key={item.id} className="item-card">
                {item.imageUrl && (
                  <div className="item-image">
                    <img src={item.imageUrl} alt={item.name} />
                  </div>
                )}
                <div className="item-header">
                  <h3>{item.name}</h3>
                  <span className="badge badge-category">{getCategory(item.categoryId)?.name}</span>
                </div>
                <div className="item-details">
                  <p><strong>Default Unit:</strong> {getUnitLabel(item.defaultUnit)}</p>
                  {item.comments && (
                    <div className="comments-section">
                      <strong>Comments</strong>
                      <p>{item.comments}</p>
                    </div>
                  )}
                </div>
                <button onClick={() => deleteItemMaster(item.id)} className="btn btn-danger btn-sm">Delete</button>
              </div>
            ))}
            {currentItemMasters.length === 0 && (
              <div className="empty-state">
                <p>No items yet. Add your first item above!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
