import React from "react";

function FilterChips({ filters, onRemoveFilter, onClearAll }) {
  const activeFilters = [];

  if (filters.category) {
    activeFilters.push({ key: "category", label: `Category: ${filters.category}`, value: filters.category });
  }
  if (filters.minRating > 0) {
    activeFilters.push({ key: "minRating", label: `Rating: ${filters.minRating.toFixed(1)}+`, value: filters.minRating });
  }
  if (filters.price) {
    activeFilters.push({ key: "price", label: `Price: ${filters.price}`, value: filters.price });
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className="filter-chips">
      <div className="filter-chips-label">Active filters:</div>
      <div className="filter-chips-list">
        {activeFilters.map((filter) => (
          <button
            key={filter.key}
            className="filter-chip"
            onClick={() => onRemoveFilter(filter.key)}
            aria-label={`Remove ${filter.label} filter`}
          >
            <span>{filter.label}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        ))}
        {activeFilters.length > 1 && (
          <button className="filter-chip filter-chip-clear" onClick={onClearAll}>
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}

export default FilterChips;

