
import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';

interface CheckoutPageProps {
  onPlaceOrder: () => void;
  onBack: () => void;
}

type CheckoutStep = 'shipping' | 'payment';

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onPlaceOrder, onBack }) => {
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const { state } = useCart();
  const [shippingInfo, setShippingInfo] = useState({
    name: '', email: '', address: '', city: '', postalCode: '', country: '',
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '', expiryDate: '', cvc: '',
  });

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };
  
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceOrder();
  };

  const isPaymentFormValid = useMemo(() => {
    return (
      paymentInfo.cardNumber.replace(/\s/g, '').length >= 12 &&
      /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(paymentInfo.expiryDate) &&
      /^[0-9]{3,4}$/.test(paymentInfo.cvc)
    );
  }, [paymentInfo]);

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={step === 'shipping' ? onBack : () => setStep('shipping')} className="flex items-center text-gray-600 hover:text-brand-primary font-semibold mb-6">
        <ChevronLeftIcon />
        <span className="ml-2">{step === 'shipping' ? 'Back to Shop' : 'Back to Shipping'}</span>
      </button>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {step === 'shipping' ? (
            <ShippingForm onSubmit={handleShippingSubmit} onChange={handleShippingChange} values={shippingInfo} />
          ) : (
            <PaymentForm onSubmit={handlePaymentSubmit} onChange={handlePaymentChange} values={paymentInfo} shippingInfo={shippingInfo} isValid={isPaymentFormValid} />
          )}

          <OrderSummary subtotal={subtotal} tax={tax} total={total} />
        </div>
      </div>
    </div>
  );
};

// --- Sub-components for better organization ---

const ShippingForm = ({ onSubmit, onChange, values }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
    <form onSubmit={onSubmit} className="space-y-4">
      <InputField name="name" placeholder="Full Name" value={values.name} onChange={onChange} />
      <InputField name="email" type="email" placeholder="Email Address" value={values.email} onChange={onChange} />
      <InputField name="address" placeholder="Street Address" value={values.address} onChange={onChange} />
      <InputField name="city" placeholder="City" value={values.city} onChange={onChange} />
      <InputField name="postalCode" placeholder="Postal Code" value={values.postalCode} onChange={onChange} />
      <InputField name="country" placeholder="Country" value={values.country} onChange={onChange} />
      <button type="submit" className="w-full bg-brand-accent text-white py-3 rounded-md font-semibold text-lg hover:bg-blue-600 transition-colors duration-300 mt-6">
        Continue to Payment
      </button>
    </form>
  </div>
);

const PaymentForm = ({ onSubmit, onChange, values, shippingInfo, isValid }) => (
  <div>
    <div className="mb-6 p-4 border rounded-md bg-gray-50 text-sm">
      <h3 className="font-semibold mb-2">Shipping To:</h3>
      <p className="text-gray-600">{shippingInfo.name}</p>
      <p className="text-gray-600">{shippingInfo.address}, {shippingInfo.city}</p>
    </div>
    <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
    <form onSubmit={onSubmit} className="space-y-4">
      <InputField name="cardNumber" placeholder="Card Number (min 12 digits)" value={values.cardNumber} onChange={onChange} />
      <div className="flex space-x-4">
        <InputField name="expiryDate" placeholder="MM/YY" value={values.expiryDate} onChange={onChange} />
        <InputField name="cvc" placeholder="CVC" value={values.cvc} onChange={onChange} />
      </div>
      <button type="submit" disabled={!isValid} className="w-full bg-brand-primary text-white py-3 rounded-md font-semibold text-lg transition-colors duration-300 mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-800">
        Place Order
      </button>
    </form>
  </div>
);

const OrderSummary = ({ subtotal, tax, total }) => {
    const { state } = useCart();
    return (
        <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-24">
            <h2 className="text-xl font-semibold mb-4 border-b pb-4">Order Summary</h2>
            {state.items.length > 0 ? (
                <>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {state.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center">
                        <img src={item.images[0]} alt={item.name} className="w-12 h-12 object-cover rounded mr-3"/>
                        <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        </div>
                        <p>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    ))}
                </div>
                <div className="border-t mt-4 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                        <p>Subtotal</p>
                        <p>${subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <p>Taxes (10%)</p>
                        <p>${tax.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-2">
                        <p>Total</p>
                        <p>${total.toFixed(2)}</p>
                    </div>
                </div>
                </>
            ) : (
                <p className="text-gray-500 text-center py-8">Your cart is empty.</p>
            )}
        </div>
    );
};

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
    required
  />
);

export default CheckoutPage;