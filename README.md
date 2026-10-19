# 🎬 Movie Explorer (Cineverse)

A high-end cinematic movie exploration and watchlist web application built with **React**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**, powered by the **TMDB API**.

![Movie Explorer Banner](https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop)

---

## ✨ Features

- **Discover & Trending Masterpieces**: Browse trending movies and TV series with infinite scrolling and real-time search debouncing.
- **Cinematic Hero Banner**: Featured spotlight banner with quick trailers and overview details.
- **Advanced Filtering**: Filter by media type (movies vs TV shows), genres, and sorting options via a smooth slide-over drawer.
- **Immersive Movie Modal**: Comprehensive details including runtime, ratings, cast members, high-res posters, backdrop trailers, and "More Like This" recommendations.
- **Watchlist & Tracker**: Manage your watchlist with status tags (*Plan to Watch*, *Watched*), JSON import/export, and local storage persistence.
- **Movie Roulette**: Can't decide what to watch? Spin the roulette for random cinematic picks from your catalog or watchlist.
- **Cini AI Companion**: Interactive AI assistant chat widget featuring a micro-interactive squircle launcher that expands on hover, quick prompts, and contextual movie recommendations.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API**: TMDB (The Movie Database) API

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- TMDB API Key ([Get one here](https://www.themoviedb.org/settings/api))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yuvanag-sandilya/Movie-Explorer.git
   cd movie-explorer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your TMDB API key:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   ```
   *(Note: `TMDB_API_KEY` is also supported for Vercel deployments)*

4. Run the development server:
   ```bash
   npm run dev
   ```

---

## 📦 Deployment on Vercel

1. Import your GitHub repository to [Vercel](https://vercel.com).
2. Add the environment variable under Project Settings:
   - Name: `VITE_TMDB_API_KEY` (or `TMDB_API_KEY`)
   - Value: Your TMDB API key
3. Deploy!

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
