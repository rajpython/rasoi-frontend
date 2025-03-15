import React from 'react';

// export default Main;
import greekSalad from './assets/greek-salad.jpg';
import lemonDessert from './assets/lemon dessert.jpg';
import bruschetta from './assets/bruchetta.svg';
import restaurantFood from './assets/restauranfood.jpg';

function Main() {
    return (
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-text">
            <h1>Rasoi</h1>
            <h2>Ames</h2>
            <p>
              We are a family owned Indian restaurant, focused on 
              traditional recipes served with a modern twist.
            </p>
            <button>Reserve a Table</button>
          </div>
          <img
            src={restaurantFood}
            alt="Delicious Indian food"
            className="hero-image"
          />
        </section>
  
        {/* Order Online Button Positioned between Hero and Specials */}
        <div className="order-online-container">
          <button className="order-online">Order Online</button>
        </div>
  
        {/* Specials Section */}
        <section className="specials">
          <h2>This Week's Specials</h2>
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
      </main>
    );
  }
  
export default Main;
  


