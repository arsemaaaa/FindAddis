import React from "react";
import StarRating from "../common/StarRating";
import Modal from "../common/Modal";
import { useState, useContext } from "react";
import RestaurantsContext from "../../context/RestaurantsContext";
import AuthContext from "../../context/AuthContext";

function ReviewCard({ review, restaurantId }) {
  const { editReview, deleteReview } = useContext(RestaurantsContext);
  const { user, isAdmin } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ rating: review.rating, text: review.text });

  function canEdit() {
    if (!user) return false;
    return isAdmin() || user.name === review.user || user.email === review.user;
  }

  function handleSave() {
    editReview(restaurantId, review.id, { rating: form.rating, text: form.text });
    setOpen(false);
  }

  function handleDelete() {
    if (confirm("Delete this review?")) {
      deleteReview(restaurantId, review.id);
    }
  }

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-user">{review.user}</div>
        <StarRating value={review.rating} />
      </div>
      <div className="review-text">{review.text}</div>
      <div className="review-date">{review.date}</div>
      {canEdit() && (
        <div className="review-actions">
          <button className="button" onClick={() => setOpen(true)}>Edit</button>
          <button className="button button-ghost" onClick={handleDelete}>Delete</button>
        </div>
      )}

      <Modal title={`Edit review — ${review.user}`} open={open} onClose={() => setOpen(false)}>
        <div className="form-row">
          <label>Rating</label>
          <input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))} />
        </div>
        <div className="form-row">
          <label>Text</label>
          <textarea value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} />
        </div>
        <div className="modal-actions">
          <button className="button button-primary" onClick={handleSave}>Save</button>
          <button className="button button-ghost" onClick={() => setOpen(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}

export default ReviewCard;
