

import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage/BookingPage";
import MenuPage from "./pages/MenuPage/MenuPage";
import Login from "./pages/Login/Login";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import ResetPasswordConfirm from "./pages/ResetPassword/ResetPasswordConfirm";
import Register from "./pages/Register/Register";
import ConfirmedBooking from "./pages/ConfirmedBooking/ConfirmedBooking";
import OrderOnlinePage from "./pages/OrderOnlinePage/OrderOnlinePage";
import CartPage from './pages/CartPage/CartPage';
import ProfilePage from "./pages/ProfilePage";
import ManageReservationPage from "./pages/ManageReservationPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import AboutPage from "./pages/AboutPage/AboutPage";
import Layout from "./components/Layout/Layout";
import "./App.css"






function Main() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/reservations" element={<BookingPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/order-online" element={<OrderOnlinePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPasswordConfirm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/confirmation" element={<ConfirmedBooking />} />
        <Route path="/manage-reservation/:ref" element={<ManageReservationPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
      </Routes>
    </Layout>
  );
}

export default Main;

