import { useState, useEffect } from 'react'
import './App.css'
import { User, Kitchen, Category, Location, ItemMaster, InventoryItem, Tab } from './types'
import { initializeAppData } from './data'
import { isLowStock, getRemainingPercentage } from './utils'
import AuthScreen from './components/AuthScreen'
import KitchenSelection from './components/KitchenSelection'
import SettingsTab from './components/SettingsTab'
import SetupTab from './components/SetupTab'
import InventoryTab from './components/InventoryTab'

const initialData = initializeAppData()

function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(initialData.currentUser)
  const [currentKitchen, setCurrentKitchen] = useState<Kitchen | null>(initialData.currentKitchen)
  const [isLogin, setIsLogin] = useState(true)
  const [authForm, setAuthForm] = useState({ username: '', password: '', name: '' })

  // Navigation
  const [activeTab, setActiveTab] = useState<Tab>('inventory')

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

  // Auth screen
  if (!currentUser) {
    return (
      <AuthScreen
        isLogin={isLogin} setIsLogin={setIsLogin}
        authForm={authForm} setAuthForm={setAuthForm}
        handleLogin={handleLogin} handleSignup={handleSignup}
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
      />
    )
  }

  // Main app
  return (
    <div className="app">
      <header className="header">
        <h1>KitchenPulse</h1>
        <div className="header-info">
          <span className="user-info">{currentUser.name} | {currentKitchen.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      <nav className="main-tabs">
        <button className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>Inventory</button>
        <button className={`tab-btn ${activeTab === 'setup' ? 'active' : ''}`} onClick={() => setActiveTab('setup')}>Setup</button>
        <button className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>Settings</button>
      </nav>

      <main className="container">
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
  )
}

export default App
