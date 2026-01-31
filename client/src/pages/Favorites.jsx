import React, { useContext } from "react";
import RestaurantsContext from "../context/RestaurantsContext";
import RestaurantList from "../components/restaurant/RestaurantList";

function Favorites() {
  const { restaurants, favorites } = useContext(RestaurantsContext);
  const favRestaurants = restaurants.filter((r) => favorites.includes(r._id));

  return (
    <div className="favorites-page container">
      <h1 className="page-title">Favorites</h1>
      {favRestaurants.length === 0 ? (
        <p className="muted">You haven't saved any restaurants yet.</p>
      ) : (
        <RestaurantList restaurants={favRestaurants} />
      )}
    </div>
  );
}

export default Favorites;
