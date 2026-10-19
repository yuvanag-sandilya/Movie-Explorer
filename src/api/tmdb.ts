import type { Movie } from '../types/movie';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper to get API key from localStorage or env
export const getApiKey = (): string => {
  return localStorage.getItem('tmdb_api_key') || import.meta.env.VITE_TMDB_API_KEY || '';
};

export const setApiKey = (key: string) => {
  localStorage.setItem('tmdb_api_key', key.trim());
};

// Rich Mock Data fallback for instant zero-config experience or offline testing
const MOCK_MOVIES: Movie[] = [
  {
    id: 101,
    title: 'Interstellar Odyssey',
    overview: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    poster_path: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    backdrop_path: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop',
    vote_average: 8.7,
    vote_count: 1850000,
    release_date: '2014-11-07',
    genre_ids: [12, 18, 878],
    genres: [{ id: 12, name: 'Adventure' }, { id: 18, name: 'Drama' }, { id: 878, name: 'Sci-Fi' }],
    runtime: 169,
    media_type: 'movie',
    trailer_key: 'zSWdZVtXT7E',
    cast: [
      { id: 1, name: 'Matthew McConaughey', character: 'Joseph Cooper', profile_path: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300' },
      { id: 2, name: 'Anne Hathaway', character: 'Dr. Amelia Brand', profile_path: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300' },
      { id: 3, name: 'Jessica Chastain', character: 'Murph Cooper', profile_path: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300' }
    ]
  },
  {
    id: 102,
    title: 'Cyberpunk 2088: Neon Requiem',
    overview: 'In a dystopian mega-city controlled by rogue AI syndicates, a cybernetically enhanced detective uncovers a conspiracy that threatens the fabric of human consciousness.',
    poster_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    backdrop_path: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600&auto=format&fit=crop',
    vote_average: 8.2,
    vote_count: 940000,
    release_date: '2025-06-15',
    genre_ids: [28, 878, 53],
    genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Sci-Fi' }, { id: 53, name: 'Thriller' }],
    runtime: 138,
    media_type: 'movie',
    trailer_key: 'X05wB8yD2uY',
    cast: [
      { id: 4, name: 'Keanu Reeves', character: 'V-99 Terminal Agent', profile_path: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' },
      { id: 5, name: 'Zendaya Coleman', character: 'Netrunner Nyx', profile_path: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' }
    ]
  },
  {
    id: 103,
    title: 'The Silent Abyss',
    overview: 'Deep-sea researchers exploring the Mariana Trench discover an ancient underwater civilization whose awakening triggers cataclysmic tidal shifts across the globe.',
    poster_path: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=800&auto=format&fit=crop',
    backdrop_path: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop',
    vote_average: 7.8,
    vote_count: 420000,
    release_date: '2024-10-12',
    genre_ids: [12, 27, 9648],
    genres: [{ id: 12, name: 'Adventure' }, { id: 27, name: 'Horror' }, { id: 9648, name: 'Mystery' }],
    runtime: 124,
    media_type: 'movie',
    trailer_key: 'U_a8gv-gEio',
    cast: [
      { id: 6, name: 'Tom Hardy', character: 'Captain Vance', profile_path: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300' }
    ]
  },
  {
    id: 104,
    name: 'Chronicles of Valoria',
    overview: 'In a realm where celestial magic dictates the rise and fall of kingdoms, exiled heirs forge uneasy alliances against an encroaching shadow horde.',
    poster_path: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
    backdrop_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    vote_average: 8.9,
    vote_count: 2100000,
    first_air_date: '2023-04-01',
    genre_ids: [10759, 10765, 18],
    genres: [{ id: 10759, name: 'Action & Adventure' }, { id: 10765, name: 'Sci-Fi & Fantasy' }, { id: 18, name: 'Drama' }],
    episode_run_time: [60],
    media_type: 'tv',
    trailer_key: 'K0PJr3X9Uqs',
    cast: [
      { id: 7, name: 'Henry Cavill', character: 'Lord Commander Rayne', profile_path: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300' }
    ]
  },
  {
    id: 105,
    title: 'Neon Horizon',
    overview: 'Street racers in a futuristic Tokyo compete in high-stakes illegal photon races while evading an elite mechanized police unit.',
    poster_path: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=800&auto=format&fit=crop',
    backdrop_path: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1600&auto=format&fit=crop',
    vote_average: 7.5,
    vote_count: 310000,
    release_date: '2025-01-20',
    genre_ids: [28, 80, 53],
    genres: [{ id: 28, name: 'Action' }, { id: 80, name: 'Crime' }, { id: 53, name: 'Thriller' }],
    runtime: 115,
    media_type: 'movie',
    trailer_key: 'V_u2Ghb7pJU',
    cast: [
      { id: 8, name: 'Ryan Gosling', character: 'Kaze', profile_path: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300' }
    ]
  },
  {
    id: 106,
    title: 'The Quantum Paradox',
    overview: 'A brilliant physicist accidentally splits the timeline during a particle collider experiment, forcing her to navigate parallel versions of her own family.',
    poster_path: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=800&auto=format&fit=crop',
    backdrop_path: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    vote_average: 8.1,
    vote_count: 670000,
    release_date: '2024-08-19',
    genre_ids: [878, 18, 9648],
    genres: [{ id: 878, name: 'Sci-Fi' }, { id: 18, name: 'Drama' }, { id: 9648, name: 'Mystery' }],
    runtime: 132,
    media_type: 'movie',
    trailer_key: '8Qn_spdM5Zg',
    cast: [
      { id: 9, name: 'Florence Pugh', character: 'Dr. Evelyn Vance', profile_path: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' }
    ]
  }
];

export const GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 9648, name: 'Mystery' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
  { id: 10759, name: 'Action & Adventure' },
  { id: 10765, name: 'Sci-Fi & Fantasy' }
];

let activeController: AbortController | null = null;

export async function fetchMovies(
  query = '',
  page = 1,
  mediaType: 'movie' | 'tv' | 'all' = 'all',
  genreId: number | null = null,
  sortBy = 'popularity.desc'
): Promise<{ results: Movie[]; total_pages: number }> {
  const apiKey = getApiKey();

  if (!apiKey) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    let filtered = [...MOCK_MOVIES];

    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          (m.title && m.title.toLowerCase().includes(q)) ||
          (m.name && m.name.toLowerCase().includes(q)) ||
          m.overview.toLowerCase().includes(q)
      );
    }

    if (mediaType !== 'all') {
      filtered = filtered.filter((m) => m.media_type === mediaType);
    }

    if (genreId !== null) {
      filtered = filtered.filter((m) => m.genre_ids.includes(genreId));
    }

    if (sortBy === 'vote_average.desc') {
      filtered.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sortBy === 'release_date.desc') {
      filtered.sort((a, b) => {
        const dateA = a.release_date || a.first_air_date || '';
        const dateB = b.release_date || b.first_air_date || '';
        return dateB.localeCompare(dateA);
      });
    }

    return { results: filtered, total_pages: 1 };
  }

  if (activeController) {
    activeController.abort();
  }
  activeController = new AbortController();

  let endpoint = `${TMDB_BASE_URL}/trending/all/week`;
  if (query.trim()) {
    endpoint = `${TMDB_BASE_URL}/search/multi`;
  } else if (mediaType === 'movie') {
    endpoint = `${TMDB_BASE_URL}/discover/movie`;
  } else if (mediaType === 'tv') {
    endpoint = `${TMDB_BASE_URL}/discover/tv`;
  }

  const url = new URL(endpoint);
  url.searchParams.append('api_key', apiKey);
  url.searchParams.append('page', page.toString());
  if (query.trim()) {
    url.searchParams.append('query', query);
  }
  if (!query.trim() && mediaType !== 'all') {
    url.searchParams.append('sort_by', sortBy);
    if (genreId) {
      url.searchParams.append('with_genres', genreId.toString());
    }
  }

  try {
    const response = await fetch(url.toString(), { signal: activeController.signal });
    if (!response.ok) {
      throw new Error(`TMDB API Error: ${response.statusText}`);
    }
    const data = await response.json();

    const results: Movie[] = (data.results || []).map((item: any) => ({
      ...item,
      media_type: item.media_type || (item.title ? 'movie' : 'tv')
    }));

    return {
      results,
      total_pages: data.total_pages || 1
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return { results: [], total_pages: 1 };
    }
    console.warn('TMDB API fetch failed, falling back to mock data:', error);
    return { results: MOCK_MOVIES, total_pages: 1 };
  }
}

export async function fetchMovieDetails(id: number, mediaType: 'movie' | 'tv' = 'movie'): Promise<Movie> {
  const apiKey = getApiKey();
  if (!apiKey) {
    const mock = MOCK_MOVIES.find((m) => m.id === id) || MOCK_MOVIES[0];
    return mock;
  }

  try {
    const [detailRes, creditsRes, videosRes] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/${mediaType}/${id}?api_key=${apiKey}`),
      fetch(`${TMDB_BASE_URL}/${mediaType}/${id}/credits?api_key=${apiKey}`),
      fetch(`${TMDB_BASE_URL}/${mediaType}/${id}/videos?api_key=${apiKey}`)
    ]);

    const detail = await detailRes.json();
    const credits = await creditsRes.json();
    const videos = await videosRes.json();

    const trailer = (videos.results || []).find(
      (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
    );

    return {
      ...detail,
      media_type: mediaType,
      cast: (credits.cast || []).slice(0, 10).map((c: any) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profile_path: c.profile_path ? `https://image.tmdb.org/t/p/w200${c.profile_path}` : null
      })),
      trailer_key: trailer ? trailer.key : undefined
    };
  } catch (err) {
    console.error('Failed to fetch movie details:', err);
    return MOCK_MOVIES[0];
  }
}

export async function fetchSimilarMovies(id: number, mediaType: 'movie' | 'tv' = 'movie'): Promise<Movie[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    const current = MOCK_MOVIES.find((m) => m.id === id) || MOCK_MOVIES[0];
    const filtered = MOCK_MOVIES.filter(
      (m) => m.id !== id && m.genre_ids.some((g) => current.genre_ids.includes(g))
    );
    return filtered.length > 0 ? filtered : MOCK_MOVIES.filter((m) => m.id !== id);
  }

  try {
    const res = await fetch(`${TMDB_BASE_URL}/${mediaType}/${id}/similar?api_key=${apiKey}`);
    const data = await res.json();
    return (data.results || []).slice(0, 5).map((item: any) => ({
      ...item,
      media_type: mediaType
    }));
  } catch (err) {
    console.error('Failed to fetch similar movies:', err);
    return [];
  }
}

export function getImageUrl(path: string | null, size: 'w500' | 'original' = 'w500'): string {
  if (!path) return 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop';
  if (path.startsWith('http')) return path;
  const apiKey = getApiKey();
  if (!apiKey) return path;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
