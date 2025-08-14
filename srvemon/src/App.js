



// // src/App.js
// import React from 'react';
// // import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
// import './App.css';

// // import Header from './components/Header';
// // import Nav from './components/Nav';
// import Footer from './components/Footer/Footer';
// import Main from './Main'; // Import Main component
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";




// function App() {
//   return (
//     <> {/* Ensure Router wraps everything */}
      
//       <Main />
//       {/* <Header />
//       <Nav /> */}
//       <Footer />
//     </>
//   );
// }

// export default App;


// src/App.js
import React from 'react';
import './App.css';
import Footer from './components/Footer/Footer';
import Main from './Main';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import ChaatGPTWidget from "./components/ChaatGPTWidget/ChaatGPTWidget";

// Load Stripe publishable key from .env
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Detect if we are in an iframe
const isInIframe = window.self !== window.top;

function App() {
  return (
    <>
      <Elements stripe={stripePromise}>
        <Main />
        {/* <ChaatGPTWidget />
        <Footer /> */}
        {!isInIframe && <ChaatGPTWidget />}
        {!isInIframe && <Footer />}
      </Elements>
    </>
  );
}

export default App;
