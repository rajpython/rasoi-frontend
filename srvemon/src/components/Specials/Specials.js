

// src/components/Specials.js

import React, { useState, useEffect, useRef } from 'react';
import './Specials.css';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../apiConfig';

function Specials() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const sliderRef = useRef(null);
  const timeoutRef = useRef(null);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch(`${BASE_URL}/restaurante/menu-items/?featured=true`);
        const data = await res.json();
        if (data.results?.length > 0) {
          setFeaturedItems(data.results);
        }
      } catch (err) {
        console.error("Failed to fetch featured items", err);
      }
    }
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (!featuredItems.length || isPaused || document.hidden) return;
    timeoutRef.current = setTimeout(() => {
      setIndex(prev => prev + 1);
    }, 1800);
    return () => clearTimeout(timeoutRef.current);
  }, [index, featuredItems, isPaused]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      clearTimeout(timeoutRef.current);
      if (!document.hidden && !isPaused) {
        timeoutRef.current = setTimeout(() => {
          setIndex(prev => prev + 1);
        }, 4000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPaused]);

  const handleTransitionEnd = () => {
    if (index === featuredItems.length) {
      setIsTransitioning(false);
      setIndex(0);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    }
  }, [isTransitioning]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        setIndex(prev => (prev + 1) % (featuredItems.length + 1));
      } else {
        setIndex(prev => (prev > 0 ? prev - 1 : 0));
      }
    }
  };

  if (!featuredItems.length) return <p>Loading specials...</p>;
  const slides = [...featuredItems, featuredItems[0]];

  return (
  <section className="specials">
    <div className="specials-row">
      <div className="specials-header">
        <h2>This Week's Specials!</h2>
        <button className="order-online" onClick={() => navigate('/order-online')} aria-label="Order Online">
                Order Online
        </button>
      </div>

      <div
        className="carousel-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="carousel-slider"
          ref={sliderRef}
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: isTransitioning ? "transform 0.8s ease-in-out" : "none",
          }}
        >
          {slides.map((item, i) => (
            <div className="carousel-slide" key={`${item.id}-${i}`}>
              <img src={item.image} alt={item.title} className="special-image" />
              <div className="special-text">
                <h3>{item.title}</h3>
                <p><strong>₹{item.price}</strong></p>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        {isPaused && <div className="pause-indicator">⏸</div>}
      </div>
    </div>
  </section>

  );
}

export default Specials;
