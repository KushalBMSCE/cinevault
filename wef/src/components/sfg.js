import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, Heart, Film, Star, Clock, Award, PlayCircle, FolderHeart, ArrowLeft, ExternalLink 
} from 'lucide-react';

const CineVault = () => {
    const [movies, setMovies] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showWishlist, setShowWishlist] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    // Fetch movies from TMDB
    useEffect(() => {
        const fetchPopularMovies = async () => {
            try {
                // Fetch multiple pages to get more movies
                const pages = [1, 2, 3]; // Adjust number of pages as needed
                const allMovies = [];

                for (const page of pages) {
                    const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
                        params: {
                            api_key: process.env.REACT_APP_TMDB_API_KEY,
                            language: 'en-US',
                            page: page
                        }
                    });

                    // Transform TMDB data to match your existing movie structure
                    const transformedMovies = await Promise.all(response.data.results.map(async (movie) => {
                        // Fetch additional movie details
                        const detailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
                            params: {
                                api_key: process.env.REACT_APP_TMDB_API_KEY,
                                append_to_response: 'credits'
                            }
                        });

                        // Fetch credits 
                        const creditsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits`, {
                            params: {
                                api_key: process.env.REACT_APP_TMDB_API_KEY
                            }
                        });

                        return {
                            id: movie.id,
                            title: movie.title,
                            rating: movie.vote_average,
                            image: movie.poster_path 
                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                : '/path/to/default/poster.jpg',
                            genre: detailsResponse.data.genres.map(g => g.name).join(', '),
                            director: creditsResponse.data.crew.find(c => c.job === 'Director')?.name || 'Unknown',
                            year: new Date(movie.release_date).getFullYear(),
                            duration: `${detailsResponse.data.runtime || 0} min`,
                            description: movie.overview,
                            cast: creditsResponse.data.cast
                                .slice(0, 3)
                                .map(actor => actor.name),
                            awards: [], // TMDB doesn't provide awards
                            streamingOn: [], // You'll need additional API for streaming
                        };
                    }));

                    allMovies.push(...transformedMovies);
                }

                setMovies(allMovies);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch movies:', err);
                setError('Failed to fetch movies');
                setLoading(false);
            }
        };

        fetchPopularMovies();
    }, []);

    const toggleWishlist = (movie) => {
      if (wishlist.find((item) => item.id === movie.id)) {
        setWishlist(wishlist.filter((item) => item.id !== movie.id));
      } else {
        setWishlist([...wishlist, movie]);
      }
    };
  
    const filteredMovies = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const displayedMovies = showWishlist ? wishlist : filteredMovies;
  
    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-neutral-900 flex items-center justify-center">
            <div className="text-amber-500 text-2xl">Loading movies...</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-neutral-900 flex items-center justify-center">
            <div className="text-red-500 text-2xl">{error}</div>
        </div>
    );

    return (
      // Rest of your existing CineVault component remains the same
      // Just replace sampleMovies with the new 'movies' state
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-neutral-900 relative overflow-hidden">
        {/* ... existing code ... */}
        {/* Animated background overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(139,_0,_0,_0.1),_rgba(30,_41,_59,_0.2))]" />
        </div>
  
        {/* Main content */}
        <div className="relative z-10">
          {/* Header */}
          <header className="p-6 flex items-center justify-between bg-black/30 backdrop-blur-sm border-b border-amber-900/20">
            <div className="flex items-center gap-3">
              <Film className="w-8 h-8 text-amber-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-red-700 text-transparent bg-clip-text">
                CineVault
              </h1>
            </div>
  
            <div className="flex items-center gap-6">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search movies..."
                  className="w-full px-4 py-2 rounded-lg bg-white/5 text-amber-50 placeholder-amber-500/50 border border-amber-900/20 focus:outline-none focus:border-amber-600/40"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-2.5 text-amber-500/50" />
              </div>
  
              <button
                onClick={() => setShowWishlist(!showWishlist)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-900/20 hover:bg-amber-900/30 text-amber-500 transition-all duration-300"
              >
                <Heart
                  className={`w-5 h-5 ${
                    wishlist.length > 0 ? 'text-red-500 fill-red-500' : 'text-amber-700'
                  }`}
                />
                <span className="text-amber-500">Favorites ({wishlist.length})</span>
              </button>
            </div>
          </header>
  
          {/* Movie grid or empty state */}
          <div className="container mx-auto px-6 py-8">
            {showWishlist && wishlist.length === 0 ? (
              <EmptyFavorites />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedMovies.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => setSelectedMovie(movie)}
                    className="group relative bg-black/40 rounded-lg overflow-hidden backdrop-blur-sm border border-amber-900/20 transform transition-all duration-300 hover:scale-105 hover:bg-black/60 cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={movie.image}
                        alt={movie.title}
                        className="w-full h-72 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  
                      {/* Heart icon overlay */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(movie);
                        }}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-all duration-300"
                      >
                        <Heart
                          className={`w-6 h-6 transform transition-transform duration-300 hover:scale-110 ${
                            wishlist.find((item) => item.id === movie.id)
                              ? 'text-red-500 fill-red-500'
                              : 'text-white'
                          }`}
                        />
                      </button>
                    </div>
  
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-amber-500">{movie.title}</h3>
                      <div className="text-amber-400/80 text-sm">{movie.year}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
  
          {/* Movie Details Modal */}
          {selectedMovie && (
            <MovieDetailsModal
              movie={selectedMovie}
              onClose={() => setSelectedMovie(null)}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />
          )}
        </div>
        <div className="container mx-auto px-6 py-8">
          {showWishlist && wishlist.length === 0 ? (
            <EmptyFavorites />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedMovies.map((movie) => (
                // Your existing movie card rendering logic
                <div
                  key={movie.id}
                  onClick={() => setSelectedMovie(movie)}
                  className="group relative bg-black/40 rounded-lg overflow-hidden backdrop-blur-sm border border-amber-900/20 transform transition-all duration-300 hover:scale-105 hover:bg-black/60 cursor-pointer"
                >
                  {/* Existing movie card details */}
                  <div className="relative">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-72 object-cover"
                    />
                    {/* Rest of your movie card code */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Existing MovieDetailsModal and other components */}
        {selectedMovie && (
          <MovieDetailsModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
          />
        )}
      </div>
    );
  };

export default CineVault;