import React from "react";
import RestaurantCard from "./RestaurantCard";
import EmptyState from "../common/EmptyState";

function RestaurantList({ restaurants }) {
  if (!restaurants || restaurants.length === 0) {
    return (
      <EmptyState
        title="No restaurants found"
        message="Try adjusting your filters or search terms."
        suggestions={[
          "Clear your filters to see more results",
          "Try a different category or search term",
          "Check back later for new restaurants"
        ]}
        actionLabel="View all restaurants"
        actionLink="/restaurants"
      />
    );
  }

  return (
    <div className="restaurant-list">
      {restaurants.map((r) => (
        <RestaurantCard key={r.id} restaurant={r} />
      ))}
    </div>
  );
}

export default RestaurantList;
