import React from 'react';
import { Film, Search, Bookmark, Dices, SlidersHorizontal } from 'lucide-react';

interface NavbarProps {
  activeTab: 'discover' | 'watchlist' | 'roulette';
  setActiveTab: (tab: 'discover' | 'watchlist' | 'roulette') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  watchlistCount: number;
  onToggleFilterDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  watchlistCount,
  onToggleFilterDrawer
}) => {

  return (
    <header className="sticky top-0 z-40 w-full glass-dropdown border-b border-white/10 px-4 sm:px-8 py-3.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('discover')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/15 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white">
              Movie Explorer
            </span>
            <span className="block text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
              Cinematic Guide
            </span>
          </div>
        </div>

        {/* Search Bar (Only shown on Discover tab or auto-switches) */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeTab !== 'discover') setActiveTab('discover');
            }}
            placeholder="Search movies, TV shows, actors..."
            className="w-full bg-zinc-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
          />
        </div>

        {/* Navigation & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Filter Drawer Toggle */}
          {activeTab === 'discover' && (
            <button
              onClick={onToggleFilterDrawer}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
              title="Filters & Sorting"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          )}

          {/* Discover Tab */}
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'discover'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Discover
          </button>

          {/* Watchlist Tab */}
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'watchlist'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Watchlist</span>
            {watchlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center shadow">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Roulette Tab */}
          <button
            onClick={() => setActiveTab('roulette')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'roulette'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="Movie Roulette (Random Picker)"
          >
            <Dices className="w-4 h-4" />
            <span className="hidden lg:inline">Roulette</span>
          </button>
        </div>
      </div>
    </header>
  );
};
