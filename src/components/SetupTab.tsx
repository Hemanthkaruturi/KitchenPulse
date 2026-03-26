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
    <div>
      <div className="content-card-header" style={{ marginBottom: '1.5rem' }}>
        <h2 className="page-title" style={{ marginBottom: 0 }}>Setup</h2>
        <div className="tab-pills">
          <button
            className={`tab-pill ${activeSetupTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveSetupTab('categories')}
          >
            Categories
          </button>
          <button
            className={`tab-pill ${activeSetupTab === 'locations' ? 'active' : ''}`}
            onClick={() => setActiveSetupTab('locations')}
          >
            Locations
          </button>
          <button
            className={`tab-pill ${activeSetupTab === 'items' ? 'active' : ''}`}
            onClick={() => setActiveSetupTab('items')}
          >
            Items
          </button>
        </div>
      </div>

      {activeSetupTab === 'categories' && (
        <div className="content-card">
          <h3 className="content-card-title" style={{ marginBottom: '1rem' }}>Manage Categories</h3>

          <form onSubmit={addCategory} className="form-inline" style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="Enter category name (e.g., Spices, Dairy)"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Add</button>
          </form>

          <div>
            {currentCategories.map(category => (
              <div key={category.id} className="list-item">
                <span>{category.name}</span>
                <button onClick={() => deleteCategory(category.id)} className="btn btn-danger btn-sm">Delete</button>
              </div>
            ))}
            {currentCategories.length === 0 && (
              <div className="empty-state"><p>No categories yet. Add your first category above!</p></div>
            )}
          </div>
        </div>
      )}

      {activeSetupTab === 'locations' && (
        <div className="content-card">
          <h3 className="content-card-title" style={{ marginBottom: '1rem' }}>Manage Locations</h3>

          <form onSubmit={addLocation} className="form-inline" style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="Enter location (e.g., Top Shelf, Pantry)"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Add</button>
          </form>

          <div>
            {currentLocations.map(location => (
              <div key={location.id} className="list-item">
                <span>{location.name}</span>
                <button onClick={() => deleteLocation(location.id)} className="btn btn-danger btn-sm">Delete</button>
              </div>
            ))}
            {currentLocations.length === 0 && (
              <div className="empty-state"><p>No locations yet. Add your first location above!</p></div>
            )}
          </div>
        </div>
      )}

      {activeSetupTab === 'items' && (
        <div>
          <div className="content-card">
            <h3 className="content-card-title" style={{ marginBottom: '1rem' }}>Add Item Master</h3>

            <form onSubmit={addItemMaster}>
              <div className="form-row">
                <div className="form-group">
                  <label>Item Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Garam Masala"
                    value={newItemMaster.name}
                    onChange={(e) => setNewItemMaster({ ...newItemMaster, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
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
                  <label>Default Unit</label>
                  <select
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

              <div className="form-group">
                <label>Comments (Optional)</label>
                <textarea
                  placeholder="e.g., Brand name, special notes, etc."
                  value={newItemMaster.comments}
                  onChange={(e) => setNewItemMaster({ ...newItemMaster, comments: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="form-group">
                <label>Image (Optional)</label>
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

              <button type="submit" className="btn btn-primary btn-block">Add Item Master</button>
            </form>
          </div>

          <div className="master-cards">
            {currentItemMasters.map(item => (
              <div key={item.id} className="master-card">
                {item.imageUrl && (
                  <div className="master-card-image">
                    <img src={item.imageUrl} alt={item.name} />
                  </div>
                )}
                <h4>{item.name}</h4>
                <div className="master-card-meta">
                  <span className="badge badge-category">{getCategory(item.categoryId)?.name}</span>
                  <span className="badge badge-unit">{getUnitLabel(item.defaultUnit)}</span>
                </div>
                {item.comments && (
                  <div className="master-card-comments">
                    <p>{item.comments}</p>
                  </div>
                )}
                <button onClick={() => deleteItemMaster(item.id)} className="btn btn-danger btn-sm">Delete</button>
              </div>
            ))}
            {currentItemMasters.length === 0 && (
              <div className="empty-state"><p>No items yet. Add your first item above!</p></div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
