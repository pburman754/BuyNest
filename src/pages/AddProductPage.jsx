// src/pages/AddProductPage.jsx

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProductPage = () => {
  const { user } = useAuth(); // Get the logged-in user (for their token)
  const navigate = useNavigate();

  // Form state for all our product fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(1);
  const [images, setImages] = useState(''); // We'll keep this simple for now

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // We'll split the comma-separated image URLs into an array
    const imagesArray = images.split(',').map(url => url.trim());

    try {
      // 1. Set up our auth headers
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      // 2. The data to send
      const productData = {
        name,
        description,
        price,
        category,
        stock,
        images: imagesArray,
      };

      // 3. Make the protected API call
      await axios.post(
        '/api/products', // Our "add product" endpoint
        productData,
        config
      );

      // 4. Success!
      setLoading(false);
      alert('Product added successfully!');
      navigate('/dashboard'); // Go back to the dashboard

    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to add product.');
    }
  };

  return (
    <div className="form-container">
      <h1>Add a New Product</h1>
      <p>Fill out the details for your new product.</p>

      {loading && <div>Loading...</div>}
      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input type="text" id="name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" className="form-input" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price ($)</label>
          <input type="number" id="price" className="form-input" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input type="text" id="category" className="form-input" placeholder="e.g., Electronics, Books" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stock Quantity</label>
          <input type="number" id="stock" className="form-input" value={stock} onChange={(e) => setStock(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor="images">Product Image URLs</label>
          <input type="text" id="images" className="form-input" placeholder="e.g., http://.../img1.png, http://.../img2.png" value={images} onChange={(e) => setImages(e.target.value)} />
          <small>Separate multiple URLs with a comma (,)</small>
        </div>

        <button type="submit" className="btn btn-block" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;