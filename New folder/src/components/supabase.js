// src/utils/supabase.js
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Debug log
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('Environment Variables Status:', {
    REACT_APP_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
    REACT_APP_SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY ? 'exists' : 'missing'
  });
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// User authentication functions
export const auth = {
  async register({ email, username, password }) {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      
      const { data, error } = await supabase
        .from('users')
        .insert([{ email, username, password_hash: passwordHash }])
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async login({ username, password }) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error) throw error;
      if (!data) throw new Error('User not found');

      const validPassword = await bcrypt.compare(password, data.password_hash);
      if (!validPassword) throw new Error('Invalid password');

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.id);

      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

// Movie management functions
export const movies = {
  async saveMovie(movieData) {
    try {
      const { data, error } = await supabase
        .from('movies')
        .upsert([{
          id: movieData.id,
          title: movieData.title,
          poster_path: movieData.poster_path,
          overview: movieData.overview,
          release_date: movieData.release_date,
          vote_average: movieData.vote_average
        }])
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async toggleFavorite(userId, movieId) {
    try {
      // First, ensure the movie exists in our database
      await this.saveMovie(movieId);

      // Check if already favorited
      const { data: existing } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .eq('movie_id', movieId)
        .single();

      if (existing) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('movie_id', movieId);

        if (error) throw error;
        return false; // Return false to indicate removal
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert([{ user_id: userId, movie_id: movieId }]);

        if (error) throw error;
        return true; // Return true to indicate addition
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async getFavorites(userId) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          movie_id,
          movies (*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data.map(f => f.movies);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async rateMovie(userId, movieId, rating) {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .upsert([{
          user_id: userId,
          movie_id: movieId,
          rating
        }])
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};