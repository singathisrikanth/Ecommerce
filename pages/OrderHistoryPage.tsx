
import React from 'react';
import { Order } from '../types';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';

declare global {
    interface Window {
        jspdf: any;
    }
}

interface OrderHistoryPageProps {
  orders: Order[];
  onBack: () => void;
}

const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ orders, onBack }) => {
  const downloadInvoice = (order: Order) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.text("LuxeLane Invoice", 20, 20);
    
    // Order Info
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 20, 30);
    doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`, 20, 35);
    
    // Items Table
    let y = 50;
    doc.setFontSize(14);
    doc.text("Items", 20, y);
    doc.text("Qty", 120, y);
    doc.text("Price", 140, y);
    doc.text("Total", 170, y);
    doc.line(20, y + 2, 190, y + 2);
    
    y += 10;
    doc.setFontSize(12);
    order.items.forEach(item => {
        doc.text(item.name, 20, y);
        doc.text(item.quantity.toString(), 120, y);
        doc.text(`$${item.price.toFixed(2)}`, 140, y);
        doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 170, y);
        y += 7;
    });

    // Totals
    y += 10;
    doc.line(120, y, 190, y);
    y += 7;
    doc.text(`Subtotal:`, 140, y);
    doc.text(`$${order.subtotal.toFixed(2)}`, 170, y);
    y += 7;
    doc.text(`Tax (10%):`, 140, y);
    doc.text(`$${order.tax.toFixed(2)}`, 170, y);
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.text(`Total:`, 140, y);
    doc.text(`$${order.total.toFixed(2)}`, 170, y);

    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Thank you for your purchase!", 20, y + 20);

    doc.save(`invoice-${order.id}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-brand-primary font-semibold mb-6">
            <ChevronLeftIcon />
            <span className="ml-2">Back to Shop</span>
        </button>

        <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6">My Orders</h1>
            {orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.slice().reverse().map(order => (
                        <div key={order.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between sm:items-center">
                            <div>
                                <p className="font-bold text-lg">{order.id}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(order.date).toLocaleDateString()}
                                </p>
                                <p className="font-semibold mt-2">${order.total.toFixed(2)}</p>
                            </div>
                            <button
                                onClick={() => downloadInvoice(order)}
                                className="mt-4 sm:mt-0 bg-brand-primary text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-800 transition-colors duration-300"
                            >
                                Download Invoice
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center py-8">You haven't placed any orders yet.</p>
            )}
        </div>
    </div>
  );
};

export default OrderHistoryPage;