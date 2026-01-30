import React from "react";
import Sidebar from "../components/layout/Sidebar";
import RestaurantList from "../components/restaurant/RestaurantList";
import { useContext, useState, useMemo } from "react";
import RestaurantsContext from "../context/RestaurantsContext";



function RestaurantListPage() {
  const { restaurants } = useContext(RestaurantsContext);
  const [filters, setFilters] = useState({ category: "", minRating: 0 });
console.log("RestaurantListPage",restaurants)
  const filtered = useMemo(() => {
    return restaurants.filter((r) => (!filters.category || r.category === filters.category) && r.rating >= filters.minRating);
  }, [restaurants, filters]);

  return (
    <div className="restaurant-list-page container">
      <div className="layout-grid">
        <Sidebar filters={filters} setFilters={setFilters} restaurants={restaurants} />
        <div className="main-content">
          <h1 className="page-title">All restaurants</h1>
          <RestaurantList restaurants={filtered} />
        </div>
      </div>
    </div>
  );
}

export default RestaurantListPage;
