import { useState } from 'react';
import type { Movie } from '../types/movie';
import { getImageUrl, GENRES } from '../api/tmdb';
import { Dices, Sparkles, Star, Play, RefreshCw, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface RouletteModalProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export const RouletteModal: React.FC<RouletteModalProps> = ({ movies, onSelectMovie }) => {
  const [spinning, setSpinning] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);

  const filteredMovies = movies.filter((m) => {
    if (selectedGenreId === null) return true;
    if (m.genre_ids && m.genre_ids.includes(selectedGenreId)) return true;
    if (m.genres && m.genres.some((g) => g.id === selectedGenreId)) return true;
    return false;
  });

  const spinRoulette = () => {
    if (filteredMovies.length === 0) return;
    setSpinning(true);
    setSelectedMovie(null);

    let counter = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * filteredMovies.length);
      setSelectedMovie(filteredMovies[randomIndex]);
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        setSpinning(false);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center flex flex-col items-center gap-3 mb-8">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/30">
          <Dices className="w-8 h-8 text-black" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Movie Roulette</h1>
        <p className="text-zinc-400 text-sm max-w-md">
          Indecisive about what to watch tonight? Pick a genre and let the cinematic wheel choose your next masterpiece.
        </p>
      </div>

      {/* Genre Filter Bar */}
      <div className="w-full flex flex-col gap-3 mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <span>Filter Roulette by Genre</span>
        </div>
        <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
          <button
            onClick={() => {
              setSelectedGenreId(null);
              setSelectedMovie(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedGenreId === null
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            All Genres ({movies.length})
          </button>
          {GENRES.map((genre) => {
            const count = movies.filter(
              (m) =>
                (m.genre_ids && m.genre_ids.includes(genre.id)) ||
                (m.genres && m.genres.some((g) => g.id === genre.id))
            ).length;
            return (
              <button
                key={genre.id}
                onClick={() => {
                  setSelectedGenreId(genre.id);
                  setSelectedMovie(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  selectedGenreId === genre.id
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                <span>{genre.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedGenreId === genre.id ? 'bg-black/10 text-black' : 'bg-white/10 text-zinc-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Roulette Card Box */}
      <div className="w-full glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        {filteredMovies.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <Dices className="w-12 h-12 text-zinc-600 mb-2" />
            <p className="text-base font-bold text-white">No movies available for this genre</p>
            <p className="text-xs text-zinc-500">Try selecting "All Genres" or load more titles in Discover.</p>
          </div>
        ) : selectedMovie ? (
          <motion.div
            key={selectedMovie.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col md:flex-row items-center gap-6 w-full"
          >
            <div className="w-48 sm:w-56 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/15 flex-shrink-0 bg-zinc-900">
              <img
                src={getImageUrl(selectedMovie.poster_path)}
                alt={selectedMovie.title || selectedMovie.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col items-start text-left gap-3 flex-grow">
              <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center gap-1.5 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Pick
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {selectedMovie.title || selectedMovie.name}
              </h2>

              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {selectedMovie.vote_average ? selectedMovie.vote_average.toFixed(1) : 'NR'}
                </span>
                <span>•</span>
                <span>{(selectedMovie.release_date || selectedMovie.first_air_date || '').split('-')[0]}</span>
              </div>

              <p className="text-zinc-300 text-sm line-clamp-4 leading-relaxed">
                {selectedMovie.overview}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => onSelectMovie(selectedMovie)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm shadow-sm hover:bg-zinc-200 transition-all"
                >
                  <Play className="w-4 h-4 fill-black" />
                  Explore Details
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-zinc-500">
            <Dices className="w-16 h-16 animate-pulse text-zinc-400" />
            <p className="text-base font-semibold text-zinc-300">
              Ready to spin the wheel ({filteredMovies.length} titles in pool)?
            </p>
          </div>
        )}

        {/* Spin Button */}
        <div className="mt-8">
          <button
            onClick={spinRoulette}
            disabled={spinning || filteredMovies.length === 0}
            className="flex items-center gap-2.5 px-8 py-4 rounded-xl bg-white text-black font-semibold text-base shadow-md hover:bg-zinc-200 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${spinning ? 'animate-spin' : ''}`} />
            {spinning ? 'Spinning Wheel...' : 'Spin the Roulette'}
          </button>
        </div>
      </div>
    </div>
  );
};
