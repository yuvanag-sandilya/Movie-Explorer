# 🎬 Movie Explorer (Cineverse)

A high-end cinematic movie exploration and watchlist web application built with **React**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**, powered by the **TMDB API**.

---

## 📋 Table of Contents
1. [Instructions to Run Locally](#1-instructions-to-run-locally)
2. [Code Architecture & State Management Approach](#2-code-architecture--state-management-approach)
3. [Technical Problem & Solution](#3-technical-problem--solution)
4. [Features & Tech Stack](#4-features--tech-stack)

---

## 1. Instructions to Run Locally

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **TMDB API Key** (Get a free key from [The Movie Database](https://www.themoviedb.org/settings/api))

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yuvanag-sandilya/Movie-Explorer.git
   cd movie-explorer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the project root directory and add your TMDB API key:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   ```
   *(Note: The project also supports `TMDB_API_KEY` for Vercel builds).*

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 2. Code Architecture & State Management Approach

### Architecture
The project follows a clean, modular component-driven architecture:
```text
src/
├── api/            # TMDB API integration, endpoints, and data transformation helpers
├── components/     # UI components (Navbar, MovieCard, MovieModal, CiniChat, FilterDrawer, etc.)
├── hooks/          # Custom React hooks (e.g., useDebounce)
├── types/          # TypeScript interfaces and type definitions (Movie, WatchlistMovie, FilterState)
├── App.tsx         # Root component orchestrating global tabs, filters, and modals
└── main.tsx        # React root entry point
```

### State Management Approach
- **Global & Local React State**: Managed via React's built-in hooks (`useState`, `useEffect`, `useCallback`, `useRef`). Complex filters, search queries, pagination, and active modal states live at appropriate component boundaries (`App.tsx` and child components).
- **Persistent Watchlist Storage**: User watchlists and statuses (*Plan to Watch*, *Watched*) are synchronized with `localStorage` via custom React `useEffect` hooks, providing instant optimistic UI updates and data persistence across sessions.
- **Debounced Search**: Search queries use a custom `useDebounce` hook to prevent excessive API requests while typing.
- **Infinite Scrolling**: Implements the browser's native `IntersectionObserver` API for seamless infinite pagination when browsing discover/trending movies.

---

## 3. Technical Problem & Solution

### Problem: Vercel Build Environment Variable Stripping & Mock Fallbacks
**Context**: When deploying the application to Vercel, the TMDB API key (configured as `TMDB_API_KEY`) was not being detected during production builds. Vite by default only exposes environment variables prefixed with `VITE_` to client-side code (`import.meta.env`). Because the key lacked the `VITE_` prefix, Vite stripped it during bundling, causing the app to fall back to default mock/empty data on Vercel while working locally.

**Solution**: 
1. Updated `vite.config.ts` to explicitly configure `envPrefix` to accept both `VITE_` and `TMDB_` prefixes:
   ```ts
   export default defineConfig({
     plugins: [react(), tailwindcss()],
     envPrefix: ['VITE_', 'TMDB_'],
   })
   ```
2. Ensured Vercel project environment variables supported both names. This allowed seamless client-side access to the API key in production without breaking existing local environment configurations.

---

## 4. Features & Tech Stack

- **Discover & Trending Masterpieces**: Infinite scroll browsing for movies and TV series.
- **Cinematic Hero Banner**: Spotlight view with trailers and synopsis.
- **Cini AI Companion**: Interactive squircle chat widget with hover expansion, quick prompt suggestions, and contextual watchlist integration.
- **Movie Roulette**: Random picker tool for indecisive movie nights.
- **Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Lucide React.
