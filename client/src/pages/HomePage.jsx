// src/pages/HomePage.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './HomePage.css'; // We'll create this

const HomePage = () => {
  // 1. Create state for our products, loading, and errors
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. This hook will run ONCE when the component loads
  useEffect(() => {
    // 3. We define an async function to fetch data
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/products');
        setProducts(data); // 4. Success! Save the products
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchProducts(); // 5. Call the function
  }, []); // 6. The empty array means "run this only once"

  // 7. Show loading or error messages
  if (loading) {
    return <div className="loading-spinner">Loading...</div>; 
  }
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // 8. Show the products!
  return (
    <div>
      <h1>Featured Products</h1>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;