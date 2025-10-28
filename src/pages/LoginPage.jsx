// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext'; // 1. Import useAuth
 
const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // 2. Get the login function

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [uiState, setUiState] = useState({
    showPassword: false,
    loading: false,
    error: null,
    success: false,
    rememberMe: false,
    focusedField: null
  });

  // Prefill email if "Remember me" was used previously
  useEffect(() => {
    const savedEmail = localStorage.getItem('atelier_remember_email');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setUiState(prev => ({ ...prev, rememberMe: true }));
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFocus = (field) => {
    setUiState(prev => ({ ...prev, focusedField: field }));
  };

  const handleBlur = () => {
    setUiState(prev => ({ ...prev, focusedField: null }));
  };

  const validateForm = () => {
    const { email, password } = formData;

    if (!email || !password) {
      return 'Please enter your email and password';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setUiState(prev => ({ ...prev, error: validationError }));
      return;
    }

    setUiState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { email, password } = formData;
      // 3. Capture the response data from the API
      const { data } = await axios.post('/api/users/login', { email, password });

      // Handle "Remember me"
      if (uiState.rememberMe) {
        localStorage.setItem('atelier_remember_email', email);
      } else {
        localStorage.removeItem('atelier_remember_email');
      }

      // 4. THIS IS THE FIX: Update the auth context with the user data
      login(data);

      setUiState(prev => ({ ...prev, success: true, loading: false }));

      setTimeout(() => {
        navigate('/'); // Change this to your post-login route if needed
      }, 1200);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Authentication failed. Please try again.';
      setUiState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-neutral-50 to-amber-50/20 grid grid-cols-1 lg:grid-cols-2">
      {/* Gallery Side */}
      <motion.div
        className="relative hidden lg:block overflow-hidden order-2 lg:order-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <motion.img
          src="https://images.unsplash.com/photo-1577720643272-265f09367456?auto=format&fit=crop&w=1600&q=90"
          alt="Gallery exhibition"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-l from-stone-900/30 via-transparent to-transparent" />

        {/* Brand Identity */}
        <motion.div
          className="absolute top-12 left-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="text-3xl tracking-[0.3em] font-light text-white/90 drop-shadow-2xl">
            ATELIER
          </div>
          <div className="mt-2 text-[10px] tracking-[0.4em] text-amber-100/80 uppercase font-medium">
            Curated Artifacts · Since 1873
          </div>
        </motion.div>

        {/* Collection Info */}
        <motion.div
          className="absolute bottom-12 left-12 text-white max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <div className="text-xs tracking-[0.35em] uppercase text-amber-100/70 font-medium mb-3">
            Members Lounge
          </div>
          <div className="text-4xl font-serif leading-tight mb-4">
            Welcome Back
          </div>
          <ul className="text-sm text-white/80 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-amber-300 mt-1">·</span>
              <span>Seamless access to your collections</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-300 mt-1">·</span>
              <span>Personalized insights and advisories</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-300 mt-1">·</span>
              <span>Exclusive member-only experiences</span>
            </li>
          </ul>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          className="absolute top-1/2 right-12 w-px h-32 bg-gradient-to-b from-transparent via-amber-200/30 to-transparent"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 1, duration: 1.2 }}
        />
      </motion.div>

      {/* Login Form */}
      <motion.main
        className="flex items-center justify-center p-8 lg:p-16 relative order-1 lg:order-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Subtle pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        <motion.div
          className="w-full max-w-md relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
        >
          {/* Mobile brand */}
          <div className="lg:hidden mb-8 text-center">
            <div className="text-2xl tracking-[0.3em] font-light text-stone-800">
              ATELIER
            </div>
            <div className="mt-1 text-[10px] tracking-[0.3em] text-amber-700/70 uppercase font-medium">
              Est. 1873
            </div>
          </div>

          {/* Header */}
          <div className="mb-10">
            <motion.h1
              className="text-4xl font-serif text-stone-800 mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Return to the Circle
            </motion.h1>
            <motion.p
              className="text-sm text-stone-600 leading-relaxed"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Sign in to continue your curation
            </motion.p>
          </div>

          {/* Notifications */}
          <AnimatePresence mode="wait">
            {uiState.error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="mb-6 rounded-sm border border-rose-200/50 bg-rose-50/50 backdrop-blur-sm px-4 py-3 text-sm text-rose-700"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-rose-400" />
                  {uiState.error}
                </div>
              </motion.div>
            )}

            {uiState.success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="mb-6 rounded-sm border border-emerald-200/50 bg-emerald-50/50 backdrop-blur-sm px-4 py-3 text-sm text-emerald-700"
              >
                <div className="flex items-center gap-3">
                  <motion.span
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    ✓
                  </motion.span>
                  Welcome back · Redirecting to your space
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <label
                htmlFor="email"
                className="block text-[11px] font-medium uppercase tracking-[0.2em] text-stone-600 mb-3"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  disabled={uiState.loading || uiState.success}
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                  className="w-full bg-transparent outline-none border-0 border-b border-stone-300 focus:border-amber-700 transition-colors duration-500 placeholder:text-stone-400 py-3 text-stone-800 text-base"
                  placeholder="your.email@domain.com"
                />
                <motion.div
                  className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-amber-600 to-amber-700"
                  initial={{ width: "0%" }}
                  animate={{ width: uiState.focusedField === 'email' || formData.email ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-3">
                <label
                  htmlFor="password"
                  className="block text-[11px] font-medium uppercase tracking-[0.2em] text-stone-600"
                >
                  Password
                </label>
                <motion.button
                  type="button"
                  onClick={() => setUiState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                  className="text-[11px] uppercase tracking-wider text-stone-500 hover:text-amber-700 transition-all duration-300"
                  disabled={uiState.loading || uiState.success}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {uiState.showPassword ? 'Conceal' : 'Reveal'}
                </motion.button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={uiState.showPassword ? 'text' : 'password'}
                  required
                  disabled={uiState.loading || uiState.success}
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => handleFocus('password')}
                  onBlur={handleBlur}
                  className="w-full bg-transparent outline-none border-0 border-b border-stone-300 focus:border-amber-700 transition-colors duration-500 placeholder:text-stone-400 py-3 text-stone-800 text-base"
                  placeholder="Enter your password"
                />
                <motion.div
                  className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-amber-600 to-amber-700"
                  initial={{ width: "0%" }}
                  animate={{ width: uiState.focusedField === 'password' || formData.password ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>

              <div className="flex items-center justify-between mt-3">
                {/* Remember Me */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={uiState.rememberMe}
                      onChange={(e) => setUiState(prev => ({ ...prev, rememberMe: e.target.checked }))}
                      disabled={uiState.loading || uiState.success}
                    />
                    <motion.div
                      className={`w-4 h-4 rounded-sm border transition-all duration-300 ${
                        uiState.rememberMe
                          ? 'bg-gradient-to-br from-amber-600 to-amber-700 border-amber-700'
                          : 'border-stone-400 group-hover:border-amber-600'
                      }`}
                      whileTap={{ scale: 0.9 }}
                    >
                      <AnimatePresence>
                        {uiState.rememberMe && (
                          <motion.svg
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="w-full h-full"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fill="white"
                              d="M13.485 5.176L6.364 12.297 2.515 8.449l.707-.707 3.141 3.141 6.415-6.414.707.707z"
                            />
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                  <span className="text-sm text-stone-600">Remember me</span>
                </label>

                {/* Forgot Password */}
                <Link
                  to="/forgot-password"
                  className="text-[11px] uppercase tracking-wider text-stone-500 hover:text-amber-700 transition-colors duration-300"
                >
                  Forgot password?
                </Link>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.button
                type="submit"
                disabled={uiState.loading || uiState.success}
                whileHover={{ scale: uiState.loading || uiState.success ? 1 : 1.01 }}
                whileTap={{ scale: uiState.loading || uiState.success ? 1 : 0.99 }}
                className="relative w-full bg-gradient-to-r from-stone-800 to-stone-900 text-white py-4 rounded-sm font-light tracking-[0.15em] uppercase text-sm disabled:opacity-70 transition-all duration-500 hover:shadow-xl hover:shadow-stone-900/20 overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700"
                  initial={{ x: "-100%" }}
                  animate={{ x: uiState.success ? "0%" : "-100%" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                <span className="relative flex items-center justify-center">
                  {uiState.loading ? (
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      <span>Signing You In</span>
                    </div>
                  ) : uiState.success ? (
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      Welcome Back
                    </motion.span>
                  ) : (
                    <span className="group-hover:tracking-[0.2em] transition-all duration-300">
                      Sign In
                    </span>
                  )}
                </span>
              </motion.button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div
            className="relative my-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.6 }}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gradient-to-br from-stone-50 via-neutral-50 to-amber-50/20 px-4 text-[10px] uppercase tracking-[0.25em] text-stone-500">
                Alternative Sign In
              </span>
            </div>
          </motion.div>

          {/* Social Sign-In */}
          <motion.div
            className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.02, backgroundColor: "rgb(245 245 244)" }}
              whileTap={{ scale: 0.98 }}
              className="h-12 border border-stone-300 text-stone-700 hover:border-stone-400 transition-all duration-300 rounded-sm text-sm tracking-wide flex items-center justify-center gap-2"
            >
              <span className="text-lg">🍎</span>
              Apple ID
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02, backgroundColor: "rgb(245 245 244)" }}
              whileTap={{ scale: 0.98 }}
              className="h-12 border border-stone-300 text-stone-700 hover:border-stone-400 transition-all duration-300 rounded-sm text-sm tracking-wide flex items-center justify-center gap-2"
            >
              <span className="text-lg">G</span>
              Google
            </motion.button>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="mt-8 pt-8 border-t border-stone-200"
          >
            <p className="text-center text-sm text-stone-600">
              New to Atelier?{' '}
              <Link
                to="/register"
                className="text-amber-700 hover:text-amber-800 underline underline-offset-4 decoration-amber-700/30 transition-all duration-300 font-medium"
              >
                Create an account
              </Link>
            </p>
            <p className="text-center text-[11px] text-stone-400 mt-6 tracking-wider">
              © 1873-2024 Atelier · Curators of Fine Artifacts
            </p>
          </motion.div>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default LoginPage;