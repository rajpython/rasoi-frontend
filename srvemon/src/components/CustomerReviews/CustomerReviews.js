


import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './CustomerReviews.css';
import BASE_URL from '../../apiConfig';


function CustomerReviews() {

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const [reviews, setReviews] = useState([]);
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ feedback: '', rating: 5 });
  const [formError, setFormError] = useState('');
  const timeoutRef = useRef(null);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  const { user, token } = useContext(AuthContext);
  const isAuthenticated = !!user;

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`${BASE_URL}/restaurante/customer-reviews/`);
        const data = await res.json();
        console.log("Review API result:", data.results?.[0]);
        if (data.results?.length > 0) {
          setReviews(data.results);
        }
      } catch (err) {
        console.error('Failed to fetch reviews', err);
      }
    }
    fetchReviews();
  }, []);

  

//   THE CONTINUOUS SCROLL LOGIC (Vertical)
  useEffect(() => {
    if (!reviews.length || isPaused || document.hidden) return;
    timeoutRef.current = setTimeout(() => {
      setIndex(prev => prev + 1);
    }, 2700);
    return () => clearTimeout(timeoutRef.current);
  }, [index, reviews, isPaused]);


  useEffect(() => {
      const handleVisibilityChange = () => {
        clearTimeout(timeoutRef.current);
        if (!document.hidden && !isPaused) {
          timeoutRef.current = setTimeout(() => {
            setIndex(prev => prev + 1);
          }, 1500);
        }
      };
  
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isPaused]);


  const handleTransitionEnd = () => {
    if (index === reviews.length) {
      // PAUSE for 1 second before resetting
      setTimeout(() => {
        setIsTransitioning(false);
        setIndex(0);
      }, 1200); // 1000ms = 1 second delay
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
        setIndex(prev => (prev + 1) % (reviews.length + 1));
      } else {
        setIndex(prev => (prev > 0 ? prev - 1 : 0));
      }
    }
  };

  if (!reviews.length) return <p>Loading reviews...</p>;
  const slides = [...reviews, reviews[0]];



  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.feedback.trim()) {
      setFormError('Feedback cannot be empty.');
      return;
    }
    try {
      console.log('User:', user, 'Token:', token);
      const res = await fetch(`${BASE_URL}/restaurante/customer-reviews/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Token ${token}` : '',
        },
        body: JSON.stringify({
          feedback: formData.feedback,
          rating: Number(formData.rating),
        }),
      });
      if (!res.ok) throw new Error('Failed to submit review.');
      setShowForm(false);
      setFormData({ feedback: '', rating: 5 });
      navigate('/'); // Redirect to homepage
    } catch (err) {
      setFormError('Could not submit review. Please try again.');
    }
  };


  return (
    <section className="reviews-section-wide">
      <h2 className="reviews-title">What Our Chatoras & Chatorees Say</h2>
      <div
        className="review-carousel-container-wide"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="review-carousel-slider-wide"
          ref={sliderRef}
          onTransitionEnd={handleTransitionEnd}
          // style={{
          //   transform: `translateY(-${index *50/reviews.length}%)`,
          //   transition: isTransitioning ? "transform 1.5s ease-in-out" : "none",
          // }}
          style={{
            transform: `translateY(-${index * 230}px)`,  // 150px = new slide height
            transition: isTransitioning ? "transform 1.5s ease-in-out" : "none",
          }}
          
        >
          {slides.map((r, i) => (
            <div className="review-slide-wide" key={`${r.id || r.user || 'review'}-${i}`}>
              <div className="review-feedback-wide">“{r.feedback}”</div>
              <div className="review-meta-wide">
                <span className="review-user">
                  {/* Show full name if available, otherwise fallback to user field */}
                  {r.first_name || r.last_name
                    ? `${r.first_name || ''} ${r.last_name || ''}`.trim()
                    : r.user}
                  {/* Show city if available */}
                  {r.city ? ` (${r.city})` : ''}
                </span>
                {r.rating ? <span className="review-rating">{"★".repeat(r.rating)}</span> : null}
                {/* <span className="review-date">{r.created_at ? (new Date(r.created_at)).toLocaleDateString() : ''}</span>
                 */}
                 <span className="review-date">
                  {r.created_at
                    ? (new Date(r.created_at)).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })
                    : ""}
                </span>

              </div>
            </div>
          ))}
        </div>
        {isPaused && <div className="pause-indicator">⏸</div>}
      </div>

      {/* Button or form/message below the carousel */}
      <div className="review-action-row">
        {showForm ? (
          <form className="review-form-wide" onSubmit={handleSubmit}>
            <h3>Submit a Review</h3>
            <label>
              Feedback:
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleInputChange}
                rows={4}
                required
                maxLength={300}
                placeholder="Tell us what made your chaat experience chatpata!"
              />
            </label>
            <label>
              Rating:
              <select
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
              >
                {[5,4,3,2,1].map(r => (
                  <option value={r} key={r}>{r} ★</option>
                ))}
              </select>
            </label>
            {formError && <div className="form-error">{formError}</div>}
            <button type="submit" className="submit-btn">Submit Review</button>
            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        ) : (
          isAuthenticated ? (
            <button className="open-form-btn" onClick={() => setShowForm(true)}>
              Submit a Review
            </button>
          ) : (
            <div className="login-message">
              To submit a review, you must be logged in.
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default CustomerReviews;
