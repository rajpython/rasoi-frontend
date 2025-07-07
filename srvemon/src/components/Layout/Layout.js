// src/components/Layout.js
import React, { useEffect, useState } from 'react';
import Header from './Header';
import Nav from './Nav';
import "./HeaderNav.css"

function Layout({ children }) {
  const [shrunk, setShrunk] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShrunk(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Header shrunk={shrunk} />
      <Nav shrunk={shrunk} />
     
      <div style={{ marginTop: window.innerWidth < 600 ? (shrunk ? 40 : 80) : (shrunk ? 50 : 90) }}>

        {children}
      </div>
    </>
  );
}

export default Layout;

