// src/components/ProductCard.jsx

import { Link } from 'react-router-dom';
import './ProductCard.css'; // We'll create this next

// 1. We receive 'product' as a prop
const ProductCard = ({ product }) => {
  return (
    // 2. We use <Link> to make the whole card clickable
    <Link to={`/product/${product._id}`} className="product-card">
      <img 
        src={product.images[0]} 
        alt={product.name} 
        className="product-card-image" 
      />
      <div className="product-card-info">
        <h3 className="product-card-name">{product.name}</h3>
        {/* 3. We format the price */}
        <p className="product-card-price">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;