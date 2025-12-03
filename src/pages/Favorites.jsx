import React from "react";

function Favorites() {
  // For now this is static - later wire to user favorites
  return (
    <div className="favorites-page container">
      <h1 className="page-title">Favorites</h1>
      <p className="muted">You haven't saved any restaurants yet.</p>
    </div>
  );
}

export default Favorites;
