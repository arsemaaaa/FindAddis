import React from "react";

function Button({ children, onClick, type = "button", className = "", disabled = false }) {
  const base = disabled ? "btn btn-secondary disabled" : "btn btn-primary";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
