


// src/components/ChaatGPTWidget.js
import React, { useState, useRef, useEffect } from "react";
import chaatGPTLogo from "../../assets/chaatGPT-logo.png";
import { fetchWithAuth } from "../../api/authApi";
import "./ChaatGPTWidget.css";
import Draggable from "react-draggable";

const ChaatGPTWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth <= 600) setIsMobile(true);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      if (!localStorage.getItem("accessToken")) {
        console.log("Access token missing — clearing chatbot");
        setMessages([]);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  
  useEffect(() => {
    const listener = (e) => {
      console.log("📩 Widget received postMessage:", e.data);
  
      // ✅ Handle iframe close command FIRST (even if string)
      if (e.data === "CLOSE_IFRAME") {
        console.log("🧹 Closing iframe");
        setMessages((prev) => prev.filter((msg) => msg.type !== "iframe"));
        return;
      }
  
      // 🛡️ Skip if message isn't an object (Stripe etc.)
      if (!e.data || typeof e.data !== "object") return;
  
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
      }
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
      }
      
    };
  
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);
  
  

  const handleClear = () => {
    setMessages([]);
  };

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
        `${process.env.REACT_APP_API_BASE_URL || "https://api.dhannobannokirasoi.com"}/restaurante/api/chaatbaat/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
          credentials: "include"
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

        const iframeMatch = botMessage.match(/__IFRAME_URL__:(.*?)__/);
        if (iframeMatch) {
          const iframeUrl = iframeMatch[1];
          setMessages((prev) => [
            ...prev,
            { role: "bot", type: "iframe", content: iframeUrl }
          ]);
          return;
        }

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
        { role: "bot", content: "❌ Error contacting चाटGPT." }
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

      <div className="chat-messages">
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
                  borderRadius: "8px"
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
        (isMobile ? ChatWindow : (
          <Draggable cancel=".chat-messages, input, textarea, button">
            {ChatWindow}
          </Draggable>
        ))}
    </>
  );
};

export default ChaatGPTWidget;
