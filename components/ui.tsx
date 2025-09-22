import React, { ReactNode } from 'react';
import { AppToast } from '../types';
import { CheckCircleIcon, PlusIcon, XCircleIcon, XIcon } from './Icons';

// Card
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}
export const Card = ({ children, className, ...props }: CardProps) => (
  <div className={`bg-secondary rounded-lg shadow-lg p-4 ${className}`} {...props}>
    {children}
  </div>
);

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}
export const Button = ({ children, className, variant = 'primary', ...props }: ButtonProps) => {
  const baseClasses = "w-full text-center py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2";
  const variantClasses = {
    primary: 'bg-accent text-primary hover:bg-accent-hover disabled:bg-tertiary',
    secondary: 'bg-tertiary text-text-primary hover:bg-slate-700 disabled:bg-slate-800',
    danger: 'bg-red-600 text-text-primary hover:bg-red-500'
  };
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Floating Action Button (FAB)
interface FABProps {
  onClick: () => void;
  children: React.ReactNode;
  'aria-label': string;
}
export const FAB = ({ onClick, children, 'aria-label': ariaLabel }: FABProps) => (
  <button
    onClick={onClick}
    className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-accent text-primary rounded-full py-3 px-6 flex items-center gap-2 shadow-lg hover:bg-accent-hover transition-transform duration-200 transform hover:scale-105 z-10 font-semibold"
    aria-label={ariaLabel}
  >
    {children}
  </button>
);


// Ad Banner
export const AdBanner = () => (
  <div className="mt-4 p-2 text-center bg-tertiary rounded-lg text-sm text-text-secondary">
    Advertisement Placeholder
  </div>
);

// Input Fields
export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`w-full bg-tertiary p-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-accent ${props.className}`} />
);

export const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className={`w-full bg-tertiary p-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-accent ${props.className}`} />
);

export const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className={`w-full bg-tertiary p-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-accent appearance-none ${props.className}`} />
);


// Modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}
export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-secondary rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-tertiary">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-tertiary"><XIcon /></button>
        </header>
        <div className="p-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// Toast Notifications
export const ToastContainer = ({ toasts }: { toasts: AppToast[] }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-full max-w-xs">
      {toasts.map(toast => (
        <div key={toast.id} className={`flex items-center gap-3 p-3 rounded-lg shadow-lg animate-fade-in-out ${toast.type === 'success' ? 'bg-green-800' : 'bg-red-800'}`}>
          {toast.type === 'success' ? <CheckCircleIcon /> : <XCircleIcon />}
          <span className="text-text-primary font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};