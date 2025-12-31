import React from "react";
import Dropdown from "../common/Dropdown";

function Sidebar({ filters, setFilters }) {
  return (
    <aside className="sidebar-container">
      <div className="filter-block">
        <h4 className="filter-title">Category</h4>
        <Dropdown
          value={filters.category || ""}
          onChange={(e) => setFilters({ ...filters, category: e.target.value || null })}
          options={[
            { value: "", label: "All categories" },
            { value: "Ethiopian", label: "Ethiopian" },
            { value: "Italian", label: "Italian" },
            { value: "Cafe", label: "Cafe" },
            { value: "Fast food", label: "Fast food" },
          ]}
        />
      </div>

      <div className="filter-block">
        <h4 className="filter-title">Price range</h4>
        <Dropdown
          value={filters.price || ""}
          onChange={(e) => setFilters({ ...filters, price: e.target.value || null })}
          options={[
            { value: "", label: "All prices" },
            { value: "$", label: "$ - Budget friendly" },
            { value: "$$", label: "$$ - Moderate" },
            { value: "$$$", label: "$$$ - Expensive" },
            { value: "$$$$", label: "$$$$ - Very expensive" },
          ]}
        />
      </div>

      <div className="filter-block">
        <h4 className="filter-title">Minimum rating</h4>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={filters.minRating || 0}
          onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
          className="filter-range"
        />
        <div className="filter-range-value">{filters.minRating?.toFixed(1) || "0.0"}+</div>
      </div>
    </aside>
  );
}

export default Sidebar;
