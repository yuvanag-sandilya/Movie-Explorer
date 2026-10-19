import { useState, useEffect, useCallback, useRef } from 'react';
import type { Movie, WatchlistMovie, FilterState } from './types/movie';
import { fetchMovies } from './api/tmdb';
import { useDebounce } from './hooks/useDebounce';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MovieCard } from './components/MovieCard';
import { SkeletonLoader } from './components/SkeletonLoader';
import { MovieModal } from './components/MovieModal';
import { FilterDrawer } from './components/FilterDrawer';
import { WatchlistManager } from './components/WatchlistManager';
import { RouletteModal } from './components/RouletteModal';
import { CiniChat } from './components/CiniChat';
import { Film, AlertCircle } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'discover' | 'watchlist' | 'roulette'>('discover');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [filters, setFilters] = useState<FilterState>({
    mediaType: 'all',
    genreId: null,
    sortBy: 'popularity.desc',
    searchQuery: ''
  });

  const debouncedSearch = useDebounce(filters.searchQuery, 300);

  // Watchlist state with localStorage persistence
  const [watchlist, setWatchlist] = useState<WatchlistMovie[]>(() => {
    try {
      const saved = localStorage.getItem('cineverse_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cineverse_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Modals & Drawers
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Pagination & Infinite Scroll
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Fetch movies on filter / search change
  const loadMovies = useCallback(async (pageNum: number, reset = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMovies(
        debouncedSearch,
        pageNum,
        filters.mediaType,
        filters.genreId,
        filters.sortBy
      );
      setMovies((prev) => (reset ? data.results : [...prev, ...data.results]));
      setTotalPages(data.total_pages);
    } catch (err: any) {
      setError(err.message || 'Failed to load movies.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters.mediaType, filters.genreId, filters.sortBy]);

  useEffect(() => {
    setPage(1);
    loadMovies(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters.mediaType, filters.genreId, filters.sortBy]);

  // Infinite Scroll IntersectionObserver
  useEffect(() => {
    const currentLoader = loaderRef.current;
    if (!currentLoader) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < totalPages) {
          const nextPage = page + 1;
          setPage(nextPage);
          loadMovies(nextPage, false);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(currentLoader);
    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [loading, page, totalPages, loadMovies]);

  // Watchlist handlers (Optimistic UI)
  const handleToggleWatchlist = (movie: Movie) => {
    setWatchlist((prev) => {
      const exists = prev.some((item) => item.id === movie.id);
      if (exists) {
        return prev.filter((item) => item.id !== movie.id);
      } else {
        const newItem: WatchlistMovie = {
          ...movie,
          status: 'Plan to Watch',
          addedAt: Date.now()
        };
        return [newItem, ...prev];
      }
    });
  };

  const handleUpdateStatus = (id: number, status: 'Plan to Watch' | 'Watched') => {
    setWatchlist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const handleImportWatchlist = (imported: WatchlistMovie[]) => {
    setWatchlist(imported);
    alert('Watchlist successfully imported!');
  };

  const featuredMovie = movies[0];

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={filters.searchQuery}
        setSearchQuery={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
        watchlistCount={watchlist.length}
        onToggleFilterDrawer={() => setIsFilterDrawerOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        {error && (
          <div className="flex items-center gap-3 p-4 mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {activeTab === 'discover' && (
          <div className="flex flex-col gap-8">
            {/* Cinematic Hero Banner (Only shown when not actively searching) */}
            {!filters.searchQuery && featuredMovie && (
              <HeroBanner
                movie={featuredMovie}
                onSelect={setSelectedMovie}
                onToggleWatchlist={handleToggleWatchlist}
                isInWatchlist={watchlist.some((w) => w.id === featuredMovie.id)}
              />
            )}

            {/* Section Title */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-amber-400" />
                {filters.searchQuery ? `Search Results for "${filters.searchQuery}"` : 'Trending Masterpieces'}
              </h2>
            </div>

            {/* Movie Grid */}
            {movies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {movies.map((movie) => (
                  <MovieCard
                    key={`${movie.id}-${movie.media_type}`}
                    movie={movie}
                    onSelect={setSelectedMovie}
                    watchlist={watchlist}
                    onToggleWatchlist={handleToggleWatchlist}
                  />
                ))}
              </div>
            ) : (
              !loading && (
                <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-3xl border border-white/10">
                  <Film className="w-12 h-12 text-zinc-600 mb-3" />
                  <p className="text-zinc-300 font-bold text-lg">No movies found</p>
                  <p className="text-zinc-500 text-sm">Try adjusting your search query or filters.</p>
                </div>
              )
            )}

            {/* Loading Skeleton / Infinite Scroll trigger */}
            <div ref={loaderRef} className="py-6 flex justify-center">
              {loading && <SkeletonLoader count={5} />}
            </div>
          </div>
        )}

        {activeTab === 'watchlist' && (
          <WatchlistManager
            watchlist={watchlist}
            onSelectMovie={setSelectedMovie}
            onToggleWatchlist={handleToggleWatchlist}
            onImportWatchlist={handleImportWatchlist}
          />
        )}

        {activeTab === 'roulette' && (
          <RouletteModal movies={movies.length > 0 ? movies : watchlist} onSelectMovie={setSelectedMovie} />
        )}
      </main>

      {/* Modals & Drawers */}
      <MovieModal
        key={selectedMovie?.id}
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        watchlist={watchlist}
        onToggleWatchlist={handleToggleWatchlist}
        onUpdateStatus={handleUpdateStatus}
      />

      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />

      <CiniChat
        movies={movies}
        watchlist={watchlist}
        onSelectMovie={setSelectedMovie}
        onToggleWatchlist={handleToggleWatchlist}
      />

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-8 px-4 sm:px-8 text-center text-xs text-zinc-500 glass-panel mt-16">
        <p>Movie Explorer • High-End Cinematic Movie Explorer & Watchlist Application</p>
        <p className="mt-1">Built with React, TypeScript, Tailwind CSS, & Framer Motion.</p>
      </footer>
    </div>
  );
}
export default App;
