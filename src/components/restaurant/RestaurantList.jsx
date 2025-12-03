import React from "react";
import RestaurantCard from "./RestaurantCard";

function RestaurantList({ restaurants }) {
  if (!restaurants || restaurants.length === 0) {
    return <div className="empty-list">No restaurants found.</div>;
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
