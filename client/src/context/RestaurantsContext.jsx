import React from "react";
import axios from "axios";
import SAMPLE_RESTAURANTS from "../data/restaurants";

const RestaurantsContext = React.createContext();

export function RestaurantsProvider({ children }) {
  const [restaurants, setRestaurants] = React.useState([]);

  React.useEffect(() => {
    axios.get("http://localhost:3000/api/restaurants")
      .then((res) => {
        if (res.data.length === 0) {
          // console.log("no resturant data ... ")
          // Fallback or handle initial seed
          setRestaurants([]);
        } else {
          //  console.log("yes resturant data ... ", res.data)
          setRestaurants(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch restaurants", err);
        // Fallback to sample data if backend fails, for smoother demo
        setRestaurants(SAMPLE_RESTAURANTS);
      });
  }, []);

  const [favorites, setFavorites] = React.useState(() => {
    try {
      const raw = localStorage.getItem("fa_favorites");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.log(e)
      return [];
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem("fa_favorites", JSON.stringify(favorites));
    } catch (e) {
      console.log(e)
    }
  }, [favorites]);

  function addReview(restaurantId, review) {
    return axios.post(`http://localhost:3000/api/restaurants/${restaurantId}/reviews`, review)
      .then((res) => {
        // Optimistically update or re-fetch. Let's update state manually to save a fetch.
        // res.data contains the new review with ID
        const newReview = res.data;
        setRestaurants((prev) =>
          prev.map((r) => (r.id === restaurantId ? { ...r, reviews: [...(r.reviews || []), newReview] } : r))
        );
      })
      .catch((err) => console.error("Error adding review", err));
  }

  function editReview(restaurantId, reviewId, updated) {
    axios.put(`http://localhost:3000/api/restaurants/${restaurantId}/reviews/${reviewId}`, updated)
      .then((res) => {
        console.log(res)
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
    axios.delete(`http://localhost:3000/api/restaurants/${restaurantId}/reviews/${reviewId}`)
      .then(() => {
        setRestaurants((prev) =>
          prev.map((r) => (r.id === restaurantId ? { ...r, reviews: (r.reviews || []).filter((rv) => rv.id !== reviewId && rv._id !== reviewId) } : r))
        );
      })
      .catch((err) => console.error("Error deleting review", err));
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
