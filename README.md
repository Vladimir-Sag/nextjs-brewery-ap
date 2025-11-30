# 🍺 Brewery Explorer

A React/Next.js application for exploring breweries with advanced scrolling and selection features.

## ✨ Features

- **Smart Infinite Scroll** - Always maintains 15 breweries with automatic loading
- **Multi-selection** - Right-click to select/deselect multiple breweries
- **Responsive Carousel** - 5 breweries visible at a time with smooth transitions
- **State Management** - Efficient global state with Zustand
- **Type Safety** - Built with TypeScript

## 🛠️ Technologies

- **React.js** with Next.js framework
- **Zustand** for state management ([GitHub](https://github.com/pmndrs/zustand))
- **TypeScript** for type safety
- **Tailwind CSS** for styling

## 📡 API Resources

- `GET https://api.openbrewerydb.org/v1/breweries?per_page=15&page=1` - Fetch breweries list
- `GET https://api.openbrewerydb.org/v1/breweries/{id}` - Fetch single brewery details

## 🎮 Implementation Details

### ✅ Core Requirements
- [x] Display 15 breweries on initial load
- [x] Save data in Zustand store
- [x] Multi-select with right-click
- [x] Dynamic "Delete" button appears when selections exist
- [x] Remove selected items while maintaining 15 breweries
- [x] Deselect on second right-click
- [x] Left-click navigates to brewery details page
- [x] Auto-fetch next page when data runs low

### ✅ Additional Features
- [x] Show only 5 breweries at a time
- [x] Maintain 15 breweries in render pool
- [x] Lazy scroll: replace first 5 with next 5 when scrolling to bottom

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

Open http://localhost:3000 to view the application.

🎯 How to Use
Scroll: Use ↑↓ arrows, mouse wheel, or click Up/Down buttons

Select: Right-click on brewery cards to select multiple

Delete: Click "Delete" button to remove selected breweries

View Details: Left-click on any card to see brewery information

🌐 Live Demo


📄 License
MIT License - feel free to use this project for learning purposes!
