import React, { ReactNode } from 'react';
import BottomNav from './BottomNav';
import { AdBanner, ToastContainer } from './ui';
import { useAppContext } from '../hooks/useAppContext';

interface LayoutProps {
  children: ReactNode;
  title: string;
  showAd?: boolean;
}

const Layout = ({ children, title, showAd = true }: LayoutProps) => {
  const { toasts } = useAppContext();
  return (
    <div className="flex flex-col h-full bg-primary">
      <header className="bg-secondary p-4 shadow-md sticky top-0 z-10 text-center">
        <h1 className="text-xl font-bold text-text-primary">{title}</h1>
        {title === 'Sales Dairy' && (
          <p className="text-xs text-text-secondary mt-1">Your Visit, Your Success</p>
        )}
      </header>
      <main className="flex-grow p-4 overflow-y-auto pb-24">
        {children}
        {showAd && <AdBanner />}
      </main>
      <ToastContainer toasts={toasts} />
      <BottomNav />
    </div>
  );
};

export default Layout;