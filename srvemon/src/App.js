
// // // import './App.css';

// // // function App() {
// // //   return (
// // //     <div className="App">
// // //       HOMEPAGE
// // //     </div>
// // //   );
// // // }

// // // export default App;
// // import React from 'react';
// // import './App.css';
// // import Header from './Header';
// // import Nav from './Nav';
// // import Main from './Main';
// // import Footer from './Footer';

// // function App() {
// //   return (
// //     <>
// //       <Header />
// //       <Nav />
// //       <Main />
// //       <Footer />
// //     </>
// //   );
// // }

// // export default App;


// // App.js
// import React from 'react';
// // import { Routes, Route } from 'react-router-dom';
// import { BrowserRouter as Router } from 'react-router-dom';
// import './App.css';

// import Header from './components/Header';
// import Nav from './components/Nav';
// import Footer from './components/Footer';

// // import HomePage from './pages/HomePage';
// // import BookingPage from './pages/BookingPage';

// import Main from './Main'; // Import Main component

// // function App() {
// //   return (
// //     <>
// //       <Header />
// //       <Nav />

// //       {/* Define routes */}
// //       <Routes>
// //         <Route path="/*" element={<Main />} />
// //       </Routes>

// //       <Footer />
// //     </>
// //   );
// // }

// function App() {
//   return (
//     <Router>
//       <Header />
//       <Nav />
//       <Main />
//       <Footer />
//     </Router>
//   );
// }


// export default App;

// function App() {
//   return (
//     <>
//       <Header />
//       <Nav />

//       {/* Define routes */}
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/reservations" element={<BookingPage />} />
//         {/* Add more routes as needed */}
//       </Routes>

//       <Footer />
//     </>
//   );
// }

// export default App;




// src/App.js
import React from 'react';
// import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import './App.css';

import Header from './components/Header';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Main from './Main'; // Import Main component

function App() {
  return (
    <> {/* Ensure Router wraps everything */}
      <Header />
      <Nav />
      <Main />
      <Footer />
    </>
  );
}

export default App;
