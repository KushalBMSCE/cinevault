import React, { useState, useEffect } from 'react';
import { Search, Heart, Star, ArrowLeft, Film, Monitor, Download, AlertCircle } from 'lucide-react';

// Constants and API functions
const TMDB_API_KEY = '5a0e3ca0145f351e5109152ecfbed14c';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// Add streaming platforms API function
const api = {
  getTrending: async (page = 1) => {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&page=${page}`
    );
    return response.json();
  },

  searchMovies: async (query) => {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        query
      )}`
    );
    return response.json();
  },
  
  getStreamingProviders: async (movieId) => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    return data.results?.US || null; // Focus on US providers for simplicity
  },

  getMovieDetails: async (movieId) => {
    const [details, credits, videos, streaming] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`).then(res => res.json()),
      fetch(`${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`).then(res => res.json()),
      fetch(`${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`).then(res => res.json()),
      api.getStreamingProviders(movieId)
    ]);
    return { ...details, credits, videos, streaming };
  }
};

// Header Component
const Header = ({ searchQuery, setSearchQuery, favoritesCount, setView }) => {
  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setView('home')}
              className="flex items-center space-x-2 text-orange-500 hover:text-orange-400"
            >
              <Film className="w-6 h-6" />
              <span className="text-xl font-bold">CineVault</span>
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="pl-10 pr-4 py-2 w-64 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <button
            onClick={() => setView('favorites')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            <Heart className="w-5 h-5 text-orange-500" />
            <span className="text-white">{favoritesCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

// Movie Card Component
const MovieCard = ({ movie, isFavorite, onClick, onFavoriteClick }) => (
  <div className="bg-gray-800 rounded-lg overflow-hidden relative group cursor-pointer shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
    <div className="p-0">
      <div onClick={onClick}>
        <div className="relative overflow-hidden">
          <img
            src={movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : '/api/placeholder/300/450'}
            alt={movie.title}
            className="w-full h-96 object-cover transform transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black to-transparent">
            <p className="text-sm text-gray-300">
              {movie.overview ? `${movie.overview.slice(0, 100)}...` : 'No description available'}
            </p>
          </div>
        </div>
      </div>
      <button
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-900 bg-opacity-50 hover:bg-opacity-75 transform transition-transform duration-300 hover:scale-110"
        onClick={(e) => {
          e.stopPropagation();
          onFavoriteClick();
        }}
      >
        <Heart
          className={`w-5 h-5 ${isFavorite ? 'fill-orange-500 text-orange-500' : 'text-white'}`}
        />
      </button>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white group-hover:text-orange-500 transition-colors duration-300">
          {movie.title || 'Untitled'}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
          </span>
          {typeof movie.vote_average !== 'undefined' && movie.vote_average !== null && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-500">
                {Number(movie.vote_average).toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Streaming Providers Component
const StreamingProviders = ({ providers }) => {
  if (!providers) return null;

  const renderPlatforms = (platforms, title) => {
    if (!platforms?.length) return null;
    
    return (
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {platforms.map((platform) => (
            <div
              key={platform.provider_id}
              className="flex items-center bg-gray-800 rounded-lg p-2"
            >
              <img
                src={`${TMDB_IMAGE_BASE}${platform.logo_path}`}
                alt={platform.provider_name}
                className="w-6 h-6 rounded mr-2"
              />
              <span className="text-sm">{platform.provider_name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">
        <Monitor className="inline-block mr-2 mb-1" />
        Streaming Availability
      </h2>
      {renderPlatforms(providers.flatrate, "Stream")}
      {renderPlatforms(providers.rent, "Rent")}
      {renderPlatforms(providers.buy, "Buy")}
      {!providers.flatrate && !providers.rent && !providers.buy && (
        <p className="text-gray-400">No streaming information available</p>
      )}
    </div>
  );
};

// Empty Favorites Illustration
const EmptyFavorites = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-48 h-48 mb-8">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect x="40" y="40" width="120" height="150" rx="10" fill="#374151" />
        <path d="M70 70 H130" stroke="#9CA3AF" strokeWidth="8" strokeLinecap="round" />
        <path d="M70 100 H130" stroke="#9CA3AF" strokeWidth="8" strokeLinecap="round" />
        <path d="M70 130 H130" stroke="#9CA3AF" strokeWidth="8" strokeLinecap="round" />
        <Heart 
          className="text-orange-500 transform translate-x-[85px] translate-y-[100px]"
          size={60}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        />
      </svg>
    </div>
    <h3 className="text-2xl font-bold mb-2">No favorites yet</h3>
    <p className="text-gray-400 text-center max-w-md mb-6">
      Start exploring movies and click the heart icon to add them to your favorites!
    </p>
    
  </div>
);
const NoResults = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-64 h-64 mb-8 relative">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4B5563" />
            <stop offset="100%" stopColor="#1F2937" />
          </linearGradient>
        </defs>
        
        {/* Movie reel background */}
        <circle cx="100" cy="100" r="80" fill="url(#gradient)" />
        
        {/* Film holes */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <circle
            key={angle}
            cx={100 + 60 * Math.cos((angle * Math.PI) / 180)}
            cy={100 + 60 * Math.sin((angle * Math.PI) / 180)}
            r="8"
            fill="#374151"
          />
        ))}
        
        {/* Search icon */}
        <g transform="translate(70, 70) scale(1.2)">
          <circle cx="20" cy="20" r="16" stroke="#9CA3AF" strokeWidth="4" fill="none" />
          <line
            x1="32"
            y1="32"
            x2="45"
            y2="45"
            stroke="#9CA3AF"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      </svg>
      
      {/* Animated pulse ring */}
      <div className="absolute inset-0 animate-pulse">
        <div className="absolute inset-1/4 border-4 border-orange-500 rounded-full opacity-20" />
      </div>
    </div>
    <h3 className="text-2xl font-bold mb-2">No Movies Found</h3>
    <p className="text-gray-400 text-center max-w-md mb-6">
      We couldn't find any movies matching your search. Try different keywords or browse our trending movies!
    </p>
  </div>
);
// Modified MovieGrid Component with Load More
const MovieGrid = ({ movies, onMovieSelect, favorites, toggleFavorite, onLoadMore, hasMore }) => (
  <div className="container mx-auto px-6 py-8">
    {movies.length === 0 ? (
      <NoResults />
    ) : (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {movies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={favorites.some(f => f.id === movie.id)}
              onClick={() => onMovieSelect(movie)}
              onFavoriteClick={() => toggleFavorite(movie)}
            />
          ))}
        </div>
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={onLoadMore}
              className="px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors hover:scale-105 transform duration-300"
            >
              Load More Movies
            </button>
          </div>
        )}
      </>
    )}
  </div>
);

// Modified Movie Details Component
const MovieDetails = ({ movie, setView, isFavorite, toggleFavorite }) => {
  const trailer = movie.videos?.results?.find(
    video => video.type === 'Trailer' && video.site === 'YouTube'
  );

  return (
    <div className="container mx-auto px-6 py-8">
      <button
        onClick={() => setView('home')}
        className="flex items-center text-orange-500 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <img
            src={movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : '/api/placeholder/300/450'}
            alt={movie.title}
            className="w-full rounded-lg"
          />
          <StreamingProviders providers={movie.streaming} />
        </div>
        <div className="w-full md:w-2/3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{movie.title || 'Untitled'}</h1>
            <button
              onClick={() => toggleFavorite(movie)}
              className="p-2 rounded-full hover:bg-gray-800"
            >
              <Heart
                className={`w-6 h-6 ${isFavorite ? 'fill-orange-500 text-orange-500' : 'text-white'}`}
              />
            </button>
          </div>
          
          <div className="flex items-center space-x-2 mb-4">
            {typeof movie.vote_average !== 'undefined' && movie.vote_average !== null && (
              <>
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-yellow-500">{Number(movie.vote_average).toFixed(1)}</span>
              </>
            )}
            <span className="text-gray-400">
              {movie.release_date ? `| ${new Date(movie.release_date).getFullYear()}` : ''}
            </span>
            {movie.runtime && <span className="text-gray-400">| {movie.runtime} min</span>}
          </div>

          <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
          <p className="text-gray-400 mb-6">{movie.overview || 'No synopsis available.'}</p>

          {movie.credits?.cast?.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-2">Cast</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.credits.cast.slice(0, 5).map(actor => (
                  <span key={actor.id} className="text-gray-400">{actor.name}</span>
                ))}
              </div>
            </>
          )}

          {trailer && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Trailer</h2>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title="Movie Trailer"
                  className="w-full h-96 rounded-lg"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
// Streaming Providers Component
const CineVault = () => {
  // State management
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState('home');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Load trending movies on initial render and page change
  useEffect(() => {
    const loadTrendingMovies = async () => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const data = await api.getTrending(currentPage);
        if (currentPage === 1) {
          setMovies(data.results);
        } else {
          setMovies(prev => [...prev, ...data.results]);
        }
        setHasMore(data.page < data.total_pages);
      } catch (error) {
        console.error('Error loading trending movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchQuery === '') {
      loadTrendingMovies();
    }
  }, [currentPage, searchQuery]);

  // Handle search
  useEffect(() => {
    const searchMovies = async () => {
      if (!searchQuery.trim()) return;
      setIsLoading(true);
      try {
        const data = await api.searchMovies(searchQuery);
        setMovies(data.results);
        setHasMore(false);
      } catch (error) {
        console.error('Error searching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceSearch = setTimeout(() => {
      if (searchQuery) {
        searchMovies();
      }
    }, 500);

    return () => clearTimeout(debounceSearch);
  }, [searchQuery]);

  // Handle movie selection
  const handleMovieSelect = async (movie) => {
    try {
      const details = await api.getMovieDetails(movie.id);
      setSelectedMovie(details);
      setView('details');
    } catch (error) {
      console.error('Error loading movie details:', error);
    }
  };

  // Toggle favorites
  const toggleFavorite = (movie) => {
    setFavorites(prev => {
      const isFavorite = prev.some(f => f.id === movie.id);
      if (isFavorite) {
        return prev.filter(f => f.id !== movie.id);
      }
      return [...prev, movie];
    });
  };

  // Load more movies
  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // Render content based on current view
  const renderContent = () => {
    switch (view) {
      case 'details':
        return selectedMovie ? (
          <MovieDetails
            movie={selectedMovie}
            setView={setView}
            isFavorite={favorites.some(f => f.id === selectedMovie.id)}
            toggleFavorite={toggleFavorite}
          />
        ) : null;
      case 'favorites':
        return favorites.length > 0 ? (
          <MovieGrid
            movies={favorites}
            onMovieSelect={handleMovieSelect}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            hasMore={false}
          />
        ) : (
          <EmptyFavorites />
        );
      default:
        return (
          <MovieGrid
            movies={movies}
            onMovieSelect={handleMovieSelect}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            onLoadMore={handleLoadMore}
            hasMore={hasMore && !searchQuery}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        favoritesCount={favorites.length}
        setView={setView}
      />
      <main className="pb-12">
        {isLoading && movies.length === 0 ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
          </div>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
};

export default CineVault;
