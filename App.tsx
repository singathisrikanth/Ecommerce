
import React, { useState, useCallback } from 'react';
import { Product, Order } from './types';
import { products as initialProducts } from './data/products';
import { useCart } from './context/CartContext';
import Header from './components/Header';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import CartView from './components/CartView';
import Footer from './components/Footer';
import Toast from './components/Toast';

type Page = 'list' | 'detail' | 'checkout' | 'success' | 'orderHistory';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const { state: cartState, dispatch } = useCart();
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleSelectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    setPage('detail');
    window.scrollTo(0, 0);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedProduct(null);
    setPage('list');
  }, []);
  
  const handleViewOrders = useCallback(() => {
    setPage('orderHistory');
    window.scrollTo(0, 0);
  }, []);

  const handleGoToCheckout = useCallback(() => {
    dispatch({ type: 'CLOSE_CART' });
    setPage('checkout');
    window.scrollTo(0, 0);
  }, [dispatch]);

  const handlePlaceOrder = useCallback(() => {
    const subtotal = cartState.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    const newOrderId = `ORD-${Date.now()}`;

    const newOrder: Order = {
      id: newOrderId,
      date: new Date().toISOString(),
      items: cartState.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      subtotal,
      tax,
      total
    };

    setOrders(prevOrders => [...prevOrders, newOrder]);
    setLastOrderId(newOrderId);
    dispatch({ type: 'CLEAR_CART' });

    setToastMessage('Confirmation email sent to your inbox!');
    setShowToast(true);

    setPage('success');
    window.scrollTo(0, 0);
  }, [dispatch, cartState.items]);

  const handleContinueShopping = useCallback(() => {
    setPage('list');
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'detail':
        return selectedProduct ? (
          <ProductDetailPage product={selectedProduct} onBack={handleBackToList} />
        ) : null;
      case 'checkout':
        return <CheckoutPage onPlaceOrder={handlePlaceOrder} onBack={handleBackToList} />;
      case 'success':
        return <OrderSuccessPage orderId={lastOrderId} onContinueShopping={handleContinueShopping} />;
      case 'orderHistory':
        return <OrderHistoryPage orders={orders} onBack={handleBackToList} />;
      case 'list':
      default:
        return <ProductListPage products={initialProducts} onSelectProduct={handleSelectProduct} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-brand-primary">
      <Toast message={toastMessage} show={showToast} onClose={() => setShowToast(false)} />
      <Header onViewOrders={handleViewOrders} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>
      <Footer />
      <CartView onGoToCheckout={handleGoToCheckout} />
    </div>
  );
};

export default App;
