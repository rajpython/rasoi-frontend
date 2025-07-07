// src/slices/cartSlice.js

import { createSlice } from '@reduxjs/toolkit';
import BASE_URL from '../apiConfig';

// Utilities for localStorage
const CART_KEY = 'guest_cart';

function saveCartToStorage(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {}
}

function loadCartFromStorage() {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) { return []; }
}

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action) {
      state.items = action.payload;
    },
    addItem(state, action) {
      // For guests, menuitem is the unique key; for backend, id is key.
      const isBackend = !!action.payload.id;
      let found;
      if (isBackend) {
        found = state.items.find(item => item.id === action.payload.id);
      } else {
        found = state.items.find(item => item.menuitem === action.payload.menuitem);
      }
      if (found) {
        found.quantity = action.payload.quantity;
        found.unit_price = action.payload.unit_price;
        found.price = action.payload.price;
      } else {
        state.items.push(action.payload);
      }
    },
    updateQuantity(state, action) {
      let item = state.items.find(i =>
        action.payload.id ? i.id === action.payload.id : i.menuitem === action.payload.menuitem
      );
      if (item) {
        item.quantity = action.payload.quantity;
        item.price = item.unit_price * action.payload.quantity;
      }
    },
    removeItem(state, action) {
      state.items = state.items.filter(item =>
        action.payload.id ? item.id !== action.payload.id : item.menuitem !== action.payload.menuitem
      );
    },
    clearCart(state) {
      state.items = [];
    },
    mergeCart(state, action) {
      state.items = action.payload;
    }
  },
});

export const {
  setCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  mergeCart
} = cartSlice.actions;

export default cartSlice.reducer;

// Thunks for localStorage usage
export const saveGuestCart = (cart) => dispatch => {
  saveCartToStorage(cart);
};

export const loadGuestCart = () => dispatch => {
  const guestItems = loadCartFromStorage();
  dispatch(setCart(guestItems));
};

// Thunk: Merge guest cart with backend after login
export const mergeGuestCartWithBackend = (token) => async (dispatch, getState) => {
  const state = getState();
  const guestCartItems = state.cart.items;

  if (!token || !guestCartItems.length) return;

  // For each guest cart item, POST to backend
  for (let item of guestCartItems) {
    try {
      await fetch(`${BASE_URL}/restaurante/cart/menu-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          menuitem: item.menuitem,
          quantity: item.quantity,
        }),
      });
    } catch (err) {
      console.error("Error merging guest cart:", err);
    }
  }

  // After merge, fetch backend cart and update Redux
  try {
    const res = await fetch(`${BASE_URL}/restaurante/cart/menu-items`, {
      headers: { Authorization: `Token ${token}` }
    });
    const data = await res.json();
    dispatch(setCart(data.results || data));
    // Clear guest cart from localStorage
    localStorage.removeItem('guest_cart');
  } catch (err) {
    console.error("Error refreshing backend cart:", err);
  }
};
