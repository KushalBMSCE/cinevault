import axios from 'axios';

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const TMDB_BASE_URL = process.env.REACT_APP_TMDB_BASE_URL;
const TMDB_IMAGE_BASE_URL = process.env.REACT_APP_TMDB_IMAGE_BASE_URL;

export const tmdbService = {
  async getPopularMovies(page = 1) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
        params: {
          api_key: TMDB_API_KEY,
          page: page
        }
      });
      return response.data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        rating: movie.vote_average,
        image: `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`,
        genre: movie.genre_ids.length > 0 
          ? await this.getGenreNames(movie.genre_ids) 
          : 'Unknown',
        year: new Date(movie.release_date).getFullYear(),
        description: movie.overview
      }));
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return [];
    }
  },

  async getMovieDetails(movieId) {
    try {
      const [details, credits, videos] = await Promise.all([
        axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
          params: { api_key: TMDB_API_KEY }
        }),
        axios.get(`${TMDB_BASE_URL}/movie/${movieId}/credits`, {
          params: { api_key: TMDB_API_KEY }
        }),
        axios.get(`${TMDB_BASE_URL}/movie/${movieId}/videos`, {
          params: { api_key: TMDB_API_KEY }
        })
      ]);

      const trailer = videos.data.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      );

      return {
        ...details.data,
        cast: credits.data.cast.slice(0, 5).map(actor => actor.name),
        trailerKey: trailer ? trailer.key : null
      };
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  },

  async getGenreNames(genreIds) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
        params: { api_key: TMDB_API_KEY }
      });
      
      const genreMap = response.data.genres.reduce((map, genre) => {
        map[genre.id] = genre.name;
        return map;
      }, {});

      return genreIds.map(id => genreMap[id] || 'Unknown').join(', ');
    } catch (error) {
      console.error('Error fetching genres:', error);
      return 'Unknown';
    }
  }
};