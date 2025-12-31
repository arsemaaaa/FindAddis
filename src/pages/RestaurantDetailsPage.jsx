import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RestaurantsContext from "../context/RestaurantsContext";
import { useContext } from "react";
import MenuSection from "../components/restaurant/MenuSection";
import ReviewCard from "../components/restaurant/Reviewcard";
import StarRating from "../components/common/StarRating";
import SimilarRestaurants from "../components/restaurant/SimilarRestaurants";
import ShareButton from "../components/common/ShareButton";
import Dropdown from "../components/common/Dropdown";

function RestaurantDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { restaurants } = useContext(RestaurantsContext);
  const [reviewSort, setReviewSort] = useState("newest");
  const r = restaurants.find((x) => x.id === id);

  // Track recently viewed
  useEffect(() => {
    if (r) {
      const recent = JSON.parse(localStorage.getItem("fa_recently_viewed") || "[]");
      const updated = [r.id, ...recent.filter((id) => id !== r.id)].slice(0, 10);
      localStorage.setItem("fa_recently_viewed", JSON.stringify(updated));
    }
  }, [r]);

  const sortedReviews = useMemo(() => {
    if (!r || !r.reviews) return [];
    const reviews = [...r.reviews];
    
    switch (reviewSort) {
      case "newest":
        return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "oldest":
        return reviews.sort((a, b) => new Date(a.date) - new Date(b.date));
      case "highest":
        return reviews.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return reviews.sort((a, b) => a.rating - b.rating);
      default:
        return reviews;
    }
  }, [r, reviewSort]);

  if (!r) {
    return <div className="container"><h2>Restaurant not found</h2></div>;
  }

  return (
    <div className="restaurant-details container">
      <div className="details-grid">
        <div className="details-main">
          <div className="details-image" style={{ backgroundImage: `url("${r.images?.[0]}")` }} />
          <div className="restaurant-header">
            <div>
              <h1 className="restaurant-title">{r.name}</h1>
              <div className="restaurant-sub">
                <div className="restaurant-category">{r.category} • {r.price}</div>
                <StarRating value={r.rating} />
                {r.reviews && r.reviews.length > 0 && (
                  <span className="review-count">({r.reviews.length} {r.reviews.length === 1 ? "review" : "reviews"})</span>
                )}
              </div>
            </div>
            <ShareButton url={window.location.href} title={r.name} text={`Check out ${r.name} on Find Addis!`} />
          </div>

          <p className="restaurant-description">{r.description}</p>

          <MenuSection menu={r.menu} />

          <section className="reviews-section">
            <div className="reviews-header">
              <h3>Reviews</h3>
              {r.reviews && r.reviews.length > 0 && (
                <Dropdown
                  value={reviewSort}
                  onChange={(e) => setReviewSort(e.target.value)}
                  options={[
                    { value: "newest", label: "Newest first" },
                    { value: "oldest", label: "Oldest first" },
                    { value: "highest", label: "Highest rated" },
                    { value: "lowest", label: "Lowest rated" },
                  ]}
                />
              )}
            </div>
            {r.reviews && r.reviews.length === 0 ? (
              <div className="empty-reviews">
                <p>No reviews yet—be the first to share your experience!</p>
                <button className="button button-primary" onClick={() => navigate(`/write-review?restaurant=${r.id}`)}>
                  Write the first review
                </button>
              </div>
            ) : (
              <>
                <div className="reviews-list">
                  {sortedReviews.map((rev) => <ReviewCard key={rev.id} review={rev} restaurantId={r.id} />)}
                </div>
                <div className="write-review-actions">
                  <button className="button button-primary" onClick={() => navigate(`/write-review?restaurant=${r.id}`)}>Write a review</button>
                </div>
              </>
            )}
          </section>

          <SimilarRestaurants restaurant={r} allRestaurants={restaurants} />
        </div>

        <aside className="details-aside">
          <div className="info-block">
            <h4 className="info-title">Location</h4>
            <div>{r.address}</div>
            <div className="info-extra">Hours: {r.hours}</div>
          </div>
          <div className="info-block">
            <h4 className="info-title">Contact</h4>
            <div>Phone: +251 911 000 000</div>
            <div>Website: example.com</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default RestaurantDetailsPage;
