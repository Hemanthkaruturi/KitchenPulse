# KitchenPulse

A smart kitchen inventory tracker to help you manage your groceries, spices, and kitchen items efficiently. Never run out of essentials again!

## Features

### Current Features (v2.2)

- **Authentication**: User signup/signin with demo accounts included
- **Multi-User Kitchens**: Create kitchens, invite members, and manage roles (Owner/Member)
- **Item Master Management**: Define reusable item templates with category, unit, image, and comments
- **Inventory Tracking**: Add inventory items with price, location, low-stock threshold, and images
- **Smart Units**: Track items by weight (g/kg), volume (ml/l), or pieces
- **Usage Tracking**: Update usage by percentage - automatically calculates remaining amount, value, and price per unit
- **Low Stock Alerts**: Visual warnings when items fall below your set threshold
- **Search & Filters**: Search by name, filter by category/location, sort by name/date/stock level
- **Categories & Locations**: Organize items by custom categories and storage locations
- **Responsive Design**: Optimized for both mobile and desktop devices
- **Local Storage**: Data persists in your browser with version-controlled seeding
- **Dark Mode Support**: Automatic dark mode based on system preferences

### Coming Soon

- **Backend Integration**: Database for persistent data across devices
- **Shopping Lists**: Auto-generate shopping lists based on low stock items
- **Analytics**: View usage patterns and consumption trends
- **Barcode Scanner**: Quick item addition via barcode scanning
- **Google Sign-In**: OAuth-based authentication

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kitchenpulse
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

### Demo Accounts

| Username     | Password | Role   |
|-------------|----------|--------|
| john_owner  | pass123  | Owner  |
| jane_user   | pass123  | Member |
| bob_user    | pass123  | Member |

## How to Use

### Logging In

1. Use one of the demo accounts above or create a new account via Sign Up
2. Select or create a kitchen to get started

### Setting Up Your Kitchen

1. Go to the **Setup** tab
2. Add **Categories** (e.g., Spices, Dairy, Grains)
3. Add **Locations** (e.g., Top Shelf, Pantry, Fridge)
4. Add **Item Masters** — reusable templates with name, category, default unit, and optional image/comments

### Adding Inventory

1. Go to the **Inventory** tab and switch to the **Add Inventory** sub-tab
2. Select an item master, location, amount, price, and low-stock threshold
3. Optionally add comments and an image
4. Click "Add to Inventory" — a success message confirms the addition

### Viewing & Searching Inventory

1. Go to the **Inventory** tab (defaults to **View Inventory**)
2. Use the search bar to find items by name
3. Filter by category, location, or low-stock-only
4. Sort by name, purchase date, or stock level

### Updating Usage

1. Find the item in the inventory view
2. Enter the percentage used in the "Update Usage" field
3. Click "Update" or press Enter
4. The app calculates remaining amount, percentage, price per unit, and remaining value

### Managing Members (Owner Only)

1. Go to the **Settings** tab
2. Add members by username
3. Remove members as needed

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: CSS with CSS Variables (dark mode via `prefers-color-scheme`)
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: LocalStorage with version-controlled initialization

## Project Structure

```
kitchenpulse/
├── src/
│   ├── types.ts                  # Interfaces and type aliases
│   ├── data.ts                   # App initialization and seed data
│   ├── utils.ts                  # Inventory helper functions
│   ├── App.tsx                   # Root component (state + routing)
│   ├── App.css                   # Component styles
│   ├── main.tsx                  # React entry point
│   ├── index.css                 # Global styles and CSS variables
│   └── components/
│       ├── AuthScreen.tsx        # Login / Sign Up screen
│       ├── KitchenSelection.tsx  # Kitchen picker / creator
│       ├── SettingsTab.tsx       # Kitchen info and member management
│       ├── SetupTab.tsx          # Categories, Locations, Item Masters
│       ├── InventoryTab.tsx      # Inventory tab with View/Add sub-tabs
│       ├── InventoryView.tsx     # Search, filter, and inventory cards
│       └── InventoryAdd.tsx      # Add inventory form
├── index.html                    # HTML template
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── vite.config.ts                # Vite config
```

## Data Model

```typescript
interface User {
  id: string; username: string; password: string; name: string
}

interface Kitchen {
  id: string; name: string; ownerId: string; memberIds: string[]
}

interface Category {
  id: string; kitchenId: string; name: string
}

interface Location {
  id: string; kitchenId: string; name: string
}

interface ItemMaster {
  id: string; kitchenId: string; name: string
  categoryId: string; defaultUnit: 'g' | 'kg' | 'l' | 'ml' | 'pcs'
  imageUrl?: string; comments?: string
}

interface InventoryItem {
  id: string; kitchenId: string; itemMasterId: string; locationId: string
  totalAmount: number; usedAmount: number; purchaseDate: string
  price: number; lowStockThreshold: number
  imageUrl?: string; comments?: string
}
```

## Roadmap

### Phase 1: Core Features (Completed)
- [x] Basic item CRUD operations
- [x] Usage tracking with percentage/weight calculation
- [x] Low stock alerts
- [x] Responsive UI
- [x] Local storage persistence

### Phase 2: Authentication & Multi-User (Completed)
- [x] User signup/signin
- [x] Kitchen creation and management
- [x] Multi-user support with roles (Owner/Member)
- [x] Member invitations and removal
- [x] Search, filter, and sort inventory
- [x] Item Masters with images and comments
- [x] Location-based inventory tracking
- [x] Price tracking and value calculations

### Phase 3: Backend Integration
- [ ] RESTful API
- [ ] Database setup (PostgreSQL/MongoDB)
- [ ] Data synchronization
- [ ] Cloud storage

### Phase 4: Advanced Features
- [ ] Google Sign-In integration
- [ ] Shopping list generation
- [ ] Usage analytics and insights
- [ ] Recipe integration
- [ ] Barcode scanner
- [ ] Push notifications for low stock
- [ ] Export data (CSV, PDF)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
