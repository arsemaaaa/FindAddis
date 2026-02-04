import React from "react";

function Button({ children, onClick, type = "button", className = "", disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`button ${disabled ? "button-disabled" : "button-primary"} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
