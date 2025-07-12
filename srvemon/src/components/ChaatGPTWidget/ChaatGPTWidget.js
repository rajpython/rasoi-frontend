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

  // 🔥 This ensures chat clears on logout
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



  const handleSend = async () => {
    if (!input.trim()) return;
  
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
  
    const res = await fetchWithAuth(`${BASE_URL}/restaurante/api/chaatbaat/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });
  
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
      setMessages((prev) => {
        // update the last bot message or add if needed
        const last = prev[prev.length - 1];
        if (last && last.role === "bot") {
          return [...prev.slice(0, -1), { ...last, content: botMessage }];
        }
        return [...prev, { role: "bot", content: botMessage }];
      });
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

