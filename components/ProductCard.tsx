
import React from 'react';
import { Product } from '../types';
import Rating from './Rating';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group flex flex-col">
      <div className="relative overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.originalPrice && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              SALE
            </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
        <h3 className="text-lg font-semibold text-brand-primary mb-2 flex-grow">{product.name}</h3>
        <div className="flex items-center mb-3">
          <Rating rating={product.rating} />
          <span className="text-xs text-gray-500 ml-2">({product.reviewCount} reviews)</span>
        </div>
        <div className="flex items-baseline justify-between mb-4">
          <p className="text-xl font-bold text-brand-primary">${product.price.toFixed(2)}</p>
          {product.originalPrice && (
            <p className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</p>
          )}
        </div>
        <button
          onClick={() => onSelectProduct(product)}
          className="w-full mt-auto bg-brand-primary text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
