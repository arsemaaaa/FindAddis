import React, { useContext, useState, useMemo } from "react";
import RestaurantsContext from "../context/RestaurantsContext";
import RestaurantList from "../components/restaurant/RestaurantList";
import SortDropdown, { sortRestaurants } from "../components/common/SortDropdown";
import EmptyState from "../components/common/EmptyState";

function Favorites() {
  const { restaurants, favorites } = useContext(RestaurantsContext);
  const [sortBy, setSortBy] = useState("rating-desc");
  
  const favRestaurants = useMemo(() => {
    return restaurants.filter((r) => favorites.includes(r.id));
  }, [restaurants, favorites]);

  const sorted = useMemo(() => {
    return sortRestaurants(favRestaurants, sortBy);
  }, [favRestaurants, sortBy]);

  return (
    <div className="favorites-page container">
      <div className="page-header">
        <h1 className="page-title">Favorites</h1>
        {favRestaurants.length > 0 && <SortDropdown value={sortBy} onChange={setSortBy} />}
      </div>
      {favRestaurants.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          message="Start exploring restaurants and save your favorites for easy access."
          suggestions={[
            "Browse restaurants and click the heart icon to save them",
            "Your favorites will appear here for quick access",
            "You can organize and sort your favorites anytime"
          ]}
          actionLabel="Explore restaurants"
          actionLink="/restaurants"
        />
      ) : (
        <>
          <div className="results-count">
            {sorted.length} {sorted.length === 1 ? "favorite" : "favorites"}
          </div>
          <RestaurantList restaurants={sorted} />
        </>
      )}
    </div>
  );
}

export default Favorites;
