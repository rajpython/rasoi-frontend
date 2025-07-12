

import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../api/authApi";
import BASE_URL from "../../apiConfig";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/dateUtils";
import "./ReservationHistory.css";

function ReservationHistory() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();



  useEffect(() => {
    async function fetchAllReservations(url = `${BASE_URL}/restaurante/booking/`, accum = []) {
      try {
        const res = await fetchWithAuth(url);
        const data = await res.json();
        const combined = accum.concat(data.results || data);
  
        if (data.next) {
          return fetchAllReservations(data.next, combined);
        }
        return combined;
      } catch {
        return accum;
      }
    }
  
    setLoading(true);
    fetchAllReservations()
      .then(all => setReservations(all))
      .finally(() => setLoading(false));
  }, []);
  

  const handleManage = (ref) => {
    navigate(`/manage-reservation/${ref}`);
  };

  /// Split into upcoming vs past using forced local interpretation
  const upcoming = [];
  const past = [];

  reservations.forEach(res => {
    const [hours, minutes] = res.reservation_time.split(":").map(Number);
    const [year, month, day] = res.reservation_date.split("-").map(Number);
    const resDateTime = new Date(year, month - 1, day, hours, minutes);

    const now = new Date();

    if (resDateTime.getTime() > now.getTime()) {
      upcoming.push(res);
    } else {
      past.push(res);
    }
  });


  if (loading) return <div>Loading your reservations...</div>;
  if (!reservations.length) return <div>No reservations found.</div>;

  return (
    <div className="reservation-history" style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.2rem" }}>Your Reservations</h2>

      {upcoming.length > 0 && (
        <>
          <h3>Upcoming Reservations</h3>
          <table className="reservation-table">
            <thead>
              <tr>
                <th>Date</th><th>Time</th><th>Guests</th><th>Occasion</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map(res => (
                <tr key={res.id}>
                  <td>{formatDate(res.reservation_date)}</td>
                  <td>{res.reservation_time}</td>
                  <td>{res.no_of_guests}</td>
                  <td>{res.occasion}</td>
                  <td>
                    <button onClick={() => handleManage(res.reference_number)}>
                      Change / Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {past.length > 0 && (
        <>
          <h3 style={{ marginTop: "2rem" }}>Past Reservations</h3>
          <table className="reservation-table">
            <thead>
              <tr>
                <th>Date</th><th>Time</th><th>Guests</th><th>Occasion</th>
              </tr>
            </thead>
            <tbody>
              {past.map(res => (
                <tr key={res.id}>
                  <td>{formatDate(res.reservation_date)}</td>
                  <td>{res.reservation_time}</td>
                  <td>{res.no_of_guests}</td>
                  <td>{res.occasion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default ReservationHistory;

