import React, { useState } from 'react';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard'; // Crearemos este ahora

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Esta función se la pasaremos al Login para que nos avise cuando entrar
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <Dashboard /> 
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;