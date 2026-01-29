import React from "react";

function Button({ children, onClick, type = "button", className = "", variant = "primary", disabled = false }) {
  const base = `button button-${variant}`;
  const disabledClass = disabled ? "button-disabled" : "";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${disabledClass} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
