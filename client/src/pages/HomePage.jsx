// src/pages/HomePage.jsx

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [artifacts, setArtifacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get('/api/products');
        setArtifacts(data);
        setLoading(false);
      } catch (err) {
        setError('The collection is temporarily unavailable.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchArtifacts();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-beige-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 mx-auto mb-8"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#D4AF37"
                strokeWidth="1"
                fill="none"
                strokeDasharray="283"
                strokeDashoffset="75"
              />
            </svg>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-serif text-stone-900 mb-3">
              THE GRAND ATELIER
            </h1>
            <p className="text-sm tracking-[0.3em] text-stone-600 uppercase">
              Preparing Exhibition
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-beige-50 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm border border-stone-300 p-12">
            <div className="w-20 h-20 mx-auto mb-6 text-6xl">🏛️</div>
            <h2 className="text-3xl font-serif text-stone-900 mb-4">
              Gallery Closed
            </h2>
            <p className="text-stone-600 mb-8 leading-relaxed">
              {error}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.reload()}
              className="bg-stone-900 text-white px-10 py-4 text-sm tracking-[0.2em] uppercase hover:bg-stone-800 transition-all duration-300"
            >
              Retry
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Filter artifacts by category - MOVED HERE
  const filteredArtifacts = selectedCategory === 'all' 
    ? artifacts 
    : artifacts.filter(artifact => artifact.category === selectedCategory);

  // Get unique categories - MOVED HERE
  const categories = ['all', ...new Set(artifacts.map(a => a.category))];

  return (
    <div className="min-h-screen bg-stone-50">
      
      {/* Grand Hero Section */}
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative h-screen overflow-hidden bg-stone-900"
      >
        {/* Hero Background Image */}
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=2074')`,
            }}
          />
        </motion.div>

        {/* Ornamental Frame */}
        <div className="absolute inset-4 lg:inset-12 border border-amber-500/20 pointer-events-none" />
        <div className="absolute inset-6 lg:inset-14 border border-amber-500/10 pointer-events-none" />
        
        {/* Hero Content */}
        <div className="relative h-full flex items-center justify-center z-10">
          <div className="text-center text-white px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-6 font-light">
                Established MDCCCLXXIII
              </p>
              <h1 className="text-6xl lg:text-8xl font-serif mb-6 tracking-wider">
                THE GRAND
                <span className="block text-amber-400 mt-2">ATELIER</span>
              </h1>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6" />
              <p className="text-lg lg:text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed font-light">
                A Distinguished Collection of Historical Artifacts & Timeless Treasures
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="mt-12"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="group"
              >
                <div className="flex flex-col items-center">
                  <span className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-4">
                    Enter Gallery
                  </span>
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-amber-400">
                      <path d="M7 10l5 5 5-5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                </div>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Quote Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="bg-gradient-to-b from-stone-900 to-stone-800 py-24"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl lg:text-3xl font-serif text-stone-300 italic leading-relaxed"
          >
            "Art is the signature of civilizations"
          </motion.blockquote>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-amber-400 text-sm tracking-[0.3em] uppercase"
          >
            — Beverly Sills
          </motion.p>
        </div>
      </motion.section>

      {/* Featured Exhibition */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-serif text-stone-900 mb-4">
              Current Exhibition
            </h2>
            <div className="w-24 h-px bg-amber-500 mx-auto mb-6" />
            <p className="text-stone-600 max-w-2xl mx-auto">
              Explore our carefully curated collection of historical artifacts, 
              each piece telling a unique story of human civilization
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex justify-center mb-12">
              <div className="inline-flex gap-2 p-1 bg-stone-100 rounded-full">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-8 py-3 rounded-full text-xs uppercase tracking-[0.2em] transition-all duration-500 ${
                      selectedCategory === category
                        ? 'bg-stone-900 text-white shadow-lg'
                        : 'text-stone-700 hover:bg-white'
                    }`}
                  >
                    {category === 'all' ? 'All Collections' : category}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="text-center mb-12">
              <p className="text-sm text-stone-500 tracking-[0.2em] uppercase">
                Displaying {filteredArtifacts.length} Artifact{filteredArtifacts.length !== 1 && 's'}
              </p>
            </div>
          </motion.div>

          {/* Artifacts Grid */}
          <AnimatePresence mode="wait">
            {filteredArtifacts.length === 0 ? (
              <motion.div
                key="no-artifacts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-6">🏛️</div>
                <h3 className="text-3xl font-serif text-stone-900 mb-4">
                  Collection Under Curation
                </h3>
                <p className="text-stone-600 mb-8">
                  This wing is currently being prepared
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory('all')}
                  className="text-amber-700 hover:text-amber-800 text-sm tracking-[0.2em] uppercase underline underline-offset-8"
                >
                  View All Collections
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="artifacts-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
              >
                {filteredArtifacts.map((artifact, index) => (
                  <motion.div
                    key={artifact._id}
                    variants={itemVariants}
                    custom={index}
                    layout
                    className="group"
                  >
                    <ProductCard product={artifact} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Gallery Information */}
      <section className="py-24 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 text-4xl">🏛️</div>
              <h3 className="text-2xl font-serif mb-4 text-amber-400">Visit Us</h3>
              <p className="text-stone-400 leading-relaxed">
                Tuesday - Sunday<br />
                10:00 AM - 6:00 PM<br />
                <span className="text-xs tracking-wider">CLOSED MONDAYS</span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 text-4xl">📜</div>
              <h3 className="text-2xl font-serif mb-4 text-amber-400">Private Tours</h3>
              <p className="text-stone-400 leading-relaxed">
                Exclusive guided experiences<br />
                By appointment only<br />
                <span className="text-xs tracking-wider">CURATOR LED</span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 text-4xl">🎭</div>
              <h3 className="text-2xl font-serif mb-4 text-amber-400">Special Events</h3>
              <p className="text-stone-400 leading-relaxed">
                Galas & Exhibitions<br />
                Members receive priority access<br />
                <span className="text-xs tracking-wider">RSVP REQUIRED</span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-gradient-to-b from-white to-stone-50"
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-serif text-stone-900 mb-4">
              Become a Patron
            </h2>
            <div className="w-20 h-px bg-amber-500 mx-auto mb-8" />
            <p className="text-stone-600 mb-12 leading-relaxed max-w-xl mx-auto">
              Join our exclusive circle of collectors and receive privileged access to 
              new acquisitions, private viewings, and curator insights
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-6 py-4 bg-white border border-stone-300 focus:border-amber-500 focus:outline-none transition-all duration-300 text-stone-900"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-stone-900 text-white px-10 py-4 text-xs tracking-[0.3em] uppercase hover:bg-stone-800 transition-all duration-300"
              >
                Subscribe
              </motion.button>
            </div>
            
            <p className="text-xs text-stone-500 mt-6 tracking-wider uppercase">
              Your Privacy is Sacred to Us
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-16 border-t border-amber-500/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center">
            <h3 className="text-3xl font-serif mb-4 text-amber-400">THE GRAND ATELIER</h3>
            <p className="text-xs tracking-[0.3em] uppercase text-stone-500 mb-8">
              Est. 1873 · Curators of History
            </p>
            <div className="flex justify-center gap-8 text-xs tracking-[0.2em] uppercase">
              <a href="#" className="text-stone-400 hover:text-amber-400 transition-colors">About</a>
              <span className="text-stone-600">·</span>
              <a href="#" className="text-stone-400 hover:text-amber-400 transition-colors">Collections</a>
              <span className="text-stone-600">·</span>
              <a href="#" className="text-stone-400 hover:text-amber-400 transition-colors">Contact</a>
              <span className="text-stone-600">·</span>
              <a href="#" className="text-stone-400 hover:text-amber-400 transition-colors">Membership</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Golden accent line */}
      <div className="h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600" />
    </div>
  );
};

export default HomePage;