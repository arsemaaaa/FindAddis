import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import StarRating from "../common/StarRating";

function SimilarRestaurants({ restaurant, allRestaurants, limit = 3 }) {
  const similar = useMemo(() => {
    if (!restaurant || !allRestaurants) return [];
    
    return allRestaurants
      .filter((r) => r.id !== restaurant.id && r.category === restaurant.category)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }, [restaurant, allRestaurants, limit]);

  if (similar.length === 0) return null;

  return (
    <section className="similar-restaurants">
      <h3 className="similar-title">Similar restaurants</h3>
      <div className="similar-list">
        {similar.map((r) => (
          <Link key={r.id} to={`/restaurants/${r.id}`} className="similar-card">
            <div className="similar-image" style={{ backgroundImage: `url("${r.images?.[0] || ''}")` }} />
            <div className="similar-info">
              <div className="similar-name">{r.name}</div>
              <div className="similar-meta">
                <StarRating value={r.rating} />
                <span className="similar-price">{r.price}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default SimilarRestaurants;

