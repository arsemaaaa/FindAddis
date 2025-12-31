import React from "react";
import Sidebar from "../components/layout/Sidebar";
import RestaurantList from "../components/restaurant/RestaurantList";
import SortDropdown, { sortRestaurants } from "../components/common/SortDropdown";
import FilterChips from "../components/common/FilterChips";
import { useContext, useState, useMemo } from "react";
import RestaurantsContext from "../context/RestaurantsContext";

function RestaurantListPage() {
  const { restaurants } = useContext(RestaurantsContext);
  const [filters, setFilters] = useState({ category: null, minRating: 0, price: null });
  const [sortBy, setSortBy] = useState("rating-desc");

  const filtered = useMemo(() => {
    return restaurants.filter((r) => {
      const categoryMatch = !filters.category || r.category === filters.category;
      const ratingMatch = (r.rating || 0) >= (filters.minRating || 0);
      const priceMatch = !filters.price || r.price === filters.price;
      return categoryMatch && ratingMatch && priceMatch;
    });
  }, [restaurants, filters]);

  const sorted = useMemo(() => {
    return sortRestaurants(filtered, sortBy);
  }, [filtered, sortBy]);

  function removeFilter(key) {
    setFilters((prev) => ({ ...prev, [key]: key === "minRating" ? 0 : null }));
  }

  function clearAllFilters() {
    setFilters({ category: null, minRating: 0, price: null });
  }

  return (
    <div className="restaurant-list-page container">
      <div className="layout-grid">
        <Sidebar filters={filters} setFilters={setFilters} />
        <div className="main-content">
          <div className="page-header">
            <h1 className="page-title">All restaurants</h1>
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
          <FilterChips filters={filters} onRemoveFilter={removeFilter} onClearAll={clearAllFilters} />
          <div className="results-count">
            {sorted.length} {sorted.length === 1 ? "restaurant" : "restaurants"} found
          </div>
          <RestaurantList restaurants={sorted} />
        </div>
      </div>
    </div>
  );
}

export default RestaurantListPage;
