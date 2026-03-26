import { useState, useEffect } from 'react'
import './App.css'
import { User, Kitchen, Category, Location, ItemMaster, InventoryItem, Tab } from './types'
import { initializeAppData } from './data'
import { isLowStock, getRemainingPercentage } from './utils'
import { useTheme } from './context/ThemeContext'
import AuthScreen from './components/AuthScreen'
import KitchenSelection from './components/KitchenSelection'
import SettingsTab from './components/SettingsTab'
import SetupTab from './components/SetupTab'
import InventoryTab from './components/InventoryTab'

const initialData = initializeAppData()

function App() {
  const { theme, toggleTheme } = useTheme()

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(initialData.currentUser)
  const [currentKitchen, setCurrentKitchen] = useState<Kitchen | null>(initialData.currentKitchen)
  const [isLogin, setIsLogin] = useState(true)
  const [authForm, setAuthForm] = useState({ username: '', password: '', name: '' })

  // Navigation
  const [activeTab, setActiveTab] = useState<Tab>('inventory')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Master data
  const [users, setUsers] = useState<User[]>(initialData.users)
  const [kitchens, setKitchens] = useState<Kitchen[]>(initialData.kitchens)
  const [categories, setCategories] = useState<Category[]>(initialData.categories)
  const [locations, setLocations] = useState<Location[]>(initialData.locations)
  const [itemMasters, setItemMasters] = useState<ItemMaster[]>(initialData.itemMasters)
  const [inventory, setInventory] = useState<InventoryItem[]>(initialData.inventory)

  // Form states
  const [newCategory, setNewCategory] = useState('')
  const [newLocation, setNewLocation] = useState('')
  const [newKitchenName, setNewKitchenName] = useState('')
  const [newMemberUsername, setNewMemberUsername] = useState('')
  const [newItemMaster, setNewItemMaster] = useState({
    name: '',
    categoryId: '',
    defaultUnit: 'g' as 'g' | 'kg' | 'l' | 'ml' | 'pcs',
    imageUrl: '',
    comments: ''
  })
  const [newInventoryItem, setNewInventoryItem] = useState({
    itemMasterId: '',
    locationId: '',
    totalAmount: '',
    price: '',
    lowStockThreshold: '20',
    imageUrl: '',
    comments: ''
  })

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterLocation, setFilterLocation] = useState('')
  const [showLowStockOnly, setShowLowStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'remaining'>('name')
  const [successMessage, setSuccessMessage] = useState('')

  // Save to localStorage on changes
  useEffect(() => { localStorage.setItem('users', JSON.stringify(users)) }, [users])
  useEffect(() => { localStorage.setItem('kitchens', JSON.stringify(kitchens)) }, [kitchens])
  useEffect(() => { localStorage.setItem('categories', JSON.stringify(categories)) }, [categories])
  useEffect(() => { localStorage.setItem('locations', JSON.stringify(locations)) }, [locations])
  useEffect(() => { localStorage.setItem('itemMasters', JSON.stringify(itemMasters)) }, [itemMasters])
  useEffect(() => { localStorage.setItem('inventory', JSON.stringify(inventory)) }, [inventory])
  useEffect(() => {
    if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser))
  }, [currentUser])
  useEffect(() => {
    if (currentKitchen) localStorage.setItem('currentKitchen', JSON.stringify(currentKitchen))
  }, [currentKitchen])

  // Auth functions
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const user = users.find(u => u.username === authForm.username && u.password === authForm.password)
    if (user) {
      setCurrentUser(user)
      const userKitchens = kitchens.filter(k => k.memberIds.includes(user.id))
      if (userKitchens.length > 0) {
        setCurrentKitchen(userKitchens[0])
      }
      setAuthForm({ username: '', password: '', name: '' })
    } else {
      alert('Invalid credentials')
    }
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (users.find(u => u.username === authForm.username)) {
      alert('Username already exists')
      return
    }
    const newUser: User = {
      id: Date.now().toString(),
      username: authForm.username,
      password: authForm.password,
      name: authForm.name
    }
    setUsers([...users, newUser])
    setCurrentUser(newUser)
    setAuthForm({ username: '', password: '', name: '' })
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentKitchen(null)
    localStorage.removeItem('currentUser')
    localStorage.removeItem('currentKitchen')
  }

  // Kitchen functions
  const createKitchen = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return
    const newKitchen: Kitchen = {
      id: Date.now().toString(),
      name: newKitchenName,
      ownerId: currentUser.id,
      memberIds: [currentUser.id]
    }
    setKitchens([...kitchens, newKitchen])
    setCurrentKitchen(newKitchen)
    setNewKitchenName('')
  }

  const addMemberToKitchen = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentKitchen || !currentUser || currentKitchen.ownerId !== currentUser.id) return
    const userToAdd = users.find(u => u.username === newMemberUsername)
    if (!userToAdd) { alert('User not found'); return }
    if (currentKitchen.memberIds.includes(userToAdd.id)) { alert('User already in kitchen'); return }
    const updatedKitchen = { ...currentKitchen, memberIds: [...currentKitchen.memberIds, userToAdd.id] }
    setKitchens(kitchens.map(k => k.id === currentKitchen.id ? updatedKitchen : k))
    setCurrentKitchen(updatedKitchen)
    setNewMemberUsername('')
  }

  const removeMemberFromKitchen = (userId: string) => {
    if (!currentKitchen || !currentUser || currentKitchen.ownerId !== currentUser.id) return
    if (userId === currentUser.id) { alert('Cannot remove yourself'); return }
    const updatedKitchen = { ...currentKitchen, memberIds: currentKitchen.memberIds.filter(id => id !== userId) }
    setKitchens(kitchens.map(k => k.id === currentKitchen.id ? updatedKitchen : k))
    setCurrentKitchen(updatedKitchen)
  }

  // Filter data by current kitchen
  const currentCategories = categories.filter(c => c.kitchenId === currentKitchen?.id)
  const currentLocations = locations.filter(l => l.kitchenId === currentKitchen?.id)
  const currentItemMasters = itemMasters.filter(i => i.kitchenId === currentKitchen?.id)
  const currentInventory = inventory.filter(i => i.kitchenId === currentKitchen?.id)

  // Category functions
  const addCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategory.trim() || !currentKitchen) return
    setCategories([...categories, { id: Date.now().toString(), kitchenId: currentKitchen.id, name: newCategory }])
    setNewCategory('')
  }
  const deleteCategory = (id: string) => setCategories(categories.filter(c => c.id !== id))

  // Location functions
  const addLocation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLocation.trim() || !currentKitchen) return
    setLocations([...locations, { id: Date.now().toString(), kitchenId: currentKitchen.id, name: newLocation }])
    setNewLocation('')
  }
  const deleteLocation = (id: string) => setLocations(locations.filter(l => l.id !== id))

  // Item Master functions
  const handleItemMasterImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { alert('Image size should be less than 5MB'); return }
      if (!file.type.startsWith('image/')) { alert('Please upload an image file'); return }
      const reader = new FileReader()
      reader.onloadend = () => setNewItemMaster({ ...newItemMaster, imageUrl: reader.result as string })
      reader.readAsDataURL(file)
    }
  }
  const removeItemMasterImage = () => setNewItemMaster({ ...newItemMaster, imageUrl: '' })

  const addItemMaster = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentKitchen) return
    const item: ItemMaster = {
      id: Date.now().toString(), kitchenId: currentKitchen.id,
      name: newItemMaster.name, categoryId: newItemMaster.categoryId,
      defaultUnit: newItemMaster.defaultUnit,
      imageUrl: newItemMaster.imageUrl || undefined, comments: newItemMaster.comments || undefined
    }
    setItemMasters([...itemMasters, item])
    setNewItemMaster({ name: '', categoryId: '', defaultUnit: 'g', imageUrl: '', comments: '' })
  }
  const deleteItemMaster = (id: string) => setItemMasters(itemMasters.filter(i => i.id !== id))

  // Inventory functions
  const handleInventoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { alert('Image size should be less than 5MB'); return }
      if (!file.type.startsWith('image/')) { alert('Please upload an image file'); return }
      const reader = new FileReader()
      reader.onloadend = () => setNewInventoryItem({ ...newInventoryItem, imageUrl: reader.result as string })
      reader.readAsDataURL(file)
    }
  }
  const removeInventoryImage = () => setNewInventoryItem({ ...newInventoryItem, imageUrl: '' })

  const addInventoryItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentKitchen) return
    const item: InventoryItem = {
      id: Date.now().toString(), kitchenId: currentKitchen.id,
      itemMasterId: newInventoryItem.itemMasterId, locationId: newInventoryItem.locationId,
      totalAmount: parseFloat(newInventoryItem.totalAmount), usedAmount: 0,
      purchaseDate: new Date().toISOString(),
      price: parseFloat(newInventoryItem.price),
      lowStockThreshold: parseFloat(newInventoryItem.lowStockThreshold),
      imageUrl: newInventoryItem.imageUrl || undefined, comments: newInventoryItem.comments || undefined
    }
    setInventory([...inventory, item])
    setNewInventoryItem({ itemMasterId: '', locationId: '', totalAmount: '', price: '', lowStockThreshold: '20', imageUrl: '', comments: '' })
    setSuccessMessage('Item added to inventory successfully!')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const updateInventoryUsage = (id: string, usagePercentage: number) => {
    setInventory(inventory.map(item => {
      if (item.id === id) {
        return { ...item, usedAmount: (item.totalAmount * usagePercentage) / 100 }
      }
      return item
    }))
  }
  const deleteInventoryItem = (id: string) => setInventory(inventory.filter(i => i.id !== id))

  // Helper for filtering
  const getItemMaster = (id: string) => currentItemMasters.find(i => i.id === id)

  const isOwner = currentUser && currentKitchen && currentKitchen.ownerId === currentUser.id
  const userKitchens = kitchens.filter(k => currentUser && k.memberIds.includes(currentUser.id))

  // Stats
  const lowStockCount = currentInventory.filter(i => isLowStock(i)).length
  const totalValue = currentInventory.reduce((sum, i) => sum + i.price, 0)

  // Filter and sort inventory
  const getFilteredAndSortedInventory = () => {
    let filtered = [...currentInventory]
    if (searchQuery.trim()) {
      filtered = filtered.filter(item => {
        const im = getItemMaster(item.itemMasterId)
        return im?.name.toLowerCase().includes(searchQuery.toLowerCase())
      })
    }
    if (filterCategory) {
      filtered = filtered.filter(item => getItemMaster(item.itemMasterId)?.categoryId === filterCategory)
    }
    if (filterLocation) {
      filtered = filtered.filter(item => item.locationId === filterLocation)
    }
    if (showLowStockOnly) {
      filtered = filtered.filter(item => isLowStock(item))
    }
    filtered.sort((a, b) => {
      if (sortBy === 'name') return (getItemMaster(a.itemMasterId)?.name || '').localeCompare(getItemMaster(b.itemMasterId)?.name || '')
      if (sortBy === 'date') return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
      if (sortBy === 'remaining') {
        return getRemainingPercentage(a) - getRemainingPercentage(b)
      }
      return 0
    })
    return filtered
  }
  const filteredInventory = getFilteredAndSortedInventory()

  // Auth screen
  if (!currentUser) {
    return (
      <AuthScreen
        isLogin={isLogin} setIsLogin={setIsLogin}
        authForm={authForm} setAuthForm={setAuthForm}
        handleLogin={handleLogin} handleSignup={handleSignup}
        theme={theme} toggleTheme={toggleTheme}
      />
    )
  }

  // Kitchen selection
  if (!currentKitchen) {
    return (
      <KitchenSelection
        currentUser={currentUser} userKitchens={userKitchens}
        newKitchenName={newKitchenName} setNewKitchenName={setNewKitchenName}
        setCurrentKitchen={setCurrentKitchen} createKitchen={createKitchen}
        handleLogout={handleLogout}
        theme={theme} toggleTheme={toggleTheme}
      />
    )
  }

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase()

  // Main app
  return (
    <div className="app-layout">
      {/* Sidebar Overlay (mobile) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">KP</div>
          <span className="logo-text">KitchenPulse</span>
          <button
            className="sidebar-collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {sidebarCollapsed ? (
                <polyline points="9 18 15 12 9 6"/>
              ) : (
                <>
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <line x1="9" y1="3" x2="9" y2="21"/>
                </>
              )}
            </svg>
          </button>
        </div>

        <div className="sidebar-section-label">Manage</div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => { setActiveTab('inventory'); setSidebarOpen(false) }}
            title="Inventory"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <span className="nav-label">Inventory</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'setup' ? 'active' : ''}`}
            onClick={() => { setActiveTab('setup'); setSidebarOpen(false) }}
            title="Setup"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7m-4 7h8m-8 4h8"/>
            </svg>
            <span className="nav-label">Setup</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('settings'); setSidebarOpen(false) }}
            title="Settings"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            <span className="nav-label">Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{getInitials(currentUser.name)}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{currentUser.name}</div>
              <div className="sidebar-user-role">{currentKitchen.name}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`main-area ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>

          <div className="header-right">
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {theme === 'light' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

            <button className="header-notification" title="Notifications">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {lowStockCount > 0 && <span className="notification-dot" />}
            </button>

            <div className="header-user">
              <div className="header-avatar">{getInitials(currentUser.name)}</div>
              <div className="header-user-info">
                <div className="header-user-name">{currentUser.name}</div>
                <div className="header-user-role">{isOwner ? 'Owner' : 'Member'}</div>
              </div>
            </div>

            <button className="btn-logout-header" onClick={handleLogout} title="Logout">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          {/* Stat Cards (shown on inventory tab) */}
          {activeTab === 'inventory' && (
            <div className="stat-cards">
              <div className="stat-card">
                <div className="stat-card-label">Total Items</div>
                <div className="stat-card-value-row">
                  <div className="stat-card-value">{currentInventory.length}</div>
                </div>
                <div className="stat-card-compare">In your kitchen</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-label">Low Stock</div>
                <div className="stat-card-value-row">
                  <div className="stat-card-value">{lowStockCount}</div>
                  {lowStockCount > 0 && (
                    <span className="stat-card-change down">Needs attention</span>
                  )}
                </div>
                <div className="stat-card-compare">Below threshold</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-label">Categories</div>
                <div className="stat-card-value-row">
                  <div className="stat-card-value">{currentCategories.length}</div>
                </div>
                <div className="stat-card-compare">Active categories</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-label">Total Value</div>
                <div className="stat-card-value-row">
                  <div className="stat-card-value">₹{totalValue.toLocaleString()}</div>
                </div>
                <div className="stat-card-compare">Inventory worth</div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              currentUser={currentUser} currentKitchen={currentKitchen}
              isOwner={!!isOwner} users={users}
              newMemberUsername={newMemberUsername} setNewMemberUsername={setNewMemberUsername}
              addMemberToKitchen={addMemberToKitchen} removeMemberFromKitchen={removeMemberFromKitchen}
              setCurrentKitchen={setCurrentKitchen}
            />
          )}

          {activeTab === 'setup' && (
            <SetupTab
              currentCategories={currentCategories} currentLocations={currentLocations} currentItemMasters={currentItemMasters}
              addCategory={addCategory} deleteCategory={deleteCategory}
              addLocation={addLocation} deleteLocation={deleteLocation}
              addItemMaster={addItemMaster} deleteItemMaster={deleteItemMaster}
              newCategory={newCategory} setNewCategory={setNewCategory}
              newLocation={newLocation} setNewLocation={setNewLocation}
              newItemMaster={newItemMaster} setNewItemMaster={setNewItemMaster}
              handleItemMasterImageUpload={handleItemMasterImageUpload} removeItemMasterImage={removeItemMasterImage}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryTab
              filteredInventory={filteredInventory} currentInventory={currentInventory}
              currentCategories={currentCategories} currentLocations={currentLocations} currentItemMasters={currentItemMasters}
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              filterCategory={filterCategory} setFilterCategory={setFilterCategory}
              filterLocation={filterLocation} setFilterLocation={setFilterLocation}
              showLowStockOnly={showLowStockOnly} setShowLowStockOnly={setShowLowStockOnly}
              sortBy={sortBy} setSortBy={setSortBy}
              updateInventoryUsage={updateInventoryUsage} deleteInventoryItem={deleteInventoryItem}
              newInventoryItem={newInventoryItem} setNewInventoryItem={setNewInventoryItem}
              addInventoryItem={addInventoryItem}
              handleInventoryImageUpload={handleInventoryImageUpload} removeInventoryImage={removeInventoryImage}
              successMessage={successMessage}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default App
