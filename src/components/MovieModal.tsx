import { useEffect, useState } from 'react';
import type { Movie, WatchlistMovie } from '../types/movie';
import { fetchMovieDetails, fetchSimilarMovies, getImageUrl } from '../api/tmdb';
import { X, Star, Play, Bookmark, Film, Clock, Calendar, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
  watchlist: WatchlistMovie[];
  onToggleWatchlist: (movie: Movie) => void;
  onUpdateStatus: (id: number, status: 'Plan to Watch' | 'Watched') => void;
  onSelectMovie?: (movie: Movie) => void;
}

export const MovieModal: React.FC<MovieModalProps> = ({
  movie,
  onClose,
  watchlist,
  onToggleWatchlist,
  onUpdateStatus,
  onSelectMovie
}) => {
  const [details, setDetails] = useState<Movie | null>(movie);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  useEffect(() => {
    if (!movie) return;

    document.body.style.overflow = 'hidden';

    const loadData = async () => {
      try {
        const [fullDetails, similar] = await Promise.all([
          fetchMovieDetails(movie.id, movie.media_type || 'movie'),
          fetchSimilarMovies(movie.id, movie.media_type || 'movie')
        ]);
        setDetails(fullDetails);
        setSimilarMovies(similar);
      } catch (err) {
        console.error(err);
        // Fallback to showing the original movie on error
        setDetails(movie);
      }
    };
    loadData();

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [movie]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!movie || !details) return null;

  const title = details.title || details.name || 'Untitled';
  const releaseDate = details.release_date || details.first_air_date || '';
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const rating = details.vote_average ? details.vote_average.toFixed(1) : 'NR';
  const runtime = details.runtime || (details.episode_run_time ? details.episode_run_time[0] : null);
  const backdrop = getImageUrl(details.backdrop_path, 'original');
  const poster = getImageUrl(details.poster_path);

  const watchlistItem = watchlist.find((item) => item.id === details.id);
  const isInWatchlist = !!watchlistItem;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, type: 'spring', damping: 25 }}
          className="relative w-full max-w-4xl bg-[#12141c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 my-8 max-h-[90vh] flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/75 hover:bg-amber-500 hover:text-black text-white backdrop-blur-md border border-white/10 transition-all shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto flex-grow">
            {/* Hero Banner inside Modal */}
            <div className={`relative w-full overflow-hidden bg-black transition-all duration-300 ${isPlayingTrailer ? 'h-[360px] sm:h-[450px]' : 'h-[320px] sm:h-[400px]'}`}>
              {isPlayingTrailer && details.trailer_key ? (
                <div className="relative w-full h-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${details.trailer_key}?autoplay=1`}
                    title="Movie Trailer"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  {/* Smooth translucent transition gradient at bottom of trailer */}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#12141c] via-[#12141c]/50 to-transparent pointer-events-none" />
                </div>
              ) : (
                <>
                  <img
                    src={backdrop}
                    alt={title}
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12141c] via-[#12141c]/40 to-transparent" />

                  {/* Play Trailer Overlay Button */}
                  {details.trailer_key && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => setIsPlayingTrailer(true)}
                        className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-sm shadow-xl hover:bg-zinc-200 transition-all"
                      >
                        <Play className="w-5 h-5 fill-black" />
                        Watch Trailer
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Content Body */}
            <div className={`p-6 sm:p-8 flex flex-col gap-6 relative z-10 transition-all ${isPlayingTrailer ? 'mt-2' : '-mt-16'}`}>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Poster Thumbnail */}
                <div className="w-36 sm:w-48 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 flex-shrink-0 hidden sm:block bg-zinc-900">
                  <img src={poster} alt={title} className="w-full h-full object-cover" />
                </div>

                {/* Metadata & Title */}
                <div className="flex flex-col gap-3 flex-grow">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center gap-1 shadow">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {rating} / 10
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-white/10 text-zinc-300 text-xs font-medium flex items-center gap-1.5 border border-white/10">
                      <Calendar className="w-3.5 h-3.5" />
                      {year}
                    </span>
                    {runtime && (
                      <span className="px-3 py-1 rounded-xl bg-white/10 text-zinc-300 text-xs font-medium flex items-center gap-1.5 border border-white/10">
                        <Clock className="w-3.5 h-3.5" />
                        {runtime} mins
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-xl bg-white/10 text-zinc-300 uppercase text-xs font-semibold border border-white/10">
                      {details.media_type || 'movie'}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {title}
                  </h2>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(details.genres || []).map((g) => (
                      <span
                        key={g.id}
                        className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>

                  {/* Watchlist Management Section */}
                  <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10 mt-2">
                    <button
                      onClick={() => onToggleWatchlist(details)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm ${
                        isInWatchlist
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30'
                          : 'bg-white text-black hover:bg-zinc-200'
                      }`}
                    >
                      {isInWatchlist ? (
                        <>
                          <X className="w-4 h-4" />
                          Remove from Watchlist
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4" />
                          Add to Watchlist
                        </>
                      )}
                    </button>

                    {isInWatchlist && (
                      <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/10">
                        <span className="text-xs text-zinc-400 px-2 font-medium">Status:</span>
                        <button
                          onClick={() => onUpdateStatus(details.id, 'Plan to Watch')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            watchlistItem.status === 'Plan to Watch'
                              ? 'bg-white text-black font-semibold shadow-sm'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          Plan to Watch
                        </button>
                        <button
                          onClick={() => onUpdateStatus(details.id, 'Watched')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            watchlistItem.status === 'Watched'
                              ? 'bg-white text-black font-semibold shadow-sm'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          Watched
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Plot Overview */}
              <div className="flex flex-col gap-2 pt-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-amber-400" />
                  Storyline
                </h3>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                  {details.overview || 'No storyline overview available.'}
                </p>
              </div>

              {/* Cast Grid */}
              {details.cast && details.cast.length > 0 && (
                <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                  <h3 className="text-lg font-bold text-white">Top Cast</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {details.cast.map((actor) => (
                      <div
                        key={actor.id}
                        className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/10"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0">
                          {actor.profile_path ? (
                            <img
                              src={actor.profile_path}
                              alt={actor.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-zinc-500">
                              {actor.name[0]}
                            </div>
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-semibold text-white truncate">{actor.name}</p>
                          <p className="text-[10px] text-zinc-400 truncate">{actor.character}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* More Like This (Similar Movies) */}
              {similarMovies.length > 0 && (
                <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    More Like This
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {similarMovies.map((simMovie) => {
                      const simTitle = simMovie.title || simMovie.name || 'Untitled';
                      const simPoster = getImageUrl(simMovie.poster_path);
                      const simRating = simMovie.vote_average ? simMovie.vote_average.toFixed(1) : 'NR';
                      return (
                        <div
                          key={simMovie.id}
                          onClick={() => {
                            if (onSelectMovie) onSelectMovie(simMovie);
                            else setDetails(simMovie);
                          }}
                          className="group cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl overflow-hidden transition-all hover:scale-105 flex flex-col"
                        >
                          <div className="w-full aspect-[2/3] bg-zinc-900 overflow-hidden relative">
                            <img
                              src={simPoster}
                              alt={simTitle}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-400 flex items-center gap-1 border border-white/10">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {simRating}
                            </div>
                          </div>
                          <div className="p-3 flex flex-col justify-between flex-grow">
                            <h4 className="text-xs font-bold text-white truncate">{simTitle}</h4>
                            <p className="text-[10px] text-zinc-400 mt-1">
                              {(simMovie.release_date || simMovie.first_air_date || '').split('-')[0] || 'N/A'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
