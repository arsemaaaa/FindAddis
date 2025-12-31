import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import RestaurantsContext from "../context/RestaurantsContext";
import { useContext } from "react";
import RestaurantList from "../components/restaurant/RestaurantList";
import SortDropdown, { sortRestaurants } from "../components/common/SortDropdown";
import EmptyState from "../components/common/EmptyState";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResultsPage() {
  const { restaurants } = useContext(RestaurantsContext);
  const q = useQuery().get("q") || "";
  const [sortBy, setSortBy] = useState("rating-desc");

  const results = useMemo(() => {
    if (!q) return [];
    const lower = q.toLowerCase();
    return restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(lower) ||
        (r.description && r.description.toLowerCase().includes(lower)) ||
        (r.category && r.category.toLowerCase().includes(lower)) ||
        (r.menu && r.menu.some((m) => m.toLowerCase().includes(lower)))
    );
  }, [restaurants, q]);

  const sorted = useMemo(() => {
    return sortRestaurants(results, sortBy);
  }, [results, sortBy]);

  return (
    <div className="search-results container">
      <div className="page-header">
        <h1 className="page-title">
          {q ? `Search results for "${q}"` : "Search restaurants"}
        </h1>
        {results.length > 0 && <SortDropdown value={sortBy} onChange={setSortBy} />}
      </div>
      
      {results.length === 0 ? (
        <EmptyState
          title="No restaurants found"
          message={q ? `We couldn't find any restaurants matching "${q}". Try a different search term.` : "Enter a search term to find restaurants."}
          suggestions={[
            "Try searching for a category like 'Ethiopian' or 'Cafe'",
            "Search for a specific dish or cuisine",
            "Check your spelling or try a different keyword"
          ]}
        />
      ) : (
        <>
          <div className="results-count">
            {sorted.length} {sorted.length === 1 ? "result" : "results"} found
          </div>
          <RestaurantList restaurants={sorted} />
        </>
      )}
    </div>
  );
}

export default SearchResultsPage;
