import React from "react";

function Dropdown({ label, value, onChange, className = "", children }) {
  return (
    <div className={`dropdown-container ${className}`}>
      {label && <label className="dropdown-label">{label}</label>}
      <select className="dropdown-select" value={value} onChange={onChange}>
        {children}
      </select>
    </div>
  );
}


export default Dropdown;
