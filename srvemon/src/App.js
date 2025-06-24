



// src/App.js
import React from 'react';
// import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import './App.css';

// import Header from './components/Header';
// import Nav from './components/Nav';
import Footer from './components/Footer/Footer';
import Main from './Main'; // Import Main component

function App() {
  return (
    <> {/* Ensure Router wraps everything */}
      
      <Main />
      {/* <Header />
      <Nav /> */}
      <Footer />
    </>
  );
}

export default App;
