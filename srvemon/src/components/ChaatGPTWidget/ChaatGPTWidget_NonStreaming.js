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
  const messagesEndRef = useRef(null);

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
      const res = await fetchWithAuth("http://127.0.0.1:9100/restaurante/api/chaatbaat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      const botMessage = { role: "bot", content: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMsg = { role: "bot", content: "Sorry, could not reach चाटGPT." };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };
  
  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <div className="chaatgpt-floating-button" onClick={() => setIsOpen(true)}>
          <img src={chaatGPTLogo} alt="चाटGPT" />
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Draggable>
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
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
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
        </Draggable>
      )}
    </>
  );
};

export default ChaatGPTWidget;
