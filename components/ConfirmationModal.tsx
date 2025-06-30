import React, { useEffect } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmButtonText }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
       if (event.key === 'Escape') {
          onClose();
       }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-8 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                </svg>
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">{title}</h2>
                <div className="mt-2">
                    <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
                </div>
            </div>
        </div>
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button onClick={onClose} className="w-full justify-center sm:w-auto px-5 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold text-sm transition">បោះបង់</button>
          <button onClick={onConfirm} className="w-full justify-center sm:w-auto px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition">
            {confirmButtonText || 'បញ្ជាក់​ការ​លុប'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;