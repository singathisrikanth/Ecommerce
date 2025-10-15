
import React from 'react';

interface OrderSuccessPageProps {
  orderId: string | null;
  onContinueShopping: () => void;
}

const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orderId, onContinueShopping }) => {
  return (
    <div className="text-center bg-white p-12 rounded-lg shadow-xl max-w-2xl mx-auto">
      <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h1 className="text-3xl font-bold text-brand-primary mt-4 mb-2">Thank you for your order!</h1>
      <p className="text-lg text-gray-600 mb-6">
        Your order has been placed successfully. A confirmation email will be sent to you shortly.
      </p>
      {orderId && (
        <div className="bg-gray-100 rounded-md p-3 mb-8">
            <p className="text-gray-600">Your Order ID is: <span className="font-bold text-brand-primary">{orderId}</span></p>
        </div>
      )}
      <button
        onClick={onContinueShopping}
        className="bg-brand-primary text-white py-3 px-8 rounded-md font-semibold hover:bg-gray-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderSuccessPage;