import React from "react";
import Button from "../common/Button";

function HeroSection({ onQuickSearch }) {
  return (
    <section className="hero-section">
      <div className="hero-left">
        <h1 className="hero-title">Find the best restaurants in Addis Ababa</h1>
        <p className="hero-sub">Local favorites, menus, and honest reviews — all in one place.</p>
        <div className="hero-actions">
          <Button onClick={() => onQuickSearch && onQuickSearch("Ethiopian")}>Explore Ethiopian</Button>
          <Button className="button-ghost" onClick={() => onQuickSearch && onQuickSearch("Cafe")}>Cafés</Button>
        </div>
      </div>
      <div className="hero-right">
        <div className="hero-image-placeholder">Photo</div>
      </div>
    </section>
  );
}

export default HeroSection;
