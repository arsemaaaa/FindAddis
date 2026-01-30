import React from "react";
import axios from "axios";
import SAMPLE_RESTAURANTS from "../data/restaurants";
import AuthContext from "./AuthContext";
const RestaurantsContext = React.createContext();

export function RestaurantsProvider({ children }) {
  const { token } = React.useContext(AuthContext);
  const [restaurants, setRestaurants] = React.useState([]);

  React.useEffect(() => {
    axios.get("http://localhost:3000/api/restaurants")
      .then((res) => {
        if (res.data.length === 0) {
          setRestaurants([]);
        } else {
          setRestaurants(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch restaurants", err);
        // Fallback to sample data if backend fails, for smoother demo
        setRestaurants(SAMPLE_RESTAURANTS);
      });
  }, []);


  const [favorites, setFavorites] = React.useState([]);

  React.useEffect(() => {
    if (!token) {
      setFavorites([])
      return
    }
    axios.get("http://localhost:3000/api/users/favorites", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (res.data) {
          const allUserFavorites = res.data.map(r => r._id)
          setFavorites(allUserFavorites)
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user's favoture", err);
      });
  }, [token]);

  async function addReview(restaurantId, review) {
    return axios.post(`http://localhost:3000/api/restaurants/${restaurantId}/reviews`, review,
      {
        headers: {
          Authorization: ` Bearer ${token}`
        }
      }
    )
      .then((res) => {
        // Server responds with { rating, reviews } — pick the newly added review
        const data = res.data;
        const createdReview = (data.reviews && data.reviews.length) ? data.reviews[data.reviews.length - 1] : null;

        setRestaurants((prev) =>
          prev.map((r) =>
            r._id === restaurantId
              ? { ...r, rating: data.rating ?? r.rating, reviews: [...(r.reviews || []), ...(createdReview ? [createdReview] : [])] }
              : r
          )
        );
      })
      .catch(() => {
        alert('you already reviewed this restaurant.')
      });
  }

  async function editReview(restaurantId, reviewId, updated) {
    axios.put(`http://localhost:3000/api/restaurants/${restaurantId}/reviews/${reviewId}`, updated)
      .then((res) => {
        console.log(res)
        setRestaurants((prev) =>
          prev.map((r) =>
            r._id === restaurantId
              ? { ...r, reviews: (r.reviews || []).map((rv) => (rv.id === reviewId || rv._id === reviewId ? { ...rv, ...updated } : rv)) }
              : r
          )
        );
      })
      .catch((err) => console.error("Error editing review", err));
  }

  async function deleteReview(restaurantId, reviewId) {
    axios.delete(`http://localhost:3000/api/restaurants/${restaurantId}/reviews/${reviewId}`)
      .then(() => {
        setRestaurants((prev) =>
          prev.map((r) => (r._id === restaurantId ? { ...r, reviews: (r.reviews || []).filter((rv) => rv.id !== reviewId && rv._id !== reviewId) } : r))
        );
      })
      .catch((err) => console.error("Error deleting review", err));
  }

  function addRestaurant(newR) {
    // add to localstate
    setRestaurants((prev) => [newR, ...prev]);
  }

  async function deleteRestaurant(restaurantId) {
    // remove from DB
    axios.delete(`http://localhost:3000/api/restaurants/${restaurantId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        // remove from local state
        setRestaurants((prev) => prev.filter(r => r._id != restaurantId));
        alert('Your restaurant is removed from our system')
      })
      .catch((err) => console.error("Error deleting review", err));
  }

  function updateRestaurantImage(restaurantId, dataUrl) {
    setRestaurants((prev) =>
      prev.map((r) => (r._id === restaurantId ? { ...r, images: [dataUrl, ...(r.images || []).slice(1)] } : r))
    );
  }

  function toggleFavorite(restaurantId) {
    // decide if to add to favorite or remove. 
    const isFavoriteToAdd = !favorites.includes(restaurantId)
    // maintain local state
    setFavorites((prev) => (prev.includes(restaurantId) ? prev.filter((id) => id !== restaurantId) : [...prev, restaurantId]));

    // add or remove user favorite list from db by calling rest api. 
    if (isFavoriteToAdd) {
      return axios.post(`http://localhost:3000/api/users/favorites/${restaurantId}`,
        null, // no payload needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res)
          // just added to db, not need to use the response.
        })
        .catch((err) => console.error("Error adding user's favorite", err));
    } else {
      return axios.delete(`http://localhost:3000/api/users/favorites/${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res)
          // just deleted to db, not need to use the response.
        })
        .catch((err) => console.error("Error removing user's favorite", err));
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
        deleteRestaurant,
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
