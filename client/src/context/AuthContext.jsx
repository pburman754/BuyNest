// src/context/AuthContext.jsx

import { createContext, useState, useContext, useEffect } from 'react'; // 1. Import useEffect

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 2. Set the initial state by reading from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  // 3. This is the new hook!
  useEffect(() => {
    // This code runs *every time* the 'user' state changes
    if (user) {
      // 4. Save the user to localStorage
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      // 5. Remove the user from localStorage
      localStorage.removeItem('user');
    }
  }, [user]); // 6. The "dependency array"

  // 7. These functions are now simpler!
  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};