

// src/components/ConfirmModal.js
import React, { useEffect, useRef } from "react";

function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  const cancelBtnRef = useRef(null);

  useEffect(() => {
    if (open && cancelBtnRef.current) cancelBtnRef.current.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        paddingTop: "140px"
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-message"
    >
      <div
        className="booking-form"
        style={{ maxWidth: "400px", padding: "2rem", textAlign: "center" }}
      >
        <h3 id="modal-title" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{title}</h3>
        <p id="modal-message" style={{ fontSize: "1rem", color: "#333", marginBottom: "1.5rem" }}>{message}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <button
            onClick={onConfirm}
            className="confirm-button"
            style={{
              backgroundColor: "#495e57",
              color: "white",
              padding: "0.6rem 1rem",
              borderRadius: "6px",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Yes, Cancel
          </button>
          <button
            ref={cancelBtnRef}
            onClick={onCancel}
            className="cancel-button"
            style={{
              backgroundColor: "#eee",
              padding: "0.6rem 1rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            No, Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
