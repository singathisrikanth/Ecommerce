
import React, { useState } from 'react';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import Rating from '../components/Rating';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { ShoppingBagIcon } from '../components/icons/ShoppingBagIcon';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onLoginRequest: () => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onBack, onLoginRequest }) => {
  const [mainImage, setMainImage] = useState(product.images[0]);
  const { dispatch } = useCart();
  const { state: userState } = useUser();
  
  const handleAddToCart = () => {
    if (userState.isAuthenticated) {
      dispatch({ type: 'ADD_ITEM', payload: product });
    } else {
      onLoginRequest();
    }
  };

  return (
    <div>
      <button onClick={onBack} className="flex items-center text-gray-600 hover:text-brand-primary font-semibold mb-6">
        <ChevronLeftIcon />
        <span className="ml-2">Back to Products</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden aspect-square">
            <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setMainImage(img)}
                className={`rounded-md overflow-hidden aspect-square border-2 ${mainImage === img ? 'border-brand-accent' : 'border-transparent'} hover:border-brand-accent transition`}
              >
                <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <span className="text-sm text-gray-500 uppercase tracking-wider">{product.category}</span>
          <h1 className="text-4xl font-bold text-brand-primary">{product.name}</h1>
          <div className="flex items-center space-x-2">
            <Rating rating={product.rating} />
            <span className="text-gray-600">{product.rating.toFixed(1)} ({product.reviewCount} reviews)</span>
          </div>
          <p className="text-3xl font-bold text-brand-primary">${product.price.toFixed(2)}</p>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
          
          <div>
            <h3 className="font-semibold mb-2">Details</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
                {product.details.map((detail, i) => <li key={i}>{detail}</li>)}
            </ul>
          </div>

          <div className="pt-4">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center bg-brand-primary text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-gray-800 transition-colors duration-300"
            >
              <ShoppingBagIcon />
              <span className="ml-2">Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="mt-12 pt-8 border-t">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        {product.reviews.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map(review => <ReviewCard key={review.id} review={review} />)}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet for this product.</p>
        )}
      </div>
    </div>
  );
};

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center mb-2">
            <Rating rating={review.rating} />
            <p className="ml-4 font-bold">{review.author}</p>
        </div>
        <p className="text-gray-500 text-sm mb-3">{new Date(review.date).toLocaleDateString()}</p>
        <p className="text-gray-700">{review.comment}</p>
    </div>
);

export default ProductDetailPage;
