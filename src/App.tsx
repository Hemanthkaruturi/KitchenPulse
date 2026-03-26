import { useState, useEffect } from 'react'
import './App.css'
import { User, Kitchen, Category, Location, ItemMaster, InventoryItem, Tab } from './types'
import { initializeAppData } from './data'
import { isLowStock, getRemainingPercentage } from './utils'
import { useTheme } from './ThemeContext'
import AuthScreen from './components/AuthScreen'
import KitchenSelection from './components/KitchenSelection'
import SettingsTab from './components/SettingsTab'
import SetupTab from './components/SetupTab'
import InventoryTab from './components/InventoryTab'

const initialData = initializeAppData()

const NAV_ITEMS: { id: Tab; label: string; icon: string }[] = [
  { id: 'inventory', label: 'Inventory', icon: '\u{1F4E6}' },
  { id: 'setup', label: 'Setup', icon: '\u{2699}\uFE0F' },
  { id: 'settings', label: 'Settings', icon: '\u{1F527}' },
]

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

  // Compute stats
  const lowStockCount = currentInventory.filter(i => isLowStock(i)).length
  const totalValue = currentInventory.reduce((sum, i) => sum + i.price, 0)

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

  const tabLabels: Record<Tab, string> = {
    inventory: 'Inventory',
    setup: 'Setup',
    settings: 'Settings',
  }

  // Main app
  return (
    <div className="app-layout">
      {/* Sidebar Overlay (mobile) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">K</div>
          <span className="brand-name">KitchenPulse</span>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Manage</div>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{currentUser.name}</div>
              <div className="sidebar-user-role">{currentKitchen.name}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="main-area">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
              &#9776;
            </button>
            <div className="breadcrumb">
              <span>Home</span>
              <span className="breadcrumb-sep">&gt;</span>
              <span className="breadcrumb-current">{tabLabels[activeTab]}</span>
            </div>
          </div>

          <div className="header-right">
            <div className="header-search">
              <span className="header-search-icon">&#128269;</span>
              <input
                type="text"
                className="header-search-input"
                placeholder="Search here"
              />
            </div>

            <button className="header-icon-btn theme-toggle-icon" onClick={toggleTheme} title="Toggle theme">
              {theme === 'light' ? '\u{2600}\uFE0F' : '\u{1F319}'}
            </button>

            <button className="header-icon-btn" onClick={handleLogout} title="Logout">
              &#x23FB;
            </button>

            <div className="header-user">
              <div className="header-avatar">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="header-user-details">
                <span className="header-user-name">{currentUser.name}</span>
                <span className="header-user-role">{isOwner ? 'Owner' : 'Member'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          {/* Stats Row */}
          {activeTab === 'inventory' && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Items</div>
                <div className="stat-value-row">
                  <span className="stat-value">{currentInventory.length}</span>
                </div>
                <div className="stat-compare">In {currentKitchen.name}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Item Masters</div>
                <div className="stat-value-row">
                  <span className="stat-value">{currentItemMasters.length}</span>
                </div>
                <div className="stat-compare">Templates defined</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Low Stock</div>
                <div className="stat-value-row">
                  <span className="stat-value">{lowStockCount}</span>
                  {lowStockCount > 0 && (
                    <span className="stat-badge down">Needs attention</span>
                  )}
                </div>
                <div className="stat-compare">Below threshold</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Value</div>
                <div className="stat-value-row">
                  <span className="stat-value">{'\u20B9'}{totalValue.toFixed(0)}</span>
                </div>
                <div className="stat-compare">Inventory worth</div>
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
