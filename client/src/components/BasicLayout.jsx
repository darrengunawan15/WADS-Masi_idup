import React from 'react';
import Navbar from './navbar';
import Footer from './footer';

const BasicLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default BasicLayout; 