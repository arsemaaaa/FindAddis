import React, { useContext } from "react";
import { Link } from "react-router-dom";
import StarRating from "../common/StarRating";
import RestaurantsContext from "../../context/RestaurantsContext";
import Placeholder from "../../assets/addis-cafe.jpg";

function RestaurantCard({ restaurant }) {
  const { toggleFavorite, isFavorite } = useContext(RestaurantsContext);
  const fav = isFavorite ? isFavorite(restaurant.id) : false;

  const imgSrc =
    (restaurant.images &&
      restaurant.images.length > 0 &&
      restaurant.images[0]) ||
    Placeholder;

  return (
    <div className="restaurant-card">
      <div className="restaurant-image-wrap">
        <Link
          to={`/restaurants/${restaurant.id}`}
          className="restaurant-image-link"
        >
          <img
            src={imgSrc}
            alt={`${restaurant.name} photo`}
            className={`restaurant-image-img ${
              imgSrc === Placeholder ? "placeholder" : ""
            }`}
            loading="lazy"
          />
        </Link>
        <button
          className={`favorite-btn ${fav ? "fav-active" : ""}`}
          onClick={() => toggleFavorite && toggleFavorite(restaurant.id)}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={fav ? "true" : "false"}
          title={fav ? "Remove from favorites" : "Add to favorites"}
        >
          {fav ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 3.99 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18.01 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l7.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
          )}
        </button>
      </div>
      <div className="restaurant-card-body">
        <Link to={`/restaurants/${restaurant.id}`} className="restaurant-name">
          {restaurant.name}
        </Link>
        <div className="restaurant-meta">
          <div className="restaurant-category">
            {restaurant.category} • {restaurant.price}
          </div>
          <StarRating value={restaurant.rating} />
        </div>
        <div className="restaurant-address">{restaurant.address}</div>
      </div>
    </div>
  );
}

export default RestaurantCard;
