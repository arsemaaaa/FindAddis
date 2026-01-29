import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import SAMPLE_RESTAURANTS from "../data/restaurants";
import AuthContext from "./AuthContext";

const RestaurantsContext = React.createContext();

export function RestaurantsProvider({ children }) {
  const [restaurants, setRestaurants] = useState([]);
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);

  // Fetch Restaurants
  useEffect(() => {
    axios.get("http://localhost:5000/api/restaurants")
      .then((res) => {
        if (res.data.length === 0) {
          // Fallback or handle initial seed
          setRestaurants([]);
        } else {
          setRestaurants(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch restaurants", err);
        setRestaurants(SAMPLE_RESTAURANTS);
      });
  }, []);

  // Fetch Favorites (Sync with Backend if logged in, else LocalStorage)
  useEffect(() => {
    if (user) {
      axios.get("http://localhost:5000/api/users/favorites")
        .then((res) => setFavorites(res.data))
        .catch((err) => console.error("Failed to fetch favorites", err));
    } else {
      // Load from local storage if guest
      try {
        const raw = localStorage.getItem("fa_favorites");
        if (raw) setFavorites(JSON.parse(raw));
      } catch (e) { }
    }
  }, [user]);

  // Sync Favorites to LocalStorage (as backup/guest mode)
  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem("fa_favorites", JSON.stringify(favorites));
      } catch (e) { }
    }
  }, [favorites, user]);

  function addReview(restaurantId, review) {
    return axios.post(`http://localhost:5000/api/restaurants/${restaurantId}/reviews`, review)
      .then((res) => {
        const newReview = res.data;
        setRestaurants((prev) =>
          prev.map((r) => (r.id === restaurantId ? { ...r, reviews: [...(r.reviews || []), newReview] } : r))
        );
      })
      .catch((err) => console.error("Error adding review", err));
  }

  function editReview(restaurantId, reviewId, updated) {
    axios.put(`http://localhost:5000/api/restaurants/${restaurantId}/reviews/${reviewId}`, updated)
      .then((res) => {
        setRestaurants((prev) =>
          prev.map((r) =>
            r.id === restaurantId
              ? { ...r, reviews: (r.reviews || []).map((rv) => (rv.id === reviewId || rv._id === reviewId ? { ...rv, ...updated } : rv)) }
              : r
          )
        );
      })
      .catch((err) => console.error("Error editing review", err));
  }

  function deleteReview(restaurantId, reviewId) {
    axios.delete(`http://localhost:5000/api/restaurants/${restaurantId}/reviews/${reviewId}`)
      .then(() => {
        setRestaurants((prev) =>
          prev.map((r) => (r.id === restaurantId ? { ...r, reviews: (r.reviews || []).filter((rv) => rv.id !== reviewId && rv._id !== reviewId) } : r))
        );
      })
      .catch((err) => console.error("Error deleting review", err));
  }

  function addRestaurant(newR) {
    // Optimistic update
    setRestaurants((prev) => [newR, ...prev]);

    axios.post("http://localhost:5000/api/restaurants", newR)
      .then((res) => {
        // Replace optimistic with real server data (which might have extra fields like _id)
        setRestaurants((prev) => [res.data, ...prev.filter(r => r.id !== newR.id)]);
      })
      .catch((err) => {
        console.error("Error creating restaurant", err);
        // Revert optimistic update? For now just log.
      });
  }

  function updateRestaurantImage(restaurantId, dataUrl) {
    const target = restaurants.find(r => r.id === restaurantId);
    if (!target) return;

    // Optimistic update
    const newImages = [dataUrl, ...(target.images || []).slice(0, 4)]; // Keep max 5 for safety
    setRestaurants((prev) =>
      prev.map((r) => (r.id === restaurantId ? { ...r, images: newImages } : r))
    );

    // Persist
    axios.put(`http://localhost:5000/api/restaurants/${restaurantId}`, { images: newImages })
      .catch((err) => console.error("Error updating images", err));
  }

  function toggleFavorite(restaurantId) {
    const isAdding = !favorites.includes(restaurantId);

    // Optimistic update
    setFavorites((prev) => (isAdding ? [...prev, restaurantId] : prev.filter((id) => id !== restaurantId)));

    if (user) {
      const url = `http://localhost:5000/api/users/favorites/${restaurantId}`;
      const request = isAdding ? axios.post(url) : axios.delete(url);

      request.catch((err) => {
        console.error("Error syncing favorite", err);
        // Revert
        setFavorites((prev) => (isAdding ? prev.filter(id => id !== restaurantId) : [...prev, restaurantId]));
      });
    }
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
