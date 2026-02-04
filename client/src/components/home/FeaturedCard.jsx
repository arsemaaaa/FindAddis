import React, { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { Link } from "react-router-dom";
import RestaurantsContext from "../../context/RestaurantsContext";
import StarRating from "../common/StarRating";
import LucyImg from '../../assets/lucy.jpg';
import ItalianoImg from '../../assets/italiano.webp';
import AddisImg from '../../assets/addis-cafe.jpg';
import KategnaImg from '../../assets/kategna.png';
import TomocaImg from '../../assets/tomoca.png';
import Placeholder from "../../assets/addis-cafe.jpg";


function FeaturedCard({ restaurant, showDeleteButton, onDelete }) {

  const { toggleFavorite, isFavorite, deleteRestaurant } = useContext(RestaurantsContext);
  const fav = isFavorite ? isFavorite(restaurant._id) : false;


  // Default images for known restaurants
  const defaults = {
    lucy: LucyImg,
    italiano: ItalianoImg,
    addiscafe: AddisImg,
    kategna: KategnaImg,
    tomoca: TomocaImg,
  };

  // FINAL IMAGE LOGIC: first image > uploaded image > defaults > placeholder
  const finalImg =
    (restaurant.images && restaurant.images.length > 0 && restaurant.images[0]) ||
    restaurant.image ||
    defaults[restaurant._id] ||
    Placeholder;

  return (
    <article className="restaurant-card featured-card">
      <Link to={`/restaurants/${restaurant._id}`} className="featured-image-link" aria-label={`${restaurant.name} photo`}>
        <div
          className="featured-image"
          style={{ backgroundImage: `url('${finalImg}')` }} // FIXED: added quotes
          role="img"
          aria-label={restaurant.name}
        >
        </div>
      </Link>

      <div className="featured-content">
        <div className="featured-header">
          <h3 className="featured-title">
            <Link to={`/restaurants/${restaurant._id}`}>{restaurant.name}</Link>
          </h3>
          <button
            className={`favorite-btn ${fav ? 'fav-active' : ''}`}
            onClick={() => toggleFavorite && toggleFavorite(restaurant._id)}
            aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
            title={fav ? 'Remove from favorites' : 'Add to favorites'}
          >
            {fav ? '♥' : '♡'}
          </button>
        </div>

        <div className="featured-meta">
          {restaurant.category && (
            <div className="featured-category">
              {restaurant.category} {restaurant.price ? `• ${restaurant.price}` : ''}
            </div>
          )}
          {typeof restaurant.rating !== 'undefined' && (
            <div className="featured-rating">
              <StarRating value={restaurant.rating} /> <span className="rating-value">{restaurant.rating}</span>
            </div>
          )}
        </div>

        <p className="featured-desc">{restaurant.description}</p>

        <div className="featured-footer">
          {restaurant.address && <div className="featured-address">{restaurant.address}</div>}
          <Link to={`/restaurants/${restaurant._id}`} className="button button-small">View</Link>
          {showDeleteButton && (
            <button
              onClick={() => {
                if (!deleteRestaurant) return;
                deleteRestaurant(restaurant._id)
                  .then(() => {
                    if (typeof onDelete === 'function') onDelete(restaurant._id);
                  })
                  .catch(() => {
                    // optionally handle error (alert or toast)
                  });
              }}
              className="button button-small"
            >
              delete
            </button>
          )}

        </div>
      </div>
    </article>
  );
}

export default FeaturedCard;
