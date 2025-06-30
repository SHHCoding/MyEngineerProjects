import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const toastConfig = {
  success: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bg: 'bg-green-500',
  },
  error: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bg: 'bg-red-500',
  },
};

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
    }, 4000);

    const fadeOutTimer = setTimeout(() => {
      onClose();
    }, 4500);

    return () => {
      clearTimeout(timer);
      clearTimeout(fadeOutTimer);
    };
  }, [onClose]);

  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(() => {
        onClose();
    }, 500)
  }

  return (
    <div
      className={`fixed top-5 right-5 z-50 transform transition-all duration-500 ${isFadingOut ? 'animate-fade-out' : 'animate-slide-in-down'}`}
    >
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-4 flex items-center space-x-4 max-w-sm border border-slate-200 dark:border-slate-700">
        <div>{toastConfig[type].icon}</div>
        <p className="font-medium text-slate-700 dark:text-slate-200">{message}</p>
        <button
          onClick={handleClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Close notification"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;
