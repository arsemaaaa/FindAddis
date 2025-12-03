import React from "react";
import SAMPLE_RESTAURANTS from "../data/restaurants";

const RestaurantsContext = React.createContext();

export function RestaurantsProvider({ children }) {
  const [restaurants, setRestaurants] = React.useState(SAMPLE_RESTAURANTS);

  function addReview(restaurantId, review) {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === restaurantId ? { ...r, reviews: [...r.reviews, review] } : r))
    );
  }

  function addRestaurant(newR) {
    setRestaurants((prev) => [newR, ...prev]);
  }

  return (
    <RestaurantsContext.Provider value={{ restaurants, addReview, addRestaurant }}>
      {children}
    </RestaurantsContext.Provider>
  );
}

export default RestaurantsContext;
