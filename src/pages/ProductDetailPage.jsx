// src/pages/ProductDetailPage.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import both hooks
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./ProductDetailPage.css"; // We'll create this soon

const ProductDetailPage = () => {
  // 2. Get the 'id' from the URL. It MUST match the name in App.jsx
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // 3. We have the same states as the homepage
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleStartChat = async () => {
    if (!user) {
      // If not logged in, send to login page
      navigate("/login");
      return;
    }

    try {
      // Set up auth headers
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      // Call the "find or create" conversation endpoint
      // Our backend fix gives us 'product.shop.owner'
      await axios.post(
        "/api/conversations",
        { receiverId: product.shop.owner },
        config
      );

      // 6. Success! Send user to their inbox
      navigate("/chat");
    } catch (err) {
      console.error("Error starting conversation", err);
      alert("Error starting chat. Please try again.");
    }
  };
  // 4. This hook will run when the component loads
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // 5. Use the 'id' to fetch ONE specific product
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch product.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // 6. The dependency array is NOT empty!

  // 7. Show loading/error states
  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  if (!product) {
    return <div>Product not found.</div>;
  }

  // 8. This is our JSX for the product layout
  return (
    <div className="product-detail-container">
      <div className="product-detail-image">
        <img src={product.images[0]} alt={product.name} />
      </div>
      <div className="product-detail-info">
        <h1 className="product-detail-name">{product.name}</h1>
        <p className="product-detail-price">${product.price.toFixed(2)}</p>
        <p className="product-detail-description">{product.description}</p>
        <button className="btn btn-block">Add to Cart</button>

        <button
          onClick={handleStartChat}
          className="btn btn-block btn-secondary"
        >
          Chat with Seller
        </button>

        {/* 9. Let's show the shop info! */}
        <div className="product-detail-shop">
          <p>
            Sold by: <strong>{product.shop.name}</strong>
          </p>
          {/* We'll make this a chat link later */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
