import React, { useState, useEffect } from 'react';
import { 
  Search, Heart, Film, Star, Clock, Award, PlayCircle, FolderHeart, ArrowLeft, ExternalLink 
} from 'lucide-react';

// Reuse the existing sample movies data
const sampleMovies = [
  // ... (paste the entire sampleMovies array from the previous code)
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
    streamingOn: [
      { name: 'Netflix', link: 'https://www.netflix.com/in/title/70131314' },
      { name: 'Amazon Prime', link: 'https://tinyurl.com/56swu7k3' },
    ],
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
    streamingOn: [
      { name: 'HBO Max', link: 'https://www.netflix.com/title/12345' },
      { name: 'Netflix', link: 'https://www.netflix.com/title/12345' },
      { name: 'Amazon Prime', link: 'https://www.primevideo.com/detail/67890' },
    ],
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
    streamingOn: [
      { name: 'Amazon Prime', link: 'https://www.primevideo.com/detail/67890' },
      { name: 'Paramount+', link: 'https://www.netflix.com/title/12345' },
    ],
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
    streamingOn: [
      { name: 'Netflix', link: 'https://www.netflix.com/title/12345' },
      { name: 'Amazon Prime', link: 'https://www.primevideo.com/detail/67890' },
    ],
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
    streamingOn: [
      { name: 'Netflix', link: 'https://www.netflix.com/title/12345' },
    ],
  },
  {
    id: 6,
    title: "The Goadfather",
    rating: 4.4,
    image: "https://m.media-amazon.com/images/M/MV5BYTJkNGQyZDgtZDQ0NC00MDM0LWEzZWQtYzUzZDEwMDljZWNjXkEyXkFqcGc@._V1_QL75_UY281_CR4,0,190,281_.jpg",
    genre: "Crime, Drama",
    director: "Francis Ford Coppola",
    year: 1972,
    duration: "2h 55min",
    description: "Don Vito Corleone, head of a mafia family, decides to hand over his empire to his youngest son, Michael. However, his decision unintentionally puts the lives of his loved ones in grave danger.",
    awards: ["31 wins at 45th Academy Awards"],
    cast: ["Al Pacino", "Marlon Brando", "James Caan"],
    streamingOn: [
      { name: 'Amazon Prime', link: 'https://www.primevideo.com/detail/67890' },
    ]
  },
  {
    id: 7,
    title: "Predestination",
    rating: 4.0,
    image: "https://m.media-amazon.com/images/M/MV5BY2VhODM5OTUtZDJhMi00MTc5LThjNjYtZWY1M2NlNWU0N2NjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    genre: "Sci-Fi, Thriller",
    director: "Michael Spierig",
    year: 2014,
    duration: "1h 37min",
    description: "As his last assignment, a temporal agent is tasked to travel back in time and prevent a bomb attack in New York in 1975. The hunt, however, turns out to be beyond the bounds of possibility.",
    awards: ["AACTA Award Best Editing in Film"],
    cast: ["Ethan Hawke", "Sarah Snook", "Noah Taylor"],
    streamingOn: [
      { name: 'Amazon Prime', link: 'https://www.primevideo.com/detail/67890' },
    ]
  },
  {
    id: 8,
    title: "John Wick",
    rating: 4.6,
    image: "https://m.media-amazon.com/images/M/MV5BMTU2NjA1ODgzMF5BMl5BanBnXkFtZTgwMTM2MTI4MjE@._V1_.jpg",
    genre: "Action",
    director: "Chad Stahelski",
    year: 2014,
    duration: "1h 41min",
    description: "John Wick is a former hitman grieving the loss of his true love. When his home is broken into, robbed, and his dog killed, he is forced to return to action to exact revenge.",
    awards: ["Golden Schmoes Award"],
    cast: ["Keanu Reeves", "Michael Nyqvist", "Alfie Allen"],
    streamingOn: [
      { name: 'Amazon Prime', link: 'https://www.primevideo.com/detail/67890' },
    ]
  },
  {
    id: 9,
    title: "Jersey",
    rating: 3.9,
    image: "https://upload.wikimedia.org/wikipedia/en/1/10/Jersey_2019_poster.jpg",
    genre: "Sport-Drama",
    director: "Gowtham Tinannuri",
    year: 2019,
    duration: "2h 40min",
    description: "Arjun, a talented but failed cricketer, decides to return to cricket in his late thirties, driven by the desire to represent the Indian cricket team and fulfil his son's wish for a jersey as a gift.",
    awards: ["National Film Award for Best Feature Film"],
    cast: ["Nani", "Shraddha Srinath", "Ronit Kamra"],
    streamingOn: [
      { name: 'Amazon Prime', link: 'https://www.primevideo.com/detail/67890' },
    ]
  },
  {
    id: 10,
    title: "The Shawshank Redemption",
    rating: 4.3,
    image: "https://m.media-amazon.com/images/I/81O3fE93rlL.jpg",
    genre: "Crime, Thriller",
    director: "Frank Darabont",
    year: 1994,
    duration: "2h 22min",
    description: "Andy Dufresne, a successful banker, is arrested for the murders of his wife and her lover, and is sentenced to life imprisonment at the Shawshank prison. He becomes the most unconventional prisoner.",
    awards: ["7 Academy Awards"],
    cast: ["Morgan Freeman", "Tim Robbins", "Clancy Brown"],
    streamingOn: [
      { name: 'Netflix', link: 'https://www.netflix.com/title/12345' },
      { name: 'Amazon Prime', link: 'https://www.primevideo.com/detail/67890' },
    ],
  },
  {
    id: 11,
    title: "Drishyam",
    rating: 4.0,
    image: "https://i0.wp.com/vishnugopal.com/wp-content/uploads/2014/04/drishyam-movie-poster-mohanlal.jpg?quality=89&ssl=1",
    genre: "Crime, Thriller",
    director: "Jeethu Joseph",
    year: 2013,
    duration: "2h 40min",
    description: "Georgekutty lives a happy life with his wife and daughters. However, things take a turn for the worse when his family commits an accidental crime, leaving him to protect them and their secret.",
    awards: ["Filmfare Award for Best Film"],
    cast: ["Mohanlal", "Jeethu Joseph", "Meena"],
    streamingOn: [
      { name: 'Disney+ Hotstar', link: 'https://www.primevideo.com/detail/67890' },
    ],
  },
  {
    id: 12,
    title: "Tumbbad",
    rating: 4.0,
    image: "https://m.media-amazon.com/images/I/81hb1cfz0PL._UF1000,1000_QL80_.jpg",
    genre: "Horror, Fantasy",
    director: "Rahi Anil Barve",
    year: 2018,
    duration: "1h 44min",
    description: "When a family builds a shrine for Hastar, a monster who is never to be worshipped, and attempts to get their hands on his cursed wealth, they face catastrophic consequences.",
    awards: ["Filmfare Award for Best Cinematography"],
    cast: ["Mohanlal", "Jeethu Joseph", "Meena"],
    streamingOn: [
      { name: 'Jio Cinema', link: 'https://www.primevideo.com/detail/67890' },
    ],
  }
];

// Mock trailer data (you would replace these with actual YouTube embed URLs)
const movieTrailers = {
  1: "https://www.youtube.com/embed/YoHD9XEInc0", // Inception trailer
  2: "https://www.youtube.com/embed/EXeTwQWrcwc", // The Dark Knight trailer
  3: "https://www.youtube.com/embed/zSWdZVtXT7E", // Interstellar trailer
  4: "https://www.youtube.com/embed/rYpX4IjqsLw", // Kalki 2898 AD trailer
  5: "https://www.youtube.com/embed/5NcHJL4Ui0E", // Animal trailer
  6: "https://www.youtube.com/embed/sY1S34973zA", // The Godfather trailer
  7: "https://www.youtube.com/embed/vVbk8VqBlBs", // Predestination trailer
  8: "https://www.youtube.com/embed/w-wQk3b9ilc", // John Wick trailer
  9: "https://www.youtube.com/embed/7-vbqm526Rw", // Jersey trailer
  10: "https://www.youtube.com/embed/6hB3S9bYt52", // Shawshank Redemption trailer
  11: "https://www.youtube.com/embed/H_MQmfLSqtU", // Drishyam trailer
  12: "https://www.youtube.com/embed/VHhCCkgUDqQ"  // Tumbbad trailer
};

const EmptyFavorites = () => (
  // ... (keep the existing EmptyFavorites component)
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

  </div>
);

