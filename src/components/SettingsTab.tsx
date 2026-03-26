import { User, Kitchen } from '../types'

interface SettingsTabProps {
  currentUser: User
  currentKitchen: Kitchen
  isOwner: boolean
  users: User[]
  newMemberUsername: string
  setNewMemberUsername: (v: string) => void
  addMemberToKitchen: (e: React.FormEvent) => void
  removeMemberFromKitchen: (userId: string) => void
  setCurrentKitchen: (k: Kitchen | null) => void
}

export default function SettingsTab({
  currentKitchen, isOwner, users,
  newMemberUsername, setNewMemberUsername,
  addMemberToKitchen, removeMemberFromKitchen, setCurrentKitchen
}: SettingsTabProps) {
  const getUser = (id: string) => users.find(u => u.id === id)

  return (
    <div className="settings-section">
      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">Manage your kitchen and members</p>

      <div className="settings-card">
        <h3>Kitchen Information</h3>
        <p><strong>Name:</strong> {currentKitchen.name}</p>
        <p><strong>Owner:</strong> {getUser(currentKitchen.ownerId)?.name}</p>
        <p><strong>Total Members:</strong> {currentKitchen.memberIds.length}</p>

        <div style={{ marginTop: '1rem' }}>
          <button onClick={() => {
            setCurrentKitchen(null)
            localStorage.removeItem('currentKitchen')
          }} className="btn btn-secondary">
            Switch Kitchen
          </button>
        </div>
      </div>

      {isOwner && (
        <div className="settings-card">
          <h3>Manage Members</h3>

          <form onSubmit={addMemberToKitchen} className="form-inline" style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Enter username to add"
              value={newMemberUsername}
              onChange={(e) => setNewMemberUsername(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Add</button>
          </form>

          <div className="members-list">
            <h4>Current Members</h4>
            {currentKitchen.memberIds.map(memberId => {
              const member = getUser(memberId)
              return member ? (
                <div key={memberId} className="member-item">
                  <div>
                    <strong>{member.name}</strong>
                    <span className="member-username">@{member.username}</span>
                    {memberId === currentKitchen.ownerId && (
                      <span className="badge badge-owner owner-badge">Owner</span>
                    )}
                  </div>
                  {memberId !== currentKitchen.ownerId && (
                    <button
                      onClick={() => removeMemberFromKitchen(memberId)}
                      className="btn btn-danger btn-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ) : null
            })}
          </div>
        </div>
      )}

      {!isOwner && (
        <div className="settings-card">
          <h3>Kitchen Members</h3>
          <div className="members-list">
            {currentKitchen.memberIds.map(memberId => {
              const member = getUser(memberId)
              return member ? (
                <div key={memberId} className="member-item">
                  <div>
                    <strong>{member.name}</strong>
                    <span className="member-username">@{member.username}</span>
                    {memberId === currentKitchen.ownerId && (
                      <span className="badge badge-owner owner-badge">Owner</span>
                    )}
                  </div>
                </div>
              ) : null
            })}
          </div>
        </div>
      )}
    </div>
  )
}
