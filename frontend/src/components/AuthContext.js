import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [apiToken, setApiToken] = useState(null);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    const storedApiToken = sessionStorage.getItem('apiToken');
    if (storedUsername && storedApiToken) {
      setUsername(storedUsername);
      setApiToken(storedApiToken);
    }
  }, []);

  const login = (newUsername, newApiToken) => {
    sessionStorage.setItem('username', newUsername);
    sessionStorage.setItem('apiToken', newApiToken);
    setUsername(newUsername);
    setApiToken(newApiToken);
  };

  const logout = () => {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('apiToken');
    setUsername(null);
    setApiToken(null);
  };

  return (
    <AuthContext.Provider value={{ username, apiToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
