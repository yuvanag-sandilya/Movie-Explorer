import { useEffect } from 'react';
import { GENRES } from '../api/tmdb';
import type { FilterState } from '../types/movie';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  setFilters
}) => {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const resetFilters = () => {
    setFilters({
      mediaType: 'all',
      genreId: null,
      sortBy: 'popularity.desc',
      searchQuery: ''
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="relative w-full max-w-md bg-[#12141c] border-l border-white/10 p-6 sm:p-8 overflow-y-auto z-10 flex flex-col justify-between shadow-2xl"
        >
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-400" />
                Filters & Sorting
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Type Segmented Control */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Media Type
              </label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-black/40 rounded-2xl border border-white/10">
                {(['all', 'movie', 'tv'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilters((prev) => ({ ...prev, mediaType: type }))}
                    className={`py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                      filters.mediaType === type
                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {type === 'all' ? 'All' : type === 'movie' ? 'Movies' : 'TV Shows'}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Sort Results By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))
                }
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-all"
              >
                <option value="popularity.desc">Most Popular</option>
                <option value="vote_average.desc">Highest Rated</option>
                <option value="release_date.desc">Newest Release</option>
              </select>
            </div>

            {/* Genres */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Genre
              </label>
              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-1">
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, genreId: null }))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    filters.genreId === null
                      ? 'bg-amber-500 text-black shadow'
                      : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  All Genres
                </button>
                {GENRES.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setFilters((prev) => ({ ...prev, genreId: g.id }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      filters.genreId === g.id
                        ? 'bg-amber-500 text-black shadow'
                        : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-white/10 flex items-center gap-4">
            <button
              onClick={resetFilters}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-semibold text-xs transition-colors border border-white/10"
            >
              <RotateCcw className="w-4 h-4" />
              Reset All
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors shadow-lg shadow-amber-500/30"
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
