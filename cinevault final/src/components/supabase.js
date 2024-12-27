import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to get current user
const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error('Not authenticated');
  return user;
};

// Movie related functions
export const movieService = {
  async saveMovie(movieData) {
    const user = await getCurrentUser();

    const { data, error } = await supabase
      .from('movies')
      .upsert({
        id: movieData.id,
        title: movieData.title,
        poster_path: movieData.poster_path,
        backdrop_path: movieData.backdrop_path,
        overview: movieData.overview,
        release_date: movieData.release_date,
        vote_average: movieData.vote_average,
        updated_by: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async toggleFavorite(movieData) {
    try {
      const user = await getCurrentUser();

      // First ensure movie exists in database
      const { error: movieError } = await supabase
        .from('movies')
        .upsert({
          id: movieData.id,
          title: movieData.title,
          poster_path: movieData.poster_path,
          overview: movieData.overview,
          release_date: movieData.release_date,
          vote_average: movieData.vote_average,
          updated_by: user.id
        });

      if (movieError) throw movieError;

      // Check if already favorited
      const { data: existing, error: checkError } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('movie_id', movieData.id)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existing) {
        // Remove from favorites
        const { error: deleteError } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('movie_id', movieData.id);

        if (deleteError) throw deleteError;
        return false; // Indicates removal
      } else {
        // Add to favorites
        const { error: insertError } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            movie_id: movieData.id
          });

        if (insertError) throw insertError;
        return true; // Indicates addition
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  },

  async getFavorites() {
    const user = await getCurrentUser();

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        movie_id,
        movies (
          id,
          title,
          poster_path,
          overview,
          release_date,
          vote_average
        )
      `)
      .eq('user_id', user.id);

    if (error) throw error;
    return data.map(f => f.movies).filter(Boolean);
  },

  async addToWatchHistory(movieId) {
    const user = await getCurrentUser();

    const { error } = await supabase
      .from('watch_history')
      .insert([{ 
        user_id: user.id,
        movie_id: movieId 
      }]);

    if (error) {
      // Ignore duplicate entries
      if (error.code === '23505') return;
      throw error;
    }
  },

  async rateMovie(movieId, rating) {
    const user = await getCurrentUser();

    const { error } = await supabase
      .from('ratings')
      .upsert([{
        user_id: user.id,
        movie_id: movieId,
        rating: rating
      }]);

    if (error) throw error;
  },

  async getWatchHistory() {
    const user = await getCurrentUser();

    const { data, error } = await supabase
      .from('watch_history')
      .select(`
        movie_id,
        movies (
          id,
          title,
          poster_path,
          overview,
          release_date,
          vote_average
        ),
        created_at
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(h => ({
      ...h.movies,
      watched_at: h.created_at
    })).filter(Boolean);
  }
};

// Profile related functions
export const profileService = {
  async getProfile() {
    const user = await getCurrentUser();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(updates) {
    const user = await getCurrentUser();

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};