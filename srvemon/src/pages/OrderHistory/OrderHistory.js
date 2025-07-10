// import React, { useEffect, useState } from "react";
// import { fetchWithAuth } from "../../api/authApi";
// import BASE_URL from "../../apiConfig";
// import { formatDate } from "../../utils/dateUtils";
// import "./OrderHistory.css";

// function OrderHistory() {
//   const [orders, setOrders] = useState([]);
//   const [expandedOrderId, setExpandedOrderId] = useState(null);
//   const [loading, setLoading] = useState(true);


// useEffect(() => {
//     async function fetchAllOrders(url = `${BASE_URL}/restaurante/orders`, accum = []) {
//       try {
//         const res = await fetchWithAuth(url);
//         const data = await res.json();
//         const combined = accum.concat(data.results || data);
  
//         if (data.next) {
//           return fetchAllOrders(data.next, combined);
//         }
//         return combined;
//       } catch {
//         return accum;
//       }
//     }
  
//     setLoading(true);
//     fetchAllOrders()
//       .then(all => setOrders(all))
//       .finally(() => setLoading(false));
//   }, []);
  

//   const toggleExpand = (orderId) => {
//     setExpandedOrderId(prev => prev === orderId ? null : orderId);
//   };

//   if (loading) return <div>Loading your orders...</div>;
//   if (!orders.length) return <div>No orders found.</div>;

//   return (
//     <div className="order-history" style={{ maxWidth: "900px", margin: "0 auto", paddingTop: "130px" }}>
//       <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Your Orders</h2>

//       <table className="order-table">
//         <thead>
//           <tr>
//             <th>Date</th><th>Delivery</th><th>Time Slot</th><th>Delivery Crew</th><th>Status</th><th>Total</th><th>Details</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map(order => (
//             <React.Fragment key={order.id}>
//               <tr>
//                 <td>{formatDate(order.date)}</td>
//                 <td>{order.delivery_type}</td>
//                 <td>{order.delivery_time_slot}</td>
//                 <td>{order.delivery_crew ? order.delivery_crew.username : "Unassigned"}</td>
//                 <td>{order.status ? "Completed" : "Pending"}</td>
//                 <td>₹{Number(order.total).toFixed(2)}</td>
//                 <td>
//                   <button onClick={() => toggleExpand(order.id)}>
//                     {expandedOrderId === order.id ? "Hide" : "View"}
//                   </button>
//                 </td>
//               </tr>

//               {expandedOrderId === order.id && (
//                 <tr>
//                     <td colSpan="7">
//                     <table className="order-items-table" style={{ width: "90%", margin: "0.5rem auto", borderCollapse: "collapse" }}>
//                         <thead>
//                         <tr style={{ borderBottom: "1px solid #ddd" }}>
//                             <th style={{ textAlign: "center", padding: "0.5rem" }}>Item</th>
//                             <th style={{ textAlign: "center", padding: "0.5rem" }}>Quantity</th>
//                             <th style={{ textAlign: "right", padding: "0.5rem" }}>Price (₹)</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         {order.orderitem.map((item, idx) => (
//                             <tr key={idx}>
//                             <td style={{ padding: "0.5rem" }}>{item.menuitem.title}</td>
//                             <td style={{ textAlign: "center", padding: "0.5rem" }}>{item.quantity}</td>
//                             <td style={{ textAlign: "right", padding: "0.5rem" }}>{Number(item.price).toFixed(2)}</td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </table>
//                     </td>
//                 </tr>
//                 )}

//             </React.Fragment>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default OrderHistory;


import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../api/authApi";
import BASE_URL from "../../apiConfig";
import { formatDate } from "../../utils/dateUtils";
import "./OrderHistory.css";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllOrders(url = `${BASE_URL}/restaurante/orders`, accum = []) {
      try {
        const res = await fetchWithAuth(url);
        const data = await res.json();
        const combined = accum.concat(data.results || data);

        if (data.next) {
          return fetchAllOrders(data.next, combined);
        }
        return combined;
      } catch {
        return accum;
      }
    }

    setLoading(true);
    fetchAllOrders()
      .then(all => setOrders(all))
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrderId(prev => prev === orderId ? null : orderId);
  };

  if (loading) return <div>Loading your orders...</div>;
  if (!orders.length) return <div>No orders found.</div>;

  return (
    <div className="order-history" style={{ maxWidth: "900px", margin: "0 auto", paddingTop: "130px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Your Orders</h2>

      <table className="order-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Delivery</th>
            <th>Time Slot</th>
            <th>Delivery By</th>
            <th>Delivered ?</th>
            <th>Payment</th>
            <th>Total</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <React.Fragment key={order.id}>
              <tr>
                <td>{formatDate(order.date)}</td>
                <td>{order.delivery_type}</td>
                <td>{order.delivery_time_slot}</td>
                <td>
                  {order.delivery_type === "pickup"
                    ? "Pick Up"
                    : (order.delivery_crew ? order.delivery_crew.username : "Sumit Verma")}
                </td>
                {/* td>{order.delivery_crew ? order.delivery_crew.username : "Sumit Verma"}</td> */}
                <td>{order.status ? "Yes" : "No"}</td>
                <td>{order.payment_status === "paid" ? "Paid" : "Pending"}</td>
                <td>₹{Number(order.total).toFixed(2)}</td>
                <td>
                  <button onClick={() => toggleExpand(order.id)}>
                    {expandedOrderId === order.id ? "Hide" : "View"}
                  </button>
                </td>
              </tr>

              {expandedOrderId === order.id && (
                <tr>
                  <td colSpan="8">
                    <table className="order-items-table" style={{ width: "90%", margin: "0.5rem auto", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <th style={{ textAlign: "center", padding: "0.5rem" }}>Item</th>
                          <th style={{ textAlign: "center", padding: "0.5rem" }}>Quantity</th>
                          <th style={{ textAlign: "right", padding: "0.5rem" }}>Price (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.orderitem.map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ padding: "0.5rem" }}>{item.menuitem.title}</td>
                            <td style={{ textAlign: "center", padding: "0.5rem" }}>{item.quantity}</td>
                            <td style={{ textAlign: "right", padding: "0.5rem" }}>{Number(item.price).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderHistory;
