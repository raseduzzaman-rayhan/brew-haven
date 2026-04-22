import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';

const CoffeeCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="card bg-base-100 shadow-xl overflow-hidden group"
    >
      <figure className="relative h-64">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 right-2">
          <span className="badge badge-primary font-bold">{product.category}</span>
        </div>
      </figure>
      <div className="card-body p-5">
        <div className="flex justify-between items-start">
          <h2 className="card-title font-serif text-xl">{product.name}</h2>
          <span className="text-primary font-bold text-lg">${product.price.toFixed(2)}</span>
        </div>
        <p className="text-base-content/70 text-sm line-clamp-2 mt-1">{product.description}</p>
        <div className="card-actions justify-end mt-4">
          <button 
            onClick={() => addToCart(product)}
            className="btn btn-primary btn-md rounded-full w-full gap-2 font-bold"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CoffeeCard;
