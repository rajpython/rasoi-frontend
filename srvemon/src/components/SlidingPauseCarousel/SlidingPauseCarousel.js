import React, { useEffect, useRef, useState } from "react";
import "./SlidingPauseCarousel.css";

const slides = [
  {
    src: require("../../assets/chef.png"),
    title: "Our Chef"
  },
  {
    src: require("../../assets/balan.png"),
    title: "हमरी मल्किनी 🙏"
  },
  {
    src: require("../../assets/foodtable.png"),
    title: "चाट रे चाट!"
  },
  {
    src: require("../../assets/service.png"),
    title: "Service A La Carte"
  },
  {
    src: require("../../assets/dixit.png"),
    title: "Service On The Go"
  },
  {
    src: require("../../assets/foodtable2.png"),
    title: "தெற்கு சுவைகள்"
  },
  {
    src: require("../../assets/customers.png"),
    title: "Golgappa Gossips"
  },
  {
    src: require("../../assets/bhattkapoor.png"),
    title: "Puri Tales"
  },
  {
    src: require("../../assets/foodtable3.png"),
    title: "来自中华"
  },
  {
    src: require("../../assets/sweetbengal.png"),
    title: "আমার মিষ্টি বাংলা"
    
  }
 
];



function SlidingPauseCarousel() {
  const [index, setIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(true);
  const timeoutRef = useRef();
  const slideCount = slides.length;
  const [isPaused, setIsPaused] = useState(false); // New pause state

  const extendedSlides = [...slides, slides[0]];

  // Add pause/resume logic for visibility
  useEffect(() => {
    function handleVisibility() {
      setIsPaused(document.hidden);
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Move to the next slide, but only if not paused
  useEffect(() => {
    if (!isPaused) {
      timeoutRef.current = setTimeout(() => {
        setTransitioning(true);
        setIndex(prev => prev + 1);
      }, 1000 + 2200);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [index, isPaused]);

  // Reset after last slide as before
  useEffect(() => {
    if (index === slideCount) {
      const id = setTimeout(() => {
        setTransitioning(false);
        setIndex(0);
      }, 2200);
      return () => clearTimeout(id);
    }
  }, [index, slideCount]);

  return (
    <div className="carousel-fullscreen-container">
      <div
        className="carousel-fullscreen-track"
        style={{
          width: `${extendedSlides.length * 100}vw`,
          transform: `translateX(-${index * 100}vw)`,
          transition: transitioning
            ? "transform 2.2s cubic-bezier(.5,1,.5,1)"
            : "none"
        }}
      >
        {extendedSlides.map((slide, idx) => (
          <div
            className="carousel-fullscreen-slide"
            key={idx}
            style={{
              width: "100vw",
              backgroundImage: `url(${slide.src})`
            }}
          >
            <div className="carousel-fullscreen-title">{slide.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SlidingPauseCarousel;