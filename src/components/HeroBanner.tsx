import type { Movie } from '../types/movie';
import { getImageUrl } from '../api/tmdb';
import { Play, Star, Plus, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroBannerProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
  onToggleWatchlist: (movie: Movie) => void;
  isInWatchlist: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  movie,
  onSelect,
  onToggleWatchlist,
  isInWatchlist
}) => {
  if (!movie) return null;

  const title = movie.title || movie.name || 'Featured Title';
  const backdrop = getImageUrl(movie.backdrop_path, 'original');
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';
  const year = (movie.release_date || movie.first_air_date || '').split('-')[0];

  return (
    <div className="relative w-full h-[500px] sm:h-[600px] rounded-3xl overflow-hidden glass-panel border border-white/15 mb-10 shadow-2xl">
      {/* Background Image & Cinematic Gradients */}
      <div className="absolute inset-0">
        <img
          src={backdrop}
          alt={title}
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090a0f] via-[#090a0f]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-2xl flex flex-col justify-end p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4"
        >
          {/* Metadata Pills */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center gap-1.5 shadow">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              {rating} / 10
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md text-zinc-300 text-xs font-medium border border-white/10">
              {year}
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md text-zinc-300 uppercase text-xs font-semibold tracking-wider border border-white/10">
              {movie.media_type || 'movie'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
            {title}
          </h1>

          {/* Overview */}
          <p className="text-zinc-300 text-sm sm:text-base line-clamp-3 leading-relaxed drop-shadow">
            {movie.overview}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onSelect(movie)}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-sm transition-all duration-200 hover:bg-zinc-200 shadow-sm"
            >
              <Play className="w-4 h-4 fill-black" />
              Explore Details
            </button>

            <button
              onClick={() => onToggleWatchlist(movie)}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm backdrop-blur-md transition-all duration-200 border ${
                isInWatchlist
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
                  : 'bg-white/10 text-white border-white/15 hover:bg-white/20'
              }`}
            >
              {isInWatchlist ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  In Watchlist
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add to Watchlist
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
