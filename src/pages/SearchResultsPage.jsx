import React from "react";
import { useLocation } from "react-router-dom";
import RestaurantsContext from "../context/RestaurantsContext";
import { useContext, useMemo } from "react";
import RestaurantList from "../components/restaurant/RestaurantList";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResultsPage() {
  const { restaurants } = useContext(RestaurantsContext);
  const q = useQuery().get("q") || "";

  const results = useMemo(() => {
    if (!restaurants) return [];
    const lower = q.toLowerCase();
    return restaurants.filter((r) => {
      // Defensive checks for properties
      const nameMatch = r.name && r.name.toLowerCase().includes(lower);
      const descMatch = r.description && r.description.toLowerCase().includes(lower);
      const menuMatch = r.menu && Array.isArray(r.menu) && r.menu.some((m) => m && typeof m === 'string' && m.toLowerCase().includes(lower));

      return nameMatch || descMatch || menuMatch;
    });
  }, [restaurants, q]);

  return (
    <div className="search-results container">
      <h1 className="page-title">Search results for “{q}”</h1>
      <RestaurantList restaurants={results} />
    </div>
  );
}

export default SearchResultsPage;
