// src/components/Header.jsx
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const navLinks = [
    { path: '/collections', label: 'Collections' },
    { path: '/exhibitions', label: 'Exhibitions' },
    { path: '/artists', label: 'Artists' },
    { path: '/about', label: 'About' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled
            ? 'bg-white/70 backdrop-blur-xl shadow-lg'
            : 'bg-white/50 backdrop-blur-md'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="px-6 lg:px-12">
            <div className="flex items-center justify-between h-20">
              {/* Logo Section */}
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <Link to="/" className="group flex items-center space-x-4">
                  {/* Logo Mark */}
                  <div className="relative">
                    <motion.div
                      className="w-10 h-10 border border-stone-800 rounded-sm flex items-center justify-center"
                      whileHover={{ scale: 1.05, borderColor: '#92400e' }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-stone-800 font-serif text-lg">A</span>
                    </motion.div>
                  </div>
                  
                  {/* Brand Name */}
                  <div className="hidden sm:block">
                    <div className="text-xl tracking-[0.3em] font-light text-stone-800 group-hover:text-amber-700 transition-colors duration-500">
                      ATELIER
                    </div>
                    <div className="text-[9px] tracking-[0.35em] text-stone-500 uppercase mt-0.5">
                      Est. 1873
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center">
                <div className="flex items-center space-x-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                    >
                      <Link
                        to={link.path}
                        className={`relative px-5 py-2 text-[11px] font-medium tracking-[0.2em] uppercase transition-all duration-500 ${
                          isActive(link.path)
                            ? 'text-amber-700'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        {link.label}
                        <motion.div
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-amber-700"
                          initial={{ width: 0 }}
                          animate={{ width: isActive(link.path) ? '60%' : '0%' }}
                          whileHover={{ width: '60%' }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                        />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-4 w-px bg-stone-300 mx-6" />

                {/* Auth Section */}
                {user ? (
                  <div className="flex items-center space-x-4">
                    {/* Dashboard Link */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                    >
                      <Link
                        to="/dashboard"
                        className={`px-4 py-2 text-[11px] font-medium tracking-[0.2em] uppercase transition-all duration-500 ${
                          isActive('/dashboard')
                            ? 'text-amber-700'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        My Gallery
                      </Link>
                    </motion.div>

                    {/* User Menu */}
                    <motion.div 
                      className="relative" 
                      ref={userMenuRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                    >
                      <motion.button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center space-x-3 px-4 py-2 rounded-sm border border-stone-300 hover:border-amber-700 transition-all duration-500 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                          <span className="text-stone-700 font-serif text-sm">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium tracking-wider text-stone-700 uppercase group-hover:text-amber-700 transition-colors duration-300">
                          {user.name?.split(' ')[0]}
                        </span>
                        <svg className={`w-3 h-3 text-stone-500 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </motion.button>

                      <AnimatePresence>
                        {isUserMenuOpen && (
                          <motion.div
                            className="absolute right-0 mt-3 w-64 bg-white rounded-sm shadow-xl border border-stone-200 overflow-hidden"
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <div className="px-5 py-4 border-b border-stone-200 bg-gradient-to-br from-stone-50 to-amber-50/20">
                              <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-1">Member Since 2024</p>
                              <p className="text-sm font-medium text-stone-800">{user.name}</p>
                              <p className="text-xs text-stone-600 mt-0.5">{user.email}</p>
                            </div>
                            
                            <div className="py-2">
                              <Link
                                to="/profile"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center space-x-3 px-5 py-2.5 text-sm text-stone-700 hover:bg-amber-50/50 hover:text-amber-700 transition-all duration-300"
                              >
                                <span className="text-lg">👤</span>
                                <span>Profile Settings</span>
                              </Link>
                              
                              <Link
                                to="/collections/my"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center space-x-3 px-5 py-2.5 text-sm text-stone-700 hover:bg-amber-50/50 hover:text-amber-700 transition-all duration-300"
                              >
                                <span className="text-lg">🎨</span>
                                <span>My Collection</span>
                              </Link>

                              <Link
                                to="/chat"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center space-x-3 px-5 py-2.5 text-sm text-stone-700 hover:bg-amber-50/50 hover:text-amber-700 transition-all duration-300"
                              >
                                <span className="text-lg">💬</span>
                                <span>Messages</span>
                              </Link>
                              
                              <div className="border-t border-stone-200 mt-2 pt-2">
                                <button
                                  onClick={handleLogout}
                                  className="w-full flex items-center space-x-3 px-5 py-2.5 text-sm text-stone-600 hover:bg-rose-50 hover:text-rose-700 transition-all duration-300"
                                >
                                  <span className="text-lg">↩</span>
                                  <span>Sign Out</span>
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                    >
                      <Link
                        to="/login"
                        className="px-5 py-2.5 text-[11px] font-medium tracking-[0.2em] uppercase text-stone-600 hover:text-amber-700 transition-colors duration-300"
                      >
                        Sign In
                      </Link>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                    >
                      <Link
                        to="/register"
                        className="px-6 py-2.5 text-[11px] font-medium tracking-[0.15em] uppercase bg-stone-800 text-white hover:bg-amber-700 transition-all duration-500 rounded-sm"
                      >
                        Join Atelier
                      </Link>
                    </motion.div>
                  </div>
                )}
              </nav>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-sm text-stone-700 hover:bg-stone-100 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.svg
                      key="close"
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </motion.svg>
                  ) : (
                    <motion.svg
                      key="menu"
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden bg-white border-t border-stone-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <motion.div className="px-6 py-6 space-y-1">
                {/* Mobile Navigation Links */}
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 text-[12px] font-medium tracking-[0.15em] uppercase transition-all duration-300 ${
                        isActive(link.path)
                          ? 'text-amber-700 bg-amber-50/50'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="border-t border-stone-200 my-4" />

                {user ? (
                  <>
                    {/* User Info Card */}
                    <motion.div
                      className="px-4 py-4 bg-gradient-to-br from-stone-50 to-amber-50/20 rounded-sm mb-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                          <span className="text-stone-700 font-serif text-lg">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-stone-800">{user.name}</p>
                          <p className="text-xs text-stone-600">{user.email}</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Mobile User Links */}
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-[12px] font-medium tracking-[0.15em] uppercase text-stone-600 hover:text-amber-700 hover:bg-amber-50/50 transition-all duration-300"
                    >
                      My Gallery
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-[12px] font-medium tracking-[0.15em] uppercase text-stone-600 hover:text-amber-700 hover:bg-amber-50/50 transition-all duration-300"
                    >
                      Profile Settings
                    </Link>

                    <Link
                      to="/chat"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-[12px] font-medium tracking-[0.15em] uppercase text-stone-600 hover:text-amber-700 hover:bg-amber-50/50 transition-all duration-300"
                    >
                      Messages
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-[12px] font-medium tracking-[0.15em] uppercase text-stone-600 hover:text-rose-700 hover:bg-rose-50 transition-all duration-300"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-[12px] font-medium tracking-[0.15em] uppercase text-stone-600 hover:text-amber-700 hover:bg-amber-50/50 transition-all duration-300"
                    >
                      Sign In
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-[12px] font-medium tracking-[0.15em] uppercase bg-stone-800 text-white hover:bg-amber-700 transition-all duration-300 text-center rounded-sm"
                    >
                      Join Atelier
                    </Link>
                  </>
                )}

                {/* Footer */}
                <motion.div
                  className="pt-6 mt-4 border-t border-stone-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <p className="text-center text-[10px] tracking-[0.25em] text-stone-400 uppercase">
                    © 1873-2024 Atelier
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer */}
      <div className="h-20"></div>
    </>
  );
};

export default Header;