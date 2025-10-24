// src/pages/LoginPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. For redirection
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // 2. Our global auth hook

const LoginPage = () => {
  // 3. Get the global 'login' function from our context
  const { login } = useAuth();

  // 4. Get the navigation function
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 5. Call the LOGIN endpoint
      const { data } = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      // 6. SUCCESS!
      setLoading(false);
      login(data); // 7. Set the user in our global state!
      navigate('/'); // 8. Send the user to the homepage!


    } catch (err) {
      // 9. FAILURE!
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="form-container">
      <h1>Login to Your Account</h1>

      {loading && <div>Loading...</div>}
      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="form-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-block" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;