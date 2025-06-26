

import React from 'react';
import './AboutPage.css';
import Dhanno_Banno_poster from '../../assets/Dhanno_Banno_poster.png';
import CallToAction from '../../components/CallToAction/CallToAction'; 

export default function AboutPage() {
  return (
    <div>
      <CallToAction />
    <div className="about-container">
      <div className="about-content">
        <h1 className="title">
          With Love from 🐴 Dhanno <span style={{margin: '0 0.3em'}}></span>
          <span title="Young Belle" role="img" aria-label="Young Indian Belle">👧🏽</span>
          <span style={{margin: '0 0.3em'}}></span>
          Banno 
        </h1>
        {/* <h2 className="subtitle">UP me Ka Ba? Asuran ke Chaat Ba!</h2>

        <div className="inspiration">
          With love from Dhanno  &amp; Banno उर्फ बसन्ती
        </div> */}

        <section>
          <h3>Dear Chatoras &amp; Chatorees,</h3>
          <p>
            Once upon a time, the beautiful and bold Banno could steer her tanga faster than you can say <b>“Golgappa!”</b> with her beloved mare Dhanno. Together, they escaped dacoits, dodged Gabbar Singh, and never missed a chance for a witty comeback—all while munching chaat!
          </p>
          <p>
            Basanti and her friend <strong>Tanno</strong>, Rahim Chacha’s daughter, would frequently sneak off to the village chaat shop to laugh their hearts out over extra tamarind chutney and gossip about Jai and Veeru. Meanwhile, Dhanno would recharge her Mare-Power by munching ek paseri Bhel-Puri with buckets of pani-masala. 
          </p>
          <p>
            Yes, dear chatoras and chatorees, life’s troubles might chase you like Gabbar and his bandits, but worry not! Just follow Banno’s advice: Pause, grab some spicy chaat, and laugh your troubles away!
          </p>
        </section>

        {/* --- Split Section Starts --- */}
        <div className="split-section">
          <div className="split-left">
            <section>
              <h3>Top Menu Choices:</h3>
              <ul>
                <li><strong>Pani Puri:</strong> Exploding with flavors faster than Dhanno gallops!</li>
                <li><strong>Aloo Tikki:</strong> Crispier than Jai and Veeru’s plans!</li>
                <li><strong>Samosas:</strong> Secrets more packed than Ramgarh’s jail!</li>
                <li><strong>Dahi Vada:</strong> Thakur’s bahu Radha's favorite.</li>
                <li><strong>Papdi Chaat, Bhel &amp; More:</strong> Served in Sholay ki holi!</li>
              </ul>
              <h4>(A little known secret: स्वर्गीय Kaliya and Sambha came in every week to eat in disguise!)</h4>
              <section>
                <h3 className="filmy-heading">Our Philosophy</h3>
                <ul className="filmy-list">
                  <li><strong>Eat Like Tanno:</strong> No intervals here—straight to spicy action!</li>
                  <li><strong>Laugh Like Banno:</strong> Gabbar-sized problems vanish with our chaat!</li>
                  <li><strong>Run Like Dhanno:</strong> Eat enough chaat, and you’ll outrun every trouble!</li>
                </ul>

              </section>
              {/* Mantra blockquote */}
              <div className="mantra-gap"></div>
              <blockquote className="mantra">
                “Duniya mein rehna hai toh <b>chaat khao pyaron!</b>”<br />
                <span>— धन्नो बन्नो की चोखी शोख़ी का राज</span>
              </blockquote>
                {/* No dacoits allowed line */}
              
              
                <div className="cta">
                Dhanno Banno Ki Rasoi – जे ना पाए ओके अभाग होई!
                <div className="no-dacoits">(P.S. No dakoos, except vegetarians like Sambha, are allowed. )</div>
                <div className="address">
                    Ramgarh Taal<br />
                    Gorakhpur.<br />
                    Ph: +91 8299123339
                </div>
                </div>
            </section>
          </div>
          <div className="split-right">
            <img
              src={Dhanno_Banno_poster}
              alt="Dhanno Banno Ki Rasoi Poster"
              className="poster-image"
            />
          </div>
        </div>
        {/* --- Split Section Ends --- */}
      </div>
    </div>
    </div>
  );
}
