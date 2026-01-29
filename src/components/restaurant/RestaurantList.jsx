import React from "react";
import RestaurantCard from "./RestaurantCard";

function RestaurantList({ restaurants }) {
  if (!restaurants || restaurants.length === 0) {
    return <div className="empty-list">No restaurants found.</div>;
  }

  return (
    <div className="restaurant-list">
      <div className="row">
        {restaurants.map((r) => (
          <div key={r.id} className="col-12 col-md-6 col-lg-4 mb-4">
            <RestaurantCard restaurant={r} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default RestaurantList;
