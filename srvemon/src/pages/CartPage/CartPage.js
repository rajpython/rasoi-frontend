
// src/pages/CartPage.js

import React, { useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setCart, updateQuantity, removeItem,
  saveGuestCart, loadGuestCart
} from '../../slices/cartSlice';
import { useMenu } from '../../context/MenuContext';
import { useNavigate } from 'react-router-dom';
import OrderPlacementSection from '../../components/OrderPlacementSection';
import "./CartPage.css";
import BASE_URL from '../../apiConfig';

function CartPage() {
  const accessToken = localStorage.getItem("accessToken");
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const { menuItems } = useMenu();
  const navigate = useNavigate();

  // Load cart on mount
  useEffect(() => {
    async function fetchOrLoadCart() {
      if (accessToken) {
        try {
          const res = await fetch(`${BASE_URL}/restaurante/cart/menu-items`, {
            headers: { Authorization: `Bearer ${accessToken}`, }
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
  }, [dispatch, accessToken]);

  // Sync guest cart to localStorage
  useEffect(() => {
    if (!accessToken) {
      dispatch(saveGuestCart(cartItems));
    }
  }, [cartItems, accessToken, dispatch]);

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (!accessToken) {
      dispatch(updateQuantity({
        menuitem: item.menuitem,
        quantity: newQuantity,
      }));
      return;
    }
    try {
      await fetch(`${BASE_URL}/restaurante/cart/menu-items/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      });
      // Refresh cart from backend
      const res = await fetch(`${BASE_URL}/restaurante/cart/menu-items`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const data = await res.json();
      dispatch(setCart(data.results || data));
    } catch (err) {
      console.error("Error updating cart item:", err);
    }
  };

  const handleRemoveItem = async (item) => {
    if (!accessToken) {
      dispatch(removeItem({ menuitem: item.menuitem }));
      return;
    }
    try {
      await fetch(`${BASE_URL}/restaurante/cart/menu-items/${item.id}`, {
        method: "DELETE",
        headers: {
         Authorization: `Bearer ${accessToken}`
        }
      });
      // Refresh cart from backend
      const res = await fetch(`${BASE_URL}/restaurante/cart/menu-items`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const data = await res.json();
      dispatch(setCart(data.results || data));
    } catch (err) {
      console.error("Error removing cart item:", err);
    }
  };

  const getMenuItem = (menuitemId) =>
    menuItems.find(item => item.id === menuitemId) || {};

  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

  const handlePromptLogin = () => {
    navigate('/login');
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="cart-empty-message">Your cart is empty.</p>
      ) : (
        <>
          <div className="table-scroll">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Subtotal</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => {
                  const menuItem = getMenuItem(item.menuitem);
                  return (
                    <tr key={item.menuitem || item.id}>
                      <td className="item-title">{menuItem.title || item.title}</td>
                      <td>
                        <div className="quantity-controls">
                          <button
                            className="quantity-btn"
                            onClick={() => handleUpdateQuantity(item, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >−</button>
                          <input
                            className="quantity-input"
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={e =>
                              handleUpdateQuantity(item, Math.max(1, parseInt(e.target.value) || 1))
                            }
                          />
                          <button
                            className="quantity-btn"
                            onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                          >+</button>
                        </div>
                      </td>
                      <td>₹{Number(item.unit_price).toFixed(2)}</td>
                      <td>₹{Number(item.price).toFixed(2)}</td>
                      <td>
                        <button className="remove-btn" onClick={() => handleRemoveItem(item)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="cart-totals">
            <div className="total-row">Total: ₹{total.toFixed(2)}</div>
          </div>
        </>
      )}

      {accessToken && cartItems.length > 0 && (
        <OrderPlacementSection
          total={total}
          onOrderPlaced={(orderData) => navigate("/order-confirmation", { state: orderData })}
        />
      )}
      {!accessToken && cartItems.length > 0 && (
        <button className="remove-btn" onClick={handlePromptLogin}>
          Login or Register to Place Your Order
        </button>
      )}
    </div>
  );
}

export default CartPage;
