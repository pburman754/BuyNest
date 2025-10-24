// src/components/ProtectedRoute.jsx

import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

// 1. It accepts 'children' as a prop.
// 'children' will be the page we are trying to protect.
const ProtectedRoute = ({ children }) => {
  // 2. Get the user from our global state
  const { user } = useAuth();

  // 3. The "Bouncer" Logic
  if (!user) {
    // 4. No user? Redirect them to the login page.
    return <Navigate to="/login" replace />;
  }

  // 5. User exists? Render the 'children' (the page).
  return children;
};

export default ProtectedRoute;