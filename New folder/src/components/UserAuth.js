import React, { useState } from 'react';
import { Film, User, Lock, Mail, ChevronRight, AlertCircle } from 'lucide-react';
import { supabase } from './supabase';

const BackgroundPattern = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-zinc-900 to-neutral-900" />
    <svg className="absolute w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#grid)" />
    </svg>
    <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,rgba(245,158,11,0.1),transparent)]" />
  </div>
);

const Input = ({ icon: Icon, error, ...props }) => (
  <div className="space-y-1">
    <div className="relative group">
      <input
        className={`w-full px-4 py-3 rounded-xl bg-white/5 text-amber-50 placeholder-amber-500/40
          border ${error ? 'border-red-500/50' : 'border-amber-900/20'}
          focus:outline-none focus:border-amber-600/40 focus:ring-1 focus:ring-amber-600/40
          transition-all duration-300 pl-11`}
        {...props}
      />
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/50 group-focus-within:text-amber-500 transition-colors">
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
    {error && (
      <p className="text-xs text-red-400 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {error}
      </p>
    )}
  </div>
);

const Button = ({ children, loading, ...props }) => (
  <button
    className={`w-full px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700
      hover:from-amber-500 hover:to-amber-600 text-white font-medium
      transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
      disabled:opacity-50 disabled:cursor-not-allowed
      flex items-center justify-center gap-2`}
    disabled={loading}
    {...props}
  >
    {loading ? (
      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    ) : (
      <>
        {children}
        <ChevronRight className="w-4 h-4" />
      </>
    )}
  </button>
);

const UserAuth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!isLogin) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email address';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        // Sign in - first get the user's email using their username
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email')
          .eq('username', formData.username)
          .single();

        if (userError) throw new Error('User not found');

        // Now sign in with the email
        const { data, error } = await supabase.auth.signInWithPassword({
          email: userData.email,
          password: formData.password,
        });

        if (error) throw error;
        onLogin(data.user);
      } else {
        // Sign up - first create the auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;

        // Then create the user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            email: formData.email,
            username: formData.username,
          }]);

        if (profileError) throw profileError;

        setIsLogin(true);
        setErrors({});
        setFormData({ email: '', username: '', password: '' });
        alert('Registration successful! Please check your email to confirm your account before logging in.');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ form: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen p-4 font-sans antialiased">
      <BackgroundPattern />
      
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-3xl transform -rotate-3" />
        <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-3xl transform rotate-3" />
        
        <div className="relative bg-black/40 backdrop-blur-sm rounded-2xl border border-amber-900/20 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="p-3 bg-amber-600/10 rounded-2xl mb-4">
              <Film className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-red-700 text-transparent bg-clip-text font-display">
              CineVault
            </h1>
            <p className="text-amber-500/60 mt-2">
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </p>
          </div>

          {errors.form && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <Input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
                icon={Mail}
                error={errors.email}
              />
            )}
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              icon={User}
              error={errors.username}
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              icon={Lock}
              error={errors.password}
            />

            <Button type="submit" loading={loading}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              className="text-amber-500/80 hover:text-amber-400 text-sm transition-colors"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setFormData({ email: '', username: '', password: '' });
              }}
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAuth;