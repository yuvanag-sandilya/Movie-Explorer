import React, { useState } from 'react';
import type { WatchlistMovie, Movie } from '../types/movie';
import { MovieCard } from './MovieCard';
import { Bookmark, Download, Upload, Search, Film } from 'lucide-react';

interface WatchlistManagerProps {
  watchlist: WatchlistMovie[];
  onSelectMovie: (movie: Movie) => void;
  onToggleWatchlist: (movie: Movie) => void;
  onImportWatchlist: (items: WatchlistMovie[]) => void;
}

export const WatchlistManager: React.FC<WatchlistManagerProps> = ({
  watchlist,
  onSelectMovie,
  onToggleWatchlist,
  onImportWatchlist
}) => {
  const [statusFilter, setStatusFilter] = useState<'All' | 'Plan to Watch' | 'Watched'>('All');
  const [query, setQuery] = useState('');

  const filtered = watchlist.filter((item) => {
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const title = (item.title || item.name || '').toLowerCase();
    const matchesQuery = title.includes(query.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const exportWatchlist = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(watchlist, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cineverse_watchlist_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importWatchlist = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onImportWatchlist(parsed);
          }
        } catch {
          alert('Invalid JSON file format.');
        }
      };
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Bookmark className="w-7 h-7 text-black" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Watchlist</h1>
            <p className="text-zinc-400 text-sm">
              Manage your personal cinematic collection ({watchlist.length} saved)
            </p>
          </div>
        </div>

        {/* Export / Import Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={exportWatchlist}
            disabled={watchlist.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-semibold text-xs transition-colors border border-white/10 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-semibold text-xs transition-colors border border-white/10 cursor-pointer">
            <Upload className="w-4 h-4" />
            Import JSON
            <input type="file" accept=".json" onChange={importWatchlist} className="hidden" />
          </label>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-[#12141c] rounded-2xl border border-white/10 w-full sm:w-auto">
          {(['All', 'Plan to Watch', 'Watched'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex-1 sm:flex-none ${
                statusFilter === status
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Watchlist Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search saved movies..."
            className="w-full bg-[#12141c] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-all"
          />
        </div>
      </div>

      {/* Grid or Empty State */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filtered.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={onSelectMovie}
              watchlist={watchlist}
              onToggleWatchlist={onToggleWatchlist}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-3xl border border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500 mb-4 border border-white/10">
            <Film className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No movies found in watchlist</h3>
          <p className="text-zinc-400 text-sm max-w-sm">
            {watchlist.length === 0
              ? 'Start exploring movies and click the bookmark icon to save them to your personal collection.'
              : 'No movies match your current status filter or search query.'}
          </p>
        </div>
      )}
    </div>
  );
};
