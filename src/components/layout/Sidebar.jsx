import React from "react";
import Dropdown from "../common/Dropdown";

function Sidebar({ filters, setFilters }) {
  return (
    <aside className="sidebar-container">
      <div className="filter-block">
        <h4 className="filter-title">Category</h4>
        <Dropdown
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          options={[
            { value: "", label: "All" },
            { value: "Ethiopian", label: "Ethiopian" },
            { value: "Italian", label: "Italian" },
            { value: "Cafe", label: "Cafe" },
          ]}
        />
      </div>

      <div className="filter-block">
        <h4 className="filter-title">Minimum rating</h4>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={filters.minRating}
          onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
          className="filter-range"
        />
        <div className="filter-range-value">{filters.minRating.toFixed(1)}+</div>
      </div>
    </aside>
  );
}

export default Sidebar;
