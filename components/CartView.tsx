import React from 'react';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types';
import { XIcon } from './icons/XIcon';
import { TrashIcon } from './icons/TrashIcon';

interface CartViewProps {
  onGoToCheckout: () => void;
}

const CartView: React.FC<CartViewProps> = ({ onGoToCheckout }) => {
  const { state, dispatch } = useCart();
  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => dispatch({ type: 'CLOSE_CART' })}>
      <aside
        className="fixed top-0 right-0 w-full max-w-sm h-full bg-white shadow-2xl z-50 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Shopping Cart</h2>
          <button onClick={() => dispatch({ type: 'CLOSE_CART' })} className="text-gray-500 hover:text-black">
            <XIcon />
          </button>
        </div>

        {state.items.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
            <p className="text-gray-500">Your cart is empty.</p>
            <button 
              onClick={() => dispatch({ type: 'CLOSE_CART' })}
              className="mt-4 bg-brand-primary text-white py-2 px-6 rounded-md font-semibold hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {state.items.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>

            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-4 text-lg font-semibold">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button
                onClick={onGoToCheckout}
                className="w-full bg-brand-accent text-white py-3 rounded-md font-semibold hover:bg-blue-600 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};

const CartItemCard: React.FC<{ item: CartItem }> = ({ item }) => {
  const { dispatch } = useCart();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value, 10);
    if (!isNaN(quantity)) {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity } });
    }
  };
  
  const increment = () => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity + 1 }});
  const decrement = () => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity - 1 }});

  return (
    <div className="flex items-start space-x-4">
      <img src={item.images[0]} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
      <div className="flex-grow">
        <h4 className="font-semibold text-sm">{item.name}</h4>
        <p className="text-gray-500 text-xs">${item.price.toFixed(2)}</p>
        <div className="flex items-center mt-2">
          <button onClick={decrement} className="w-6 h-6 border rounded-l">-</button>
          <input
            type="number"
            value={item.quantity}
            onChange={handleQuantityChange}
            className="w-10 h-6 text-center border-t border-b"
            min="1"
          />
          <button onClick={increment} className="w-6 h-6 border rounded-r">+</button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
        <button
          onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } })}
          className="text-gray-400 hover:text-red-500 mt-2"
          aria-label={`Remove ${item.name}`}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default CartView;
