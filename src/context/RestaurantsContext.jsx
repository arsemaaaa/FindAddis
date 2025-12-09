import React from "react";
import SAMPLE_RESTAURANTS from "../data/restaurants";

const RestaurantsContext = React.createContext();

export function RestaurantsProvider({ children }) {
  const [restaurants, setRestaurants] = React.useState(() => {
    try {
      const raw = localStorage.getItem("fa_restaurants");
      return raw ? JSON.parse(raw) : SAMPLE_RESTAURANTS;
    } catch (e) {
      return SAMPLE_RESTAURANTS;
    }
  });

  const [favorites, setFavorites] = React.useState(() => {
    try {
      const raw = localStorage.getItem("fa_favorites");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem("fa_restaurants", JSON.stringify(restaurants));
    } catch (e) {}
  }, [restaurants]);

  React.useEffect(() => {
    try {
      localStorage.setItem("fa_favorites", JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites]);

  function addReview(restaurantId, review) {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === restaurantId ? { ...r, reviews: [...(r.reviews || []), review] } : r))
    );
  }

  function editReview(restaurantId, reviewId, updated) {
    setRestaurants((prev) =>
      prev.map((r) =>
        r.id === restaurantId
          ? { ...r, reviews: (r.reviews || []).map((rv) => (rv.id === reviewId ? { ...rv, ...updated } : rv)) }
          : r
      )
    );
  }

  function deleteReview(restaurantId, reviewId) {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === restaurantId ? { ...r, reviews: (r.reviews || []).filter((rv) => rv.id !== reviewId) } : r))
    );
  }

  function addRestaurant(newR) {
    setRestaurants((prev) => [newR, ...prev]);
  }

  function updateRestaurantImage(restaurantId, dataUrl) {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === restaurantId ? { ...r, images: [dataUrl, ...(r.images || []).slice(1)] } : r))
    );
  }

  function toggleFavorite(restaurantId) {
    setFavorites((prev) => (prev.includes(restaurantId) ? prev.filter((id) => id !== restaurantId) : [...prev, restaurantId]));
  }

  function isFavorite(restaurantId) {
    return favorites.includes(restaurantId);
  }

  return (
    <RestaurantsContext.Provider
      value={{
        restaurants,
        addReview,
        editReview,
        deleteReview,
        addRestaurant,
        updateRestaurantImage,
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </RestaurantsContext.Provider>
  );
}

export default RestaurantsContext;
