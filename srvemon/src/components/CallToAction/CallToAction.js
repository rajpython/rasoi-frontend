
import React from 'react';
import { useNavigate } from 'react-router-dom';
import banno from '../../assets/banno.png'; // or wherever your image is
import './CallToAction.css';

function CallToAction() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <img
        src={banno}
        alt="Delicious Indian food"
        className="hero-image"
      />
      <div className="hero-text">
        <h1 className="hero-heading">🧂 <em>यूपी के ठाठ बा। गोरखपुर में चाट बा!</em> 🧂</h1>
        <p className="hero-description">
          At our <strong>चाटनाथ मठ</strong>, ancient recipes flirt shamelessly with modern taste buds.  
          We blend the <em>soul of Banaras</em>, <em>spice of Indore</em>, and <em>swagger of Delhi</em> — all on a single thaali.
        </p>
        <p className="hero-mission">
          Our mission? To serve chaat so divine that even your grandma begs:<br />
          <span className="hero-quote">“एगो अउरो पिलेट लाई दे बबुआ...”</span>
        </p>
        {/* <p className="hero-location"> Ramgarh Taal</p>
        <p className="hero-location"> Gorakhpur</p> */}

        <button onClick={() => navigate('/order-online')} aria-label="Order Online">
          Order Online
        </button>
      </div>
    </section>
  );
}

export default CallToAction;
