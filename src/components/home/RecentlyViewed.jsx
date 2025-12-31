import React, { useMemo, useState, useEffect } from "react";
import RestaurantsContext from "../../context/RestaurantsContext";
import { useContext } from "react";
import FeaturedCard from "./FeaturedCard";

function RecentlyViewed() {
  const { restaurants } = useContext(RestaurantsContext);
  const [recentIds, setRecentIds] = useState([]);

  useEffect(() => {
    function loadRecent() {
      try {
        const recent = JSON.parse(localStorage.getItem("fa_recently_viewed") || "[]");
        setRecentIds(recent);
      } catch {
        setRecentIds([]);
      }
    }
    
    loadRecent();
    
    // Check periodically for updates (since storage events only fire in other tabs)
    const interval = setInterval(loadRecent, 500);
    
    return () => clearInterval(interval);
  }, []);

  const recentRestaurants = useMemo(() => {
    if (!recentIds || recentIds.length === 0) return [];
    return recentIds
      .map((id) => restaurants.find((r) => r.id === id))
      .filter(Boolean)
      .slice(0, 6);
  }, [recentIds, restaurants]);

  if (recentRestaurants.length === 0) return null;

  return (
    <section className="home-section container">
      <h2 className="section-title">Recently viewed</h2>
      <div className="featured-row">
        {recentRestaurants.map((r) => (
          <FeaturedCard key={r.id} restaurant={r} />
        ))}
      </div>
    </section>
  );
}

export default RecentlyViewed;

