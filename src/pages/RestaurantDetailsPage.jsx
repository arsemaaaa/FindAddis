import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import RestaurantsContext from "../context/RestaurantsContext";
import { useContext } from "react";
import MenuSection from "../components/restaurant/MenuSection";
import ReviewCard from "../components/restaurant/Reviewcard";
import StarRating from "../components/common/StarRating";
import MapSection from "../components/common/MapSection";



function RestaurantDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { restaurants } = useContext(RestaurantsContext);
  const r = restaurants.find((x) => x.id === id);

  if (!r) {
    return <div className="container"><h2>Restaurant not found</h2></div>;
  }

  return (
    <div className="restaurant-details container">
      <div className="details-grid">
        <div className="details-main">
          <div className="details-image" style={{ backgroundImage: `url("${r.images?.[0]}")` }} />
          <h1 className="restaurant-title">{r.name}</h1>
          <div className="restaurant-sub">
            <div className="restaurant-category">{r.category} • {r.price}</div>
            <StarRating value={r.rating} />
          </div>

          <p className="restaurant-description">{r.description}</p>

          <MenuSection menu={r.menu} />

          <MapSection location={r.location} name={r.name} />


          <section className="reviews-section">
            <h3>Reviews</h3>
            {r.reviews && r.reviews.length === 0 && <div>No reviews yet—be the first.</div>}
            <div className="reviews-list">
              {r.reviews.map((rev) => <ReviewCard key={rev.id} review={rev} restaurantId={r.id} />)}
            </div>
            <div className="write-review-actions">
              <button className="button button-primary" onClick={() => navigate(`/write-review?restaurant=${r.id}`)}>Write a review</button>
            </div>
          </section>
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
