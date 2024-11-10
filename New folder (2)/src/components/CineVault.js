import React, { useState } from 'react';
import { Search, Heart, Film, Star, Clock, Award, PlayCircle, FolderHeart } from 'lucide-react';

const sampleMovies = [
  {
    id: 1,
    title: "Inception",
    rating: 4.8,
    image: "https://cdn11.bigcommerce.com/s-yzgoj/images/stencil/1280x1280/products/2919271/5944675/MOVEB46211__19379.1679590452.jpg?c=2",
    genre: "Sci-Fi",
    director: "Christopher Nolan",
    year: 2010,
    duration: "2h 28min",
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O. As the layers of dreams cascade deeper, the line between reality and imagination begins to blur.",
    awards: ["Academy Award for Best Visual Effects", "Academy Award for Best Cinematography"],
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
    streamingOn: ["Netflix", "Amazon Prime"]
  },
  {
    id: 2,
    title: "The Dark Knight",
    rating: 4.9,
    image: "https://external-preview.redd.it/him_lfqlWegQtgNOotCMNbl0FdxzxaCo1LvZ2UQAdyk.jpg?width=640&crop=smart&auto=webp&s=d293be35a4f1dd67bb21b6133110e10c5293c024",
    genre: "Action",
    director: "Christopher Nolan",
    year: 2008,
    duration: "2h 32min",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice and become a true hero.",
    awards: ["Academy Award for Best Supporting Actor", "Academy Award for Best Sound Editing"],
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    streamingOn: ["HBO Max", "Netflix","Amazon Prime"]
  },
  {
    id: 3,
    title: "Interstellar",
    rating: 4.7,
    image: "https://wallpapers.com/images/hd/interstellar-endurance-in-gargantua-k3mpqn5tocx8o98k.jpg",
    genre: "Sci-Fi",
    director: "Christopher Nolan",
    year: 2014,
    duration: "2h 49min",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival. As they venture into the unknown, time becomes their greatest enemy in a race against the collapse of Earth's resources.",
    awards: ["Academy Award for Best Visual Effects"],
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    streamingOn: ["Amazon Prime", "Paramount+"]
  },
  {
    id: 4,
    title: "Kalki 2898 AD",
    rating: 4.4,
    image: "https://stat5.bollywoodhungama.in/wp-content/uploads/2021/07/Kalki-2898-AD-2.jpg",
    genre: "Sci-Fi",
    director: "Nag Ashwin",
    year: 2024,
    duration: "2h 53min",
    description: "The future of those in the dystopian city of Kasi is altered when the destined arrival of Lord Vishnu's final avatar launches a war against darkness.",
    awards: [""],
    cast: ["Prabhas", "Kamal Hassan", "Amitabh Bachchan"],
    streamingOn: ["Netflix","Amazon Prime"]
  },
  {
    id: 5,
    title: "Animal",
    rating: 4.1,
    image: "https://upload.wikimedia.org/wikipedia/en/thumb/9/90/Animal_%282023_film%29_poster.jpg/220px-Animal_%282023_film%29_poster.jpg",
    genre: "Action, Drama",
    director: "Sandeep Reddy Vanga",
    year: 2023,
    duration: "3h 21min",
    description: "The hardened son of a powerful industrialist returns home after years abroad and vows to take bloody revenge on those threatening his father's life.",
    awards: ["Filmfare Award for Best Actor"],
    cast: ["Ranbir Kapoor", "Anil Kapoor", "Bobby Deol"],
    streamingOn: ["Netflix"]
  }
];

const EmptyFavorites = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <div className="relative w-24 h-24 mb-6">
      <FolderHeart className="w-24 h-24 text-amber-600/30" />
      <Heart className="w-12 h-12 text-amber-500/50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
    </div>
    <h3 className="text-2xl font-semibold text-amber-500 mb-3">Your Favorites List is Empty</h3>
    <p className="text-amber-300/70 max-w-md mb-6">
      Start building your collection by clicking the heart icon on movies you love. 
      Your favorite films will appear here for easy access.
    </p>
    <div className="flex gap-2 text-amber-400/60">
      <Heart className="w-5 h-5" /> 
      <span>Click the heart icon on any movie card to add it to your favorites</span>
    </div>
  </div>
);

const CineVault = () => {
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showWishlist, setShowWishlist] = useState(false);

  const toggleWishlist = (movie) => {
    if (wishlist.find(item => item.id === movie.id)) {
      setWishlist(wishlist.filter(item => item.id !== movie.id));
    } else {
      setWishlist([...wishlist, movie]);
    }
  };

  const filteredMovies = sampleMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedMovies = showWishlist ? wishlist : filteredMovies;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-neutral-900 relative overflow-hidden">
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
                className={`w-5 h-5 ${wishlist.length > 0 ? 'text-red-500 fill-red-500' : 'text-amber-700'}`}
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
              {displayedMovies.map(movie => (
                <div
                  key={movie.id}
                  className="group relative bg-black/40 rounded-lg overflow-hidden backdrop-blur-sm border border-amber-900/20 transform transition-all duration-300 hover:scale-105 hover:bg-black/60"
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
                      onClick={() => toggleWishlist(movie)}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-all duration-300"
                    >
                      <Heart 
                        className={`w-6 h-6 transform transition-transform duration-300 hover:scale-110 ${
                          wishlist.find(item => item.id === movie.id)
                            ? 'text-red-500 fill-red-500'
                            : 'text-white'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-amber-500">{movie.title}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
                        <span className="text-amber-400">{movie.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-amber-400/80 text-sm mb-4">
                      <span>{movie.year}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {movie.duration}
                      </span>
                      <span>{movie.genre}</span>
                    </div>
                    
                    <p className="text-amber-200/70 text-sm mb-4 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                      {movie.description}
                    </p>
                    
                    <div className="space-y-2 text-amber-300/60 text-sm">
                      {movie.awards[0] && (
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          <span className="line-clamp-1">{movie.awards[0]}</span>
                        </div>
                      )}
                      
                      <div>
                        <strong className="text-amber-300/80">Director:</strong> {movie.director}
                      </div>

                      {/* Streaming platforms section */}
                      <div className="pt-3 border-t border-amber-900/20">
                        <div className="flex items-center gap-2 mb-2">
                          <PlayCircle className="w-4 h-4 text-amber-500" />
                          <span className="text-amber-300/80">Watch on:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {movie.streamingOn.map((platform) => (
                            <span
                              key={platform}
                              className="px-2 py-1 text-xs rounded-full bg-amber-900/20 text-amber-400"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CineVault;