// src/components/ProductCard.jsx

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// 1. We receive 'product' as a prop
const ProductCard = ({ product }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-stone-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full"
    >
      <Link to={`/product/${product._id}`} className="block h-full">
        {/* Artifact Frame */}
        <div className="relative aspect-[4/5] bg-gradient-to-b from-stone-100 to-stone-50 p-4 h-full flex flex-col">
          <div className="absolute inset-4 border border-stone-300" />
          <div className="absolute inset-5 border border-stone-200" />
          <div className="relative h-full flex items-center justify-center p-8 flex-grow">
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="max-h-full w-auto object-contain" 
            />
          </div>
          <div className="product-card-info text-center mt-auto pt-4">
            <h3 className="font-serif text-lg font-semibold text-stone-800 mb-2">{product.name}</h3>
            <p className="text-stone-600 font-bold">${product.price.toFixed(2)}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;