import { User, Kitchen } from '../types'

interface KitchenSelectionProps {
  currentUser: User
  userKitchens: Kitchen[]
  newKitchenName: string
  setNewKitchenName: (v: string) => void
  setCurrentKitchen: (k: Kitchen) => void
  createKitchen: (e: React.FormEvent) => void
  handleLogout: () => void
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export default function KitchenSelection({
  currentUser, userKitchens, newKitchenName, setNewKitchenName,
  setCurrentKitchen, createKitchen, handleLogout, theme, toggleTheme
}: KitchenSelectionProps) {
  return (
    <div className="auth-page">
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button className="header-icon-btn theme-toggle-icon" onClick={toggleTheme} title="Toggle theme">
          {theme === 'light' ? '\u{2600}\uFE0F' : '\u{1F319}'}
        </button>
        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
      </div>

      <div className="auth-header">
        <div className="auth-brand">
          <div className="auth-brand-icon">K</div>
          <span className="auth-brand-name">KitchenPulse</span>
        </div>
        <p className="auth-tagline">Welcome, {currentUser.name}!</p>
      </div>

      <div className="kitchen-selection">
        <div className="kitchen-card">
          <h2>Select or Create a Kitchen</h2>

          {userKitchens.length > 0 && (
            <div className="kitchen-list">
              <h3>Your Kitchens</h3>
              {userKitchens.map(kitchen => (
                <div key={kitchen.id} className="kitchen-item" onClick={() => setCurrentKitchen(kitchen)}>
                  <strong>{kitchen.name}</strong>
                  <span className="kitchen-role">
                    {kitchen.ownerId === currentUser.id ? '(Owner)' : '(Member)'}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="create-kitchen-section">
            <h3>Create New Kitchen</h3>
            <form onSubmit={createKitchen} className="form-inline">
              <input
                type="text"
                className="form-input"
                placeholder="Enter kitchen name (e.g., Home Kitchen)"
                value={newKitchenName}
                onChange={(e) => setNewKitchenName(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">Create</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
