import React from "react";
import Dropdown from "./Dropdown";

const SORT_OPTIONS = [
  { value: "rating-desc", label: "Rating: High to Low" },
  { value: "rating-asc", label: "Rating: Low to High" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function SortDropdown({ value, onChange, className = "" }) {
  return (
    <div className={`sort-container ${className}`}>
      <label className="sort-label">Sort by</label>
      <Dropdown
        value={value || "rating-desc"}
        onChange={(e) => onChange(e.target.value)}
        options={SORT_OPTIONS}
        className={className}
      />
    </div>
  );
}

export function sortRestaurants(restaurants, sortBy) {
  const sorted = [...restaurants];
  
  switch (sortBy) {
    case "rating-desc":
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case "rating-asc":
      return sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "price-asc":
      return sorted.sort((a, b) => {
        const priceOrder = { "$": 1, "$$": 2, "$$$": 3, "$$$$": 4 };
        return (priceOrder[a.price] || 0) - (priceOrder[b.price] || 0);
      });
    case "price-desc":
      return sorted.sort((a, b) => {
        const priceOrder = { "$": 1, "$$": 2, "$$$": 3, "$$$$": 4 };
        return (priceOrder[b.price] || 0) - (priceOrder[a.price] || 0);
      });
    default:
      return sorted;
  }
}

export default SortDropdown;

