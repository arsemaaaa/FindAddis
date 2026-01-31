import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RestaurantsContext from "../context/RestaurantsContext";
import { useContext } from "react";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function WriteReviewPage() {
  const { addReview } = useContext(RestaurantsContext);
  const q = useQuery();
  const restaurantId = q.get("restaurant") || "";
  const [form, setForm] = React.useState({ rating: 5, text: "" });
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    console.log("restaurantId:", restaurantId)
    if (!restaurantId) return;

    const review = {
      rating: Number(form.rating),
      text: form.text
    };

    await addReview(restaurantId, review);
    navigate(`/restaurants/${restaurantId}`);
  }

  return (
    <div className="write-review container">
      <h1 className="page-title">Write a review</h1>
      <form className="review-form" onSubmit={submit}>
        <label className="input-label">Rating</label>
        <select className="input-field" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
          {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map((r) => <option key={r} value={r}>{r} stars</option>)}
        </select>
        <label className="input-label">Review</label>
        <textarea className="input-field" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows="6" placeholder="Write your experience..."></textarea>
        <div className="form-actions">
          <button className="button button-primary" type="submit">Submit review</button>
        </div>
      </form>
    </div>
  );
}

export default WriteReviewPage;
