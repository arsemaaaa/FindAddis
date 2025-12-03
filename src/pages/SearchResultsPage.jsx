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
    const lower = q.toLowerCase();
    return restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(lower) ||
        (r.description && r.description.toLowerCase().includes(lower)) ||
        (r.menu && r.menu.some((m) => m.toLowerCase().includes(lower)))
    );
  }, [restaurants, q]);

  return (
    <div className="search-results container">
      <h1 className="page-title">Search results for “{q}”</h1>
      <RestaurantList restaurants={results} />
    </div>
  );
}

export default SearchResultsPage;
