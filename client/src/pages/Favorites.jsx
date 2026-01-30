import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import RestaurantsContext from "../context/RestaurantsContext";
import RestaurantList from "../components/restaurant/RestaurantList";

function Favorites() {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const id = user._id
    const fetchFavorites = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/users/favorites/${id}`);
        if (!res.ok) throw new Error("Failed to fetch favorites");
        const data = await res.json();
        setFavorites(data.favorites);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  if (loading) return <p>Loading favorites...</p>;

  return (
    <div className="favorites-page container">
      <h1 className="page-title">Favorites</h1>
      {favorites.length === 0 ? (
        <p className="muted">You haven't saved any restaurants yet.</p>
      ) : (
        <RestaurantList restaurants={favorites} />
      )}
    </div>
  );
}


export default Favorites;
