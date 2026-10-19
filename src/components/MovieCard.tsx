import type { Movie, WatchlistMovie } from '../types/movie';
import { getImageUrl } from '../api/tmdb';
import { Star, Bookmark, Check, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
  watchlist: WatchlistMovie[];
  onToggleWatchlist: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelect,
  watchlist,
  onToggleWatchlist
}) => {
  const title = movie.title || movie.name || 'Untitled';
  const releaseDate = movie.release_date || movie.first_air_date || '';
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';

  const watchlistItem = watchlist.find((item) => item.id === movie.id);
  const isInWatchlist = !!watchlistItem;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onClick={() => onSelect(movie)}
      className="group relative aspect-[2/3] cursor-pointer rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-amber-500/50 shadow-lg hover:shadow-2xl hover:shadow-amber-500/15 transition-all duration-300 hover:scale-[1.03] flex flex-col justify-between bg-zinc-900"
    >
      {/* Poster Image */}
      <div className="absolute inset-0 w-full h-full bg-zinc-900 overflow-hidden">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={title}
          className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
      </div>

      {/* Top Badges */}
      <div className="relative z-10 p-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-amber-400 font-bold text-xs flex items-center gap-1 border border-white/10 shadow">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {rating}
          </span>
          <span className="px-2 py-1 rounded-lg bg-black/75 backdrop-blur-md text-zinc-300 uppercase font-semibold text-[10px] border border-white/10">
            {movie.media_type || 'movie'}
          </span>
        </div>

        {/* Quick Watchlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist(movie);
          }}
          className={`p-2.5 rounded-xl backdrop-blur-md transition-all duration-200 shadow-sm ${
            isInWatchlist
              ? 'bg-white text-black font-semibold'
              : 'bg-black/60 text-white hover:bg-white hover:text-black border border-white/15'
          }`}
          title={isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
        >
          {isInWatchlist ? (
            watchlistItem.status === 'Watched' ? (
              <Eye className="w-4 h-4" />
            ) : (
              <Check className="w-4 h-4 stroke-[2.5]" />
            )
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Bottom Metadata */}
      <div className="relative z-10 p-4 flex flex-col justify-end mt-auto bg-gradient-to-t from-[#090a0f] via-[#090a0f]/80 to-transparent pt-8">
        <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-amber-400 transition-colors">
          {title}
        </h3>
        <div className="flex items-center justify-between text-xs text-zinc-400 mt-1">
          <span>{year}</span>
          {isInWatchlist && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                watchlistItem.status === 'Watched'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {watchlistItem.status}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
