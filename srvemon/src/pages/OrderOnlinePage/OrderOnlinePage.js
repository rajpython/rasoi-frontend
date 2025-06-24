// src/pages/OrderOnlinePage.js

import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCart, addItem, saveGuestCart, loadGuestCart } from '../../slices/cartSlice';
import { AuthContext } from '../../context/AuthContext';
import { useMenu } from "../../context/MenuContext";
import "./OrderOnlinePage.css"
import { CATEGORY_ID_TO_NAME, CATEGORY_ORDER } from '../MenuPage/MenuPage';
import BASE_URL from '../../apiConfig';


function OrderOnlinePage() {
  const { menuItems, loading } = useMenu();
  const [quantities, setQuantities] = useState({});
  const dispatch = useDispatch();
  const { token } = useContext(AuthContext);
  const cartItems = useSelector(state => state.cart.items);

  // Load cart on mount
  useEffect(() => {
    async function fetchOrLoadCart() {
      if (token) {
        try {
          const res = await fetch(`${BASE_URL}/restaurante/cart/menu-items`, {
            headers: { Authorization: `Token ${token}` },
          });
          const data = await res.json();
          dispatch(setCart(data.results || data));
        } catch (err) {
          console.error("Error fetching cart:", err);
        }
      } else {
        dispatch(loadGuestCart());
      }
    }
    fetchOrLoadCart();
  }, [dispatch, token]);

  useEffect(() => {
    if (!token) {
      dispatch(saveGuestCart(cartItems));
    }
  }, [cartItems, token, dispatch]);

  const handleQuantityChange = (id, value) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, parseInt(value) || 1)
    }));
  };

  const handleAddToCart = async (item) => {
    const quantity = quantities[item.id] || 1;

    if (!token) {
      dispatch(addItem({
        menuitem: item.id,
        title: item.title,
        unit_price: parseFloat(item.price),
        quantity,
        price: parseFloat(item.price) * quantity,
      }));
      return;
    }

    try {
      await fetch(`${BASE_URL}/restaurante/cart/menu-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`
        },
        body: JSON.stringify({
          menuitem: item.id,
          quantity
        })
      });
      const res = await fetch(`${BASE_URL}/restaurante/cart/menu-items`, {
        headers: { Authorization: `Token ${token}` }
      });
      const data = await res.json();
      dispatch(setCart(data.results || data));
    } catch (err) {
      console.error("Failed to sync cart to backend", err);
    }
  };

  if (loading) return <p>Loading menu...</p>;

  // Group by category name
  const groupedItems = {};
  menuItems.forEach(item => {
    const catName = CATEGORY_ID_TO_NAME[item.category] || "Other";
    if (!groupedItems[catName]) groupedItems[catName] = [];
    groupedItems[catName].push(item);
  });

  return (
    <div className="order-page">
      <h2>Order Online</h2>
      <p className="scroll-note">Scroll inside each card to view details, select quantity and order.</p>
      {CATEGORY_ORDER.map(category => (
        groupedItems[category] ? (
          <section key={category} className="menu-category-section">
            <h3 className="menu-category-title">{category}</h3>
            <div className="menu-grid">
              {groupedItems[category].map(item => (
                <div key={item.id} className="menu-card">
                  {item.image && (
                    <img src={item.image} alt={item.title} className="menu-card-image" />
                  )}
                  <div className="menu-card-content">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                    <p><strong>₹{item.price}</strong></p>
                    <label>
                      Quantity:
                      <input
                        type="number"
                        min="1"
                        value={quantities[item.id] || 1}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      />
                    </label>
                    <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null
      ))}
    </div>
  );
}

export default OrderOnlinePage;
