// src/context/SocketContext.jsx

import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext'; // We need the user!
import io from 'socket.io-client';

const SocketContext = createContext(null);

// Custom hook to use the socket
export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth(); // Get our logged-in user

  useEffect(() => {
    // This effect runs whenever the 'user' object changes

    if (user) {
      // 1. If we have a user, create a new connection
      // We connect directly to our backend's URL
      const newSocket = io('http://localhost:5000');

      setSocket(newSocket); // Save the socket in state

      // 2. We must tell the server who we are (matches our backend)
      newSocket.emit('setup', user._id);

      // 3. This is the "cleanup" function
      // It runs when the component unmounts or when 'user' changes
      return () => {
        newSocket.disconnect();
      };
    } else {
      // 4. If there's no user, disconnect any existing socket
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user]); // 5. The Dependency Array: Run this when 'user' changes

  // Provide the socket to the whole app
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};