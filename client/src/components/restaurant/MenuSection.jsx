import React from "react";

function MenuSection({ menu = [] }) {
  return (
    <div className="menu-section">
      <h4 className="menu-title">Menu</h4>
      <ul className="menu-list">
        {menu.map((m, idx) => (
          <li key={idx} className="menu-item">{m}</li>
        ))}
      </ul>
    </div>
  );
}

export default MenuSection;
