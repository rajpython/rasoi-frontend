


// // src/components/ChaatGPTWidget.js
// import React, { useState, useRef, useEffect } from "react";
// import chaatGPTLogo from "../../assets/chaatGPT-logo.png";
// import { fetchWithAuth } from "../../api/authApi";
// import "./ChaatGPTWidget.css";
// import Draggable from "react-draggable";
// import { useNavigate } from "react-router-dom";


// const ChaatGPTWidget = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isFullScreen, setIsFullScreen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   useEffect(() => {
//     const saved = localStorage.getItem("chatMessages");
//     if (saved) {
//       try {
//         setMessages(JSON.parse(saved));
//       } catch (e) {
//         console.error("Failed to parse saved chat:", e);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("chatMessages", JSON.stringify(messages));
//   }, [messages]);
  
//   const [isMobile, setIsMobile] = useState(false);
//   const messagesEndRef = useRef(null);
//   const navigate = useNavigate();


//   useEffect(() => {
//     if (window.innerWidth <= 600) setIsMobile(true);
//   }, []);

//   useEffect(() => {
//     const handleStorageChange = () => {
//       if (!localStorage.getItem("accessToken")) {
//         console.log("Access token missing — clearing chatbot");
//         setMessages([]);
//       }
//     };
//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

  
//   useEffect(() => {
//     const listener = (e) => {
//       console.log("📩 Widget received postMessage:", e.data);
  
//       // ✅ Handle iframe close command FIRST (even if string)
//       if (e.data === "CLOSE_IFRAME") {
//         console.log("🧹 Closing iframe");
//         setMessages((prev) => prev.filter((msg) => msg.type !== "iframe"));
//         return;
//       }
  
//       // 🛡️ Skip if message isn't an object (Stripe etc.)
//       if (!e.data || typeof e.data !== "object") return;
//       // ✅ Handle navigation from iframe → main app
//       if (e.data.type === "NAVIGATE" && typeof e.data.path === "string") {
//         console.log("🌐 Navigating to:", e.data.path);
//         window.location.href = e.data.path;  // or use `navigate()` if inside a Router context
//         return;
//       }
//       // ✅ Handle order confirmation
//       if (e.data?.type === "ORDER_CONFIRMED") {
//         const order = e.data.order;
//         console.log("🧾 Widget received confirmed order:", order);
  
//         const formatted = `
//           <div>
//             <h3>✅ Thank you for your order!</h3>
//             <p><strong>Order #:</strong> ${order?.id ?? "N/A"}</p>
//             <p><strong>Total Paid:</strong> ₹${order?.total ? Number(order.total).toFixed(2) : "N/A"}</p>
//             <p><strong>Type:</strong> ${order?.delivery_type ?? "N/A"}</p>
//             ${
//               order?.delivery_type === "delivery"
//                 ? `<p><strong>Address:</strong> ${order.delivery_address}, ${order.delivery_city}, ${order.delivery_pin}</p>`
//                 : ""
//             }
//             <p><strong>Time:</strong> ${
//               order?.delivery_time_slot ?? "N/A"
//             } on ${order?.date ? new Date(order.date).toLocaleDateString() : "N/A"}</p>
//             <p>A confirmation email has been sent to your registered address.</p>
//           </div>
//         `;
  
//         setMessages((prev) => [
//           ...prev.filter((msg) => msg.type !== "iframe"),
//           { role: "bot", content: formatted }
//         ]);
//       }
//       if (e.data?.type === "ORDER_CANCELLED") {
//         console.log("❌ Widget received cancelled order message:", e.data.message);
      
//         const cancellationMessage = `
//           <div>
//             <h3>❌ Your order has been cancelled.</h3>
//             <p>${e.data.message || "The order was cancelled successfully."}</p>
//           </div>
//         `;
      
//         const followUpMessage = `
//           <div>
//             🧾 Would you like to <strong>start a new order</strong> or ask something else?
//           </div>
//         `;
      
//         setMessages((prev) => [
//           ...prev.filter((msg) => msg.type !== "iframe"),
//           { role: "bot", content: cancellationMessage },
//           { role: "bot", content: followUpMessage },
//         ]);
//       }
      
//     };
  
//     window.addEventListener("message", listener);
//     return () => window.removeEventListener("message", listener);
//   }, []);
  
  

//   // const handleClear = () => {
//   //   setMessages([]);
//   // };
//   // RESETTING CHAT FROM THE FRONT END
// // ///////////////////
// const resetChatOnServer = async () => {
//   const url = `${process.env.REACT_APP_API_BASE_URL || "https://api.dhannobannokirasoi.com"}/restaurante/api/chaatreset/`;
//   try {
//     await fetchWithAuth(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" }, // fetchWithAuth should also attach X-Guest-Id if you use it
//       credentials: "include",
//       body: JSON.stringify({}),
//     });
//   } catch (e) {
//     console.error("Reset endpoint failed:", e);
//   }
// };

// const handleClear = async () => {
//   // instant UI clear (also removes iframe)
//   setMessages((prev) => prev.filter((m) => m.type !== "iframe").slice(0, 0));
//   await resetChatOnServer();
//   setMessages([{ role: "bot", content: "🧹 Chat reset. How can I help now?" }]);
// };
// // ///////////////


//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage = { role: "user", content: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");

//     try {
//       const res = await fetchWithAuth(
//         `${process.env.REACT_APP_API_BASE_URL || "https://api.dhannobannokirasoi.com"}/restaurante/api/chaatbaat/`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ message: input }),
//           credentials: "include"
//         }
//       );

//       const reader = res.body.getReader();
//       const decoder = new TextDecoder("utf-8");
//       let chunkText = "";
//       let botMessage = "";

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;
//         chunkText = decoder.decode(value, { stream: true });
//         console.log("STREAM CHUNK RECEIVED:", chunkText);
//         botMessage += chunkText;

//         const iframeMatch = botMessage.match(/__IFRAME_URL__:(.*?)__/);
//         if (iframeMatch) {
//           const iframeUrl = iframeMatch[1];
//           setMessages((prev) => [
//             ...prev,
//             { role: "bot", type: "iframe", content: iframeUrl }
//           ]);
//           return;
//         }

//         setMessages((prev) => {
//           const last = prev[prev.length - 1];
//           if (last && last.role === "bot" && last.type !== "iframe") {
//             return [...prev.slice(0, -1), { ...last, content: botMessage }];
//           }
//           return [...prev, { role: "bot", content: botMessage }];
//         });
//       }
//     } catch (err) {
//       setMessages((prev) => [
//         ...prev,
//         { role: "bot", content: "❌ Error contacting चाटGPT." }
//       ]);
//     }
//   };

//   const ChatWindow = (
//     <div className={`chaatgpt-chat-window ${isFullScreen ? "full-screen" : ""}`}>
//       <div className="chat-header">
//         <span>चाटGPT</span>
//         <div className="controls">
//           <button onClick={handleClear}>🗑</button>
//           <button onClick={() => setIsFullScreen(!isFullScreen)}>⛶</button>
//           <button onClick={() => setIsOpen(false)}>✕</button>
//         </div>
//       </div>

//       <div className="chat-messages">
//       {messages.map((msg, idx) => {
//         if (msg.role === "bot" && msg.type === "iframe") {
//           return (
//             <div key={idx} className="message bot">
//               <iframe
//                 src={msg.content}
//                 title="Order Confirmation"
//                 style={{
//                   width: "100%",
//                   height: "460px",
//                   border: "1px solid #ccc",
//                   borderRadius: "8px"
//                 }}
//               />
//             </div>
//           );
//         }

//         if (msg.role === "bot") {
//           return (
//             <div
//               key={idx}
//               className="message bot"
//               dangerouslySetInnerHTML={{ __html: msg.content }}
//             />
//           );
//         }

//         return (
//           <div key={idx} className={`message ${msg.role}`}>
//             {msg.content}
//           </div>
//         );
//       })}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="chat-input">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//           placeholder="Ask me about chaat, your orders, or more!"
//         />
//         <button onClick={handleSend}>Send</button>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {!isOpen && (
//         <div className="chaatgpt-floating-button" onClick={() => setIsOpen(true)}>
//           <img src={chaatGPTLogo} alt="चाटGPT" />
//         </div>
//       )}
//       {isOpen &&
//         (isMobile ? ChatWindow : (
//           <Draggable cancel=".chat-messages, input, textarea, button">
//             {ChatWindow}
//           </Draggable>
//         ))}
//     </>
//   );
// };

// export default ChaatGPTWidget;

// THE VERSION BELOW REPLACED THE PREVIOUS ONE TO MAKE SURE THAT THE CHAT WIDGET RETAINS THE MESSAGES
// WHEN THE USER IS DIRECTED TO THE LOGIN PAGE

// src/components/ChaatGPTWidget.js
import React, { useState, useRef, useEffect } from "react";
import chaatGPTLogo from "../../assets/chaatGPT-logo.png";
import { fetchWithAuth } from "../../api/authApi";
import "./ChaatGPTWidget.css";
import Draggable from "react-draggable";
import { useNavigate } from "react-router-dom";

const ChaatGPTWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null); // ⬅️ container for event delegation
  const navigate = useNavigate();

  // Rehydrate messages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("chatMessages");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved chat:", e);
      }
    }
  }, []);

  // Persist messages to localStorage on change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (window.innerWidth <= 600) setIsMobile(true);
  }, []);


    // Reset chat on server and locally
  const resetChatOnServer = async () => {
    const url = `${
      process.env.REACT_APP_API_BASE_URL || "https://api.dhannobannokirasoi.com"
    }/restaurante/api/chaatreset/`;
    try {
      await fetchWithAuth(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });
    } catch (e) {
      console.error("Reset endpoint failed:", e);
    }
  };


  // 🔄 Remove storage-based auto-clear to avoid wiping the chat on auth changes across tabs
  // If you intentionally want to clear on logout, emit a custom event from your auth code and listen to it here.

  useEffect(() => {
    const handleLogout = async () => {
      // 1) Clear UI immediately (also removes any iframe message)
      setMessages((prev) => prev.filter((m) => m.type !== "iframe").slice(0, 0));
      // or simply: setMessages([]);
  
      // 2) Clear the persisted copy so refresh won’t restore it
      localStorage.removeItem("chatMessages");
  
      // 3) Ask backend to clear any server-side/chat cache
      try {
        await resetChatOnServer(); // your existing function (wrap in useCallback for stable deps)
      } catch (e) {
        console.error("Reset on logout failed:", e);
      }
  
      // 4) Friendly confirmation
      setMessages([{ role: "bot", content: "🔒 You’ve been logged out. Chat cleared." }]);
    };
  
    // Same-tab listener: fires when this tab dispatches `app:logout`
    const onAppLogout = () => handleLogout();
    window.addEventListener("app:logout", onAppLogout);
  
    // Cross-tab/window listener: fires in *other* tabs when localStorage changes
    const onStorage = (e) => {
      // Only react to our broadcast key
      if (e.key === "__auth_event__" && e.newValue) {
        try {
          const payload = JSON.parse(e.newValue);
          if (payload?.type === "logout") {
            handleLogout();
          }
        } catch {
          // ignore malformed payloads
        }
      }
    };
    window.addEventListener("storage", onStorage);
  
    // Cleanup on unmount or dep change
    return () => {
      window.removeEventListener("app:logout", onAppLogout);
      window.removeEventListener("storage", onStorage);
    };
  }, [resetChatOnServer]); // setMessages not needed; resetChatOnServer should be useCallback([]) for stability
  

  // Listen to postMessage events from iframes and other parts of the app
  useEffect(() => {
    const listener = (e) => {
      console.log("📩 Widget received postMessage:", e.data);

      // Handle iframe close command (even if string)
      if (e.data === "CLOSE_IFRAME") {
        console.log("🧹 Closing iframe");
        setMessages((prev) => prev.filter((msg) => msg.type !== "iframe"));
        return;
      }

      // Skip if message isn't an object (Stripe, etc.)
      if (!e.data || typeof e.data !== "object") return;

      // ✅ SPA navigation: use React Router navigate (no page reload)
      if (e.data.type === "NAVIGATE" && typeof e.data.path === "string") {
        console.log("🌐 Navigating to:", e.data.path);
        navigate(e.data.path);
        return;
      }

      // ✅ Handle order confirmation
      if (e.data?.type === "ORDER_CONFIRMED") {
        const order = e.data.order;
        console.log("🧾 Widget received confirmed order:", order);

        const formatted = `
          <div>
            <h3>✅ Thank you for your order!</h3>
            <p><strong>Order #:</strong> ${order?.id ?? "N/A"}</p>
            <p><strong>Total Paid:</strong> ₹${order?.total ? Number(order.total).toFixed(2) : "N/A"}</p>
            <p><strong>Type:</strong> ${order?.delivery_type ?? "N/A"}</p>
            ${
              order?.delivery_type === "delivery"
                ? `<p><strong>Address:</strong> ${order.delivery_address}, ${order.delivery_city}, ${order.delivery_pin}</p>`
                : ""
            }
            <p><strong>Time:</strong> ${
              order?.delivery_time_slot ?? "N/A"
            } on ${order?.date ? new Date(order.date).toLocaleDateString() : "N/A"}</p>
            <p>A confirmation email has been sent to your registered address.</p>
          </div>
        `;

        setMessages((prev) => [
          ...prev.filter((msg) => msg.type !== "iframe"),
          { role: "bot", content: formatted }
        ]);
        return;
      }

      // ✅ Handle order cancellation
      if (e.data?.type === "ORDER_CANCELLED") {
        console.log("❌ Widget received cancelled order message:", e.data.message);

        const cancellationMessage = `
          <div>
            <h3>❌ Your order has been cancelled.</h3>
            <p>${e.data.message || "The order was cancelled successfully."}</p>
          </div>
        `;

        const followUpMessage = `
          <div>
            🧾 Would you like to <strong>start a new order</strong> or ask something else?
          </div>
        `;

        setMessages((prev) => [
          ...prev.filter((msg) => msg.type !== "iframe"),
          { role: "bot", content: cancellationMessage },
          { role: "bot", content: followUpMessage },
        ]);
        return;
      }
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [navigate]);

  // 🧭 Intercept clicks on bot-rendered <a> links marked data-spa="true" and do SPA navigation
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;

    const onClick = (e) => {
      const a = e.target.closest("a");
      if (!a) return;

      // Only intercept our SPA links (from backend): <a href="/login" data-spa="true">login</a>
      if (a.dataset && a.dataset.spa === "true") {
        e.preventDefault();
        const href = a.getAttribute("href") || "/";
        navigate(href);
      }
    };

    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [navigate]);


  const handleClear = async () => {
    // instant UI clear (also removes iframe)
    setMessages((prev) => prev.filter((m) => m.type !== "iframe").slice(0, 0));
    await resetChatOnServer();
    setMessages([{ role: "bot", content: "🧹 Chat reset. How can I help now?" }]);
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetchWithAuth(
        `${
          process.env.REACT_APP_API_BASE_URL || "https://api.dhannobannokirasoi.com"
        }/restaurante/api/chaatbaat/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
          credentials: "include",
        }
      );

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let chunkText = "";
      let botMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunkText = decoder.decode(value, { stream: true });
        console.log("STREAM CHUNK RECEIVED:", chunkText);
        botMessage += chunkText;

        // IFrame injection marker
        const iframeMatch = botMessage.match(/__IFRAME_URL__:(.*?)__/);
        if (iframeMatch) {
          const iframeUrl = iframeMatch[1];
          setMessages((prev) => [
            ...prev,
            { role: "bot", type: "iframe", content: iframeUrl },
          ]);
          return;
        }

        // Streaming text update
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.role === "bot" && last.type !== "iframe") {
            return [...prev.slice(0, -1), { ...last, content: botMessage }];
          }
          return [...prev, { role: "bot", content: botMessage }];
        });
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "❌ Error contacting चाटGPT." },
      ]);
    }
  };

  const ChatWindow = (
    <div className={`chaatgpt-chat-window ${isFullScreen ? "full-screen" : ""}`}>
      <div className="chat-header">
        <span>चाटGPT</span>
        <div className="controls">
          <button onClick={handleClear}>🗑</button>
          <button onClick={() => setIsFullScreen(!isFullScreen)}>⛶</button>
          <button onClick={() => setIsOpen(false)}>✕</button>
        </div>
      </div>

      <div className="chat-messages" ref={messagesContainerRef}>
        {messages.map((msg, idx) => {
          if (msg.role === "bot" && msg.type === "iframe") {
            return (
              <div key={idx} className="message bot">
                <iframe
                  src={msg.content}
                  title="Order Confirmation"
                  style={{
                    width: "100%",
                    height: "460px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                />
              </div>
            );
          }

          if (msg.role === "bot") {
            return (
              <div
                key={idx}
                className="message bot"
                dangerouslySetInnerHTML={{ __html: msg.content }}
              />
            );
          }

          return (
            <div key={idx} className={`message ${msg.role}`}>
              {msg.content}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask me about chaat, your orders, or more!"
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );

  return (
    <>
      {!isOpen && (
        <div className="chaatgpt-floating-button" onClick={() => setIsOpen(true)}>
          <img src={chaatGPTLogo} alt="चाटGPT" />
        </div>
      )}
      {isOpen &&
        (isMobile ? (
          ChatWindow
        ) : (
          <Draggable cancel=".chat-messages, input, textarea, button">
            {ChatWindow}
          </Draggable>
        ))}
    </>
  );
};

export default ChaatGPTWidget;
