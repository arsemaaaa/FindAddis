import React from "react";

function InputField({ label, type = "text", value, onChange, placeholder = "", className = "", name }) {
  return (
    <div className={`input-field-container ${className}`}>
      {label && <label className="input-label form-label" htmlFor={name}>{label}</label>}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field form-control"
      />
    </div>
  );
}

export default InputField;
