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
    <div className="kitchen-layout">
      <div className="kitchen-header" style={{ position: 'relative' }}>
        <h1>KitchenPulse</h1>
        <p>Welcome, {currentUser.name}!</p>
        <button onClick={handleLogout} className="btn-logout-white">Logout</button>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title="Toggle theme"
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
        >
          {theme === 'light' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          )}
        </button>
      </div>

      <div className="kitchen-body">
        <div className="kitchen-card">
          <h2>Select or Create a Kitchen</h2>

          {userKitchens.length > 0 && (
            <div>
              <h3>Your Kitchens</h3>
              {userKitchens.map(kitchen => (
                <div key={kitchen.id} className="kitchen-list-item" onClick={() => setCurrentKitchen(kitchen)}>
                  <strong>{kitchen.name}</strong>
                  <span className="kitchen-role">
                    {kitchen.ownerId === currentUser.id ? '(Owner)' : '(Member)'}
                  </span>
                </div>
              ))}
            </div>
          )}

          <hr className="kitchen-divider" />

          <h3>Create New Kitchen</h3>
          <form onSubmit={createKitchen} className="form-inline">
            <input
              type="text"
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
  )
}
