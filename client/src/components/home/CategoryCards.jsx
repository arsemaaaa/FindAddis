import React from "react";
import { Link } from "react-router-dom";

function CategoryCards({ restaurants }) {
const cats = [...new Set(restaurants.map(r => r.category))];
  return (
    <div className="category-cards">
      {cats.map((c) => (
        <Link key={c} to={`/search?q=${encodeURIComponent(c)}`} className="category-card">
          {c}
        </Link>
      ))}
    </div>
  );
}

export default CategoryCards;