const MovieDetailsModal = ({ movie, onClose, wishlist, toggleWishlist }) => {
  const trailerUrl = movieTrailers[movie.id] || "";

  return (
    <div className="fixed inset-0 z-50 bg-black/90 overflow-y-auto">
      <div className="container mx-auto px-6 py-12 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-8 text-amber-500 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-10 h-10" />
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Movie Poster */}
          <div className="relative">
            <img
              src={movie.image}
              alt={movie.title}
              className="w-full rounded-lg shadow-2xl"
            />
            <button
              onClick={() => toggleWishlist(movie)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center"
            >
              <Heart
                className={`w-7 h-7 transform transition-transform duration-300 hover:scale-110 ${
                  wishlist.find((item) => item.id === movie.id)
                    ? 'text-red-500 fill-red-500'
                    : 'text-white'
                }`}
              />
            </button>
          </div>

          {/* Movie Details */}
          <div className="text-white">
            <h2 className="text-4xl font-bold text-amber-500 mb-4">{movie.title}</h2>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-500" fill="currentColor" />
                <span className="text-xl text-amber-400">{movie.rating}</span>
              </div>
              <span className="text-amber-300">{movie.year} | {movie.duration}</span>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl text-amber-500 mb-2">Synopsis</h3>
              <p className="text-amber-200">{movie.description}</p>
            </div>

            {/* Cast Section */}
            <div className="mb-6">
              <h3 className="text-2xl text-amber-500 mb-2">Cast</h3>
              <div className="flex flex-wrap gap-2">
                {movie.cast.map((actor, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-amber-900/20 text-amber-300 rounded-full"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>

            {/* Awards Section */}
            {movie.awards && movie.awards.length > 0 && movie.awards[0] !== "" && (
              <div className="mb-6">
                <h3 className="text-2xl text-amber-500 mb-2">Awards</h3>
                <div className="flex flex-col gap-2">
                  {movie.awards.map((award, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-500" />
                      <span className="text-amber-300">{award}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Streaming Platforms */}
            <div>
              <h3 className="text-2xl text-amber-500 mb-2">Watch On</h3>
              <div className="flex flex-wrap gap-2">
                {movie.streamingOn.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-amber-900/20 text-amber-400 rounded-full flex items-center gap-2 hover:bg-amber-900/30 transition-all"
                  >
                    {platform.name}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Movie Trailer */}
        <div className="mt-12">
          <h3 className="text-3xl text-amber-500 mb-6">Movie Trailer</h3>
          <div className="aspect-video">
            <iframe
              src={trailerUrl}
              title={`${movie.title} Trailer`}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};


const CineVault = () => {
    const [wishlist, setWishlist] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showWishlist, setShowWishlist] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
  
    const toggleWishlist = (movie) => {
      if (wishlist.find((item) => item.id === movie.id)) {
        setWishlist(wishlist.filter((item) => item.id !== movie.id));
      } else {
        setWishlist([...wishlist, movie]);
      }
    };
  
    const filteredMovies = sampleMovies.filter((movie) =>
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
      </div>
    );
  };

export default CineVault;