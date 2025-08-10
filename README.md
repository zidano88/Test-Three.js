# My 3D App

A React-based 3D application built with Three.js, featuring multiple interactive routes with different animation techniques.

## Features

- **8 Different Routes**: Each showcasing different 3D animation and interaction techniques
- **Interactive 3D Scenes**: Earth, satellites, and space environments
- **Multiple Animation Libraries**: GSAP, React Spring, and custom animations
- **Responsive Navigation**: Easy switching between different routes
- **Modern UI**: Clean, space-themed interface

## Routes Overview

1. **Home** (`/`) - Default SpaceScene with basic 3D environment
2. **Route 1** (`/route1`) - Automatic timed camera transitions
3. **Route 2** (`/route2`) - Interactive camera controls with keyboard navigation
4. **Route 3** (`/route3`) - Scroll-based view transitions
5. **Route 4** (`/route4`) - GSAP-powered smooth camera animations
6. **Route 5** (`/route5`) - GSAP with interactive controls
7. **Route 6** (`/route6`) - GSAP with scroll-based transitions
8. **Route 7** (`/route7`) - React Spring animations with automatic transitions
9. **Route 8** (`/route8`) - React Spring with interactive controls

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building

Build for production:

```bash
npm run build
```

## Navigation

- Use the navigation bar at the top to switch between routes
- Each route has its own unique interaction patterns
- The current route is highlighted in green
- All routes maintain the same 3D scene but with different camera behaviors

## Technologies Used

- **React 19** - UI framework
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for React Three Fiber
- **GSAP** - Professional animation library
- **React Spring** - Spring physics-based animations
- **React Router** - Client-side routing
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

## Project Structure

```
src/
├── components/          # 3D components (Earth, Satellite, etc.)
├── routes/             # Individual route components
│   ├── route1/         # Automatic transitions
│   ├── route2/         # Interactive controls
│   ├── route3/         # Scroll-based
│   ├── route4/         # GSAP animations
│   ├── route5/         # GSAP + controls
│   ├── route6/         # GSAP + scroll
│   ├── route7/         # React Spring
│   └── route8/         # React Spring + controls
├── App.tsx             # Main app with routing
└── main.tsx            # Entry point
```

## Browser Navigation

You can navigate directly to any route by typing the URL:

- `http://localhost:5173/` - Home
- `http://localhost:5173/route1` - Route 1
- `http://localhost:5173/route2` - Route 2
- And so on...

## Contributing

Feel free to add new routes or enhance existing ones with different animation techniques!
