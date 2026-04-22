import React from 'react';
import Navbar from './Navbar';

const AppLayout = ({ children, hideNav = false }) => {
  return (
    <div className="min-h-screen bg-base">
      {!hideNav && <Navbar />}
      <main className={!hideNav ? 'pt-16' : ''}>{children}</main>
    </div>
  );
};

export default AppLayout;
