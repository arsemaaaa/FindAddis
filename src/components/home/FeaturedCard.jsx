import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import RestaurantsContext from "../../context/RestaurantsContext";
import StarRating from "../common/StarRating";
import LucyImg from '../../assets/lucy.jpg';
import ItalianoImg from '../../assets/italiano.webp';
import AddisImg from '../../assets/addis-cafe.jpg';

function FeaturedCard({ restaurant }) {
  const { toggleFavorite, isFavorite, updateRestaurantImage } = useContext(RestaurantsContext);
  const fav = isFavorite ? isFavorite(restaurant.id) : false;
  const img = restaurant.image || (restaurant.images && restaurant.images.length > 0 ? restaurant.images[0] : null);
  const defaults = { lucy: LucyImg, italiano: ItalianoImg, addiscafe: AddisImg };
  const finalImg = img || defaults[restaurant.id] || null;
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  return (
    <article className="restaurant-card featured-card">
      <Link to={`/restaurants/${restaurant.id}`} className="featured-image-link" aria-label={`${restaurant.name} photo`}>
        <div
          className="featured-image"
          style={{ backgroundImage: `url('${finalImg ? encodeURI(finalImg) : '/assets/placeholder.svg'}')` }}
          role="img"
          aria-label={restaurant.name}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden-file-input"
            onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              if (!file) return;
              setUploading(true);
              const reader = new FileReader();
              reader.onload = () => {
                const dataUrl = reader.result;
                try {
                  updateRestaurantImage && updateRestaurantImage(restaurant.id, dataUrl);
                } finally {
                  setUploading(false);
                }
              };
              reader.readAsDataURL(file);
              // reset input so same file can be reselected later
              e.target.value = null;
            }}
          />

          <button
            type="button"
            className="image-upload-btn"
            title="Change image"
            onClick={() => inputRef.current && inputRef.current.click()}
            aria-label="Change featured image"
          >
            {uploading ? '...' : '📷'}
          </button>
        </div>
      </Link>

      <div className="featured-content">
        <div className="featured-header">
          <h3 className="featured-title"><Link to={`/restaurants/${restaurant.id}`}>{restaurant.name}</Link></h3>
          <button
            className={`favorite-btn ${fav ? 'fav-active' : ''}`}
            onClick={() => toggleFavorite && toggleFavorite(restaurant.id)}
            aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
            title={fav ? 'Remove from favorites' : 'Add to favorites'}
          >
            {fav ? '♥' : '♡'}
          </button>
        </div>

        <div className="featured-meta">
          {restaurant.category && <div className="featured-category">{restaurant.category} {restaurant.price ? `• ${restaurant.price}` : ''}</div>}
          {typeof restaurant.rating !== 'undefined' && (
            <div className="featured-rating"><StarRating value={restaurant.rating} /> <span className="rating-value">{restaurant.rating}</span></div>
          )}
        </div>

        <p className="featured-desc">{restaurant.description}</p>

        <div className="featured-footer">
          {restaurant.address && <div className="featured-address">{restaurant.address}</div>}
          <Link to={`/restaurants/${restaurant.id}`} className="button button-small">View</Link>
        </div>
      </div>
    </article>
  );
}

export default FeaturedCard;
