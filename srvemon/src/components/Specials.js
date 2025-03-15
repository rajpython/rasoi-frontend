// src/components/Specials.js
import React from 'react';
import greekSalad from '../assets/greek-salad.jpg';
import bruschetta from '../assets/bruchetta.svg';
import lemonDessert from '../assets/lemon dessert.jpg';

function Specials() {
  return (
    <section className="specials">
      <h2><em>This Week's Specials!</em></h2>
      <div className="specials-container">
        <article className="special-item">
          <img src={greekSalad} alt="Greek Salad" />
          <h3>Greek Salad</h3>
          <p>$12.99</p>
          <p>
            The famous Greek salad with crispy lettuce, peppers, olives, and feta cheese.
          </p>
        </article>

        <article className="special-item">
          <img src={bruschetta} alt="Bruschetta" />
          <h3>Bruschetta</h3>
          <p>$5.99</p>
          <p>
            Toasted bread topped with garlic, tomatoes, olive oil, and balsamic.
          </p>
        </article>

        <article className="special-item">
          <img src={lemonDessert} alt="Lemon Dessert" />
          <h3>Lemon Dessert</h3>
          <p>$5.00</p>
          <p>
            A zesty and creamy lemon dessert that’s authentically homemade.
          </p>
        </article>
      </div>
    </section>
  );
}

export default Specials;
