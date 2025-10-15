
import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';

interface HeaderProps {
  onViewOrders: () => void;
}

const Header: React.FC<HeaderProps> = ({ onViewOrders }) => {
  const { state, dispatch } = useCart();
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-brand-primary sticky top-0 z-30 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="text-2xl font-bold text-white tracking-wider" onClick={(e) => { e.preventDefault(); window.location.reload(); }}>
            LuxeLane
          </a>
          <div className="flex items-center space-x-4">
            <button
              onClick={onViewOrders}
              className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
              aria-label="View my orders"
            >
              My Orders
            </button>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_CART' })}
              className="relative text-gray-300 hover:text-white transition-colors duration-200"
              aria-label="Open shopping cart"
            >
              <ShoppingCartIcon />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-brand-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;