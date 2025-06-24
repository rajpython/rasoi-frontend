// src/components/CartIndicator.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./CartIndicator.css";
import { FaShoppingCart } from "react-icons/fa";
function CartIndicator() {
  const items = useSelector((state) => state.cart.items);
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (totalQty > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 500); // reset after animation
      return () => clearTimeout(timer);
    }
  }, [totalQty]);

  return (
    <Link to="/cart" className="cart-indicator" title="View Cart">
      {/* <span className={`cart-icon ${animate ? "bounce" : ""}`}>🛒</span> */}
      <FaShoppingCart className={`cart-icon ${animate ? "bounce" : ""}`} />
      {totalQty > 0 && <span className="cart-count">{totalQty}</span>}
    </Link>
  );
}

export default CartIndicator;
