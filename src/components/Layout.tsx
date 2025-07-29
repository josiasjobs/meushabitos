
import React from 'react';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-600 p-4">
      <div className="max-w-2xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;
