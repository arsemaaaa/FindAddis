import React from "react";

function Dropdown({ label, options = [], value, onChange, className = "" }) {
  return (
    <div className={`dropdown-container ${className}`}>
      {label && <label className="dropdown-label">{label}</label>}
      <select className="dropdown-select" value={value} onChange={onChange}>
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;
