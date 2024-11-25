// App.js
import React, { useState } from 'react';
import CineVault from './components/CineVault';
import UserAuth from './components/UserAuth';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      {isLoggedIn ? <CineVault /> : <UserAuth onLogin={handleLogin} />}
    </div>
  );
};

export default App;