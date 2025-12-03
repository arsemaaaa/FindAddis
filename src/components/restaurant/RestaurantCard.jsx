import React from "react";
import { Link } from "react-router-dom";
import StarRating from "../common/StarRating";

function RestaurantCard({ restaurant }) {
  return (
    <div className="restaurant-card">
      <Link to={`/restaurants/${restaurant.id}`} className="restaurant-image-link">
        <div className="restaurant-image" style={{ backgroundImage: `url("${restaurant.images?.[0]}")` }} />
      </Link>
      <div className="restaurant-card-body">
        <Link to={`/restaurants/${restaurant.id}`} className="restaurant-name">{restaurant.name}</Link>
        <div className="restaurant-meta">
          <div className="restaurant-category">{restaurant.category} • {restaurant.price}</div>
          <StarRating value={restaurant.rating} />
        </div>
        <div className="restaurant-address">{restaurant.address}</div>
      </div>
    </div>
  );
}

export default RestaurantCard;
