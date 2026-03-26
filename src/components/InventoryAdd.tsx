import { ItemMaster, Location } from '../types'
import { getUnitLabel } from '../utils'

interface InventoryAddProps {
  currentItemMasters: ItemMaster[]
  currentLocations: Location[]
  newInventoryItem: { itemMasterId: string; locationId: string; totalAmount: string; price: string; lowStockThreshold: string; imageUrl: string; comments: string }
  setNewInventoryItem: (v: { itemMasterId: string; locationId: string; totalAmount: string; price: string; lowStockThreshold: string; imageUrl: string; comments: string }) => void
  addInventoryItem: (e: React.FormEvent) => void
  handleInventoryImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeInventoryImage: () => void
  successMessage: string
}

export default function InventoryAdd({
  currentItemMasters, currentLocations,
  newInventoryItem, setNewInventoryItem,
  addInventoryItem, handleInventoryImageUpload, removeInventoryImage,
  successMessage
}: InventoryAddProps) {
  const getItemMaster = (id: string) => currentItemMasters.find(i => i.id === id)

  return (
    <>
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      <form onSubmit={addInventoryItem} className="add-item-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Item</label>
            <select
              className="form-select"
              value={newInventoryItem.itemMasterId}
              onChange={(e) => setNewInventoryItem({ ...newInventoryItem, itemMasterId: e.target.value })}
              required
            >
              <option value="">Select Item</option>
              {currentItemMasters.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <select
              className="form-select"
              value={newInventoryItem.locationId}
              onChange={(e) => setNewInventoryItem({ ...newInventoryItem, locationId: e.target.value })}
              required
            >
              <option value="">Select Location</option>
              {currentLocations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Total Amount
              {newInventoryItem.itemMasterId && (() => {
                const item = getItemMaster(newInventoryItem.itemMasterId)
                return item ? ` (${getUnitLabel(item.defaultUnit)})` : ''
              })()}
            </label>
            <input
              type="number"
              className="form-input"
              step="0.01"
              placeholder="e.g., 100"
              value={newInventoryItem.totalAmount}
              onChange={(e) => setNewInventoryItem({ ...newInventoryItem, totalAmount: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Price ({'\u20B9'})</label>
            <input
              type="number"
              className="form-input"
              step="0.01"
              placeholder="e.g., 150"
              value={newInventoryItem.price}
              onChange={(e) => setNewInventoryItem({ ...newInventoryItem, price: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Low Stock Alert (%)</label>
            <input
              type="number"
              className="form-input"
              min="0"
              max="100"
              placeholder="e.g., 20"
              value={newInventoryItem.lowStockThreshold}
              onChange={(e) => setNewInventoryItem({ ...newInventoryItem, lowStockThreshold: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '0.75rem' }}>
          <label className="form-label">Comments (Optional)</label>
          <textarea
            className="form-textarea"
            placeholder="e.g., Bought on sale, expiry date, etc."
            value={newInventoryItem.comments}
            onChange={(e) => setNewInventoryItem({ ...newInventoryItem, comments: e.target.value })}
            rows={2}
          />
        </div>

        <div className="form-group" style={{ marginTop: '0.75rem' }}>
          <label className="form-label">Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleInventoryImageUpload}
            className="file-input"
          />
          {newInventoryItem.imageUrl && (
            <div className="image-preview">
              <img src={newInventoryItem.imageUrl} alt="Preview" />
              <button type="button" onClick={removeInventoryImage} className="btn btn-danger btn-sm">
                Remove Image
              </button>
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1rem' }}>Add to Inventory</button>
      </form>
    </>
  )
}
