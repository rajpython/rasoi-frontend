// src/pages/HomePage.js
import React, {useEffect} from 'react';

import Specials from '../../components/Specials/Specials';
// import CustomersSay from '../components/CustomersSay';
import CustomerReviews from '../../components/CustomerReviews/CustomerReviews';
// import ContinousCarousel from '../components/ContinousCarousel';

import Asuran from '../../components/Asuran/Asuran';
// import ImageSlideshow from '../components/ImageSlideShow/ImageSlideShow';
// import ContinuousFullScreenCarousel from '../components/ContinuousFullScreenCarousel';
import SlidingPauseCarousel from '../../components/SlidingPauseCarousel/SlidingPauseCarousel';
import "./HomePage.css"




function HomePage() {
  useEffect(() => {
    // Save the current body bg
    const prevBg = document.body.style.backgroundColor;
    const prevColor = document.body.style.color;
    // Set HomePage bg
    document.body.style.backgroundColor = '#495E57';
    document.body.style.color = '#FBDABB';

    return () => {
      // Restore on unmount/leave
      document.body.style.backgroundColor = prevBg || '#EDECEE';
      document.body.style.color = prevColor || '#333';
    };
  }, []);
  return (
    <main className="main-content">
        
      {/* <ImageSlideshow /> */}
      {/* <ContinousCarousel /> */}
      {/* <ContinuousFullScreenCarousel /> */}
        
      <SlidingPauseCarousel />
      {/* <CallToAction /> */}

      <CustomerReviews />
        
      <Specials />
        

      <Asuran />
    </main>
  );
}

export default HomePage;
