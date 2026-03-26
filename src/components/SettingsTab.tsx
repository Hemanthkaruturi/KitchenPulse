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
    <div>
      <h2 className="page-title">Settings</h2>

      <div className="settings-grid">
        <div className="settings-card">
          <h3>Kitchen Information</h3>
          <p><strong>Name:</strong> {currentKitchen.name}</p>
          <p><strong>Owner:</strong> {getUser(currentKitchen.ownerId)?.name}</p>
          <p><strong>Total Members:</strong> {currentKitchen.memberIds.length}</p>
          <button
            onClick={() => {
              setCurrentKitchen(null)
              localStorage.removeItem('currentKitchen')
            }}
            className="btn btn-secondary"
            style={{ marginTop: '1rem' }}
          >
            Switch Kitchen
          </button>
        </div>

        {isOwner && (
          <div className="settings-card">
            <h3>Manage Members (Owner Only)</h3>

            <form onSubmit={addMemberToKitchen} className="form-inline">
              <input
                type="text"
                placeholder="Enter username to add"
                value={newMemberUsername}
                onChange={(e) => setNewMemberUsername(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Add Member</button>
            </form>

            <div className="members-list">
              <h4>Current Members</h4>
              {currentKitchen.memberIds.map(memberId => {
                const member = getUser(memberId)
                return member ? (
                  <div key={memberId} className="member-item">
                    <div className="member-info">
                      <strong>{member.name}</strong>
                      <span className="member-username">@{member.username}</span>
                      {memberId === currentKitchen.ownerId && (
                        <span className="badge badge-owner">Owner</span>
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
                    <div className="member-info">
                      <strong>{member.name}</strong>
                      <span className="member-username">@{member.username}</span>
                      {memberId === currentKitchen.ownerId && (
                        <span className="badge badge-owner">Owner</span>
                      )}
                    </div>
                  </div>
                ) : null
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
