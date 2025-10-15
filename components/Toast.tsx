
import React, { useEffect } from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Auto-hide after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
      }`}
      aria-live="assertive"
    >
      {show && (
        <div className="flex items-center bg-green-600 text-white text-sm font-medium px-4 py-3 rounded-md shadow-lg">
          <CheckCircleIcon className="w-5 h-5 mr-3" />
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default Toast;
