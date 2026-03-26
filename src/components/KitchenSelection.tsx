import { User, Kitchen } from '../types'

interface KitchenSelectionProps {
  currentUser: User
  userKitchens: Kitchen[]
  newKitchenName: string
  setNewKitchenName: (v: string) => void
  setCurrentKitchen: (k: Kitchen) => void
  createKitchen: (e: React.FormEvent) => void
  handleLogout: () => void
}

export default function KitchenSelection({
  currentUser, userKitchens, newKitchenName, setNewKitchenName,
  setCurrentKitchen, createKitchen, handleLogout
}: KitchenSelectionProps) {
  return (
    <div className="app">
      <header className="header">
        <h1>KitchenPulse</h1>
        <p className="tagline">Welcome, {currentUser.name}!</p>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </header>

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
            <form onSubmit={createKitchen} className="quick-add-form">
              <input
                type="text"
                placeholder="Enter kitchen name (e.g., Home Kitchen)"
                value={newKitchenName}
                onChange={(e) => setNewKitchenName(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">Create Kitchen</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
