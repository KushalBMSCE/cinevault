import React, { useState } from 'react';
import { Film, User, Lock } from 'lucide-react';

const Card = ({ children, className }) => (
  <div className={`bg-black/40 rounded-lg overflow-hidden backdrop-blur-sm border border-amber-900/20 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="flex items-center justify-center mb-4">
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-red-700 text-transparent bg-clip-text">
    {children}
  </h2>
);

const CardContent = ({ children }) => (
  <div className="p-6">{children}</div>
);

const CardFooter = ({ children }) => (
  <div className="text-center">{children}</div>
);

const Input = ({ icon, ...props }) => (
  <div className="relative">
    <input
      className="w-full px-4 py-2 rounded-lg bg-white/5 text-amber-50 placeholder-amber-500/50 border border-amber-900/20 focus:outline-none focus:border-amber-600/40 pr-10"
      {...props}
    />
    {icon && <div className="absolute right-3 top-2.5">{icon}</div>}
  </div>
);

const Button = ({ children, className, ...props }) => (
  <button
    className={`w-full px-4 py-2 rounded-lg bg-amber-900/20 hover:bg-amber-900/30 text-amber-500 transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Alert = ({ variant, children, className }) => (
  <div
    className={`px-4 py-3 rounded-lg ${
      variant === 'destructive'
        ? 'bg-red-500/10 border border-red-500/30 text-red-400'
        : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
    } ${className}`}
  >
    {children}
  </div>
);

const UserAuth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Real user authentication logic
    if (isLogin) {
      if (username === 'admin' && password === 'password') {
        // Successful login, call the onLogin callback
        onLogin();
      } else {
        setError('Invalid username or password');
      }
    } else {
      // Placeholder signup logic
      // You'll need to implement your own signup functionality here
      if (username && password) {
        // Successful signup, set the isLogin state to true
        setIsLogin(true);
      } else {
        setError('Please fill in all the fields');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-neutral-900">
      <Card className="max-w-md w-full">
        <CardHeader>
          <Film className="w-12 h-12 text-amber-600" />
          <CardTitle>CineVault</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <div>{error}</div>
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                icon={<User className="w-5 h-5 text-amber-500" />}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5 text-amber-500" />}
              />
            </div>
            <Button type="submit" className="mt-4">
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <button
            type="button"
            className="text-amber-400 hover:text-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Don\'t have an account? Sign Up' : 'Already have an account? Login'}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserAuth;