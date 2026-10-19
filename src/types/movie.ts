export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Movie {
  id: number;
  title?: string;
  name?: string; // for TV shows
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date?: string;
  first_air_date?: string; // for TV shows
  genre_ids: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  episode_run_time?: number[];
  cast?: CastMember[];
  trailer_key?: string;
  media_type?: 'movie' | 'tv';
}

export interface WatchlistMovie extends Movie {
  status: 'Plan to Watch' | 'Watched';
  addedAt: number;
}

export interface FilterState {
  mediaType: 'movie' | 'tv' | 'all';
  genreId: number | null;
  sortBy: 'popularity.desc' | 'vote_average.desc' | 'release_date.desc';
  searchQuery: string;
}
