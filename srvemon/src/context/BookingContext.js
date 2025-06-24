// src/context/BookingContext.js
import { createContext, useContext, useState } from "react";

export const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export function BookingProvider({ children }) {
  const [reservationData, setReservationData] = useState(null);
  return (
    <BookingContext.Provider value={{ reservationData, setReservationData }}>
      {children}
    </BookingContext.Provider>
  );
}
