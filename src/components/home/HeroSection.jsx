import React, { useEffect, useState } from "react";
import Button from "../common/Button";
import hero1 from '../../assets/heroSection.png';
import hero2 from '../../assets/heroSection2.jpg';
import hero3 from '../../assets/heroSection3.jpg';
import hero4 from '../../assets/heroSection4.jpg';
import hero5 from '../../assets/herosection5.jpg';

function HeroSection({ onQuickSearch }) {
  const slides = [hero1, hero2, hero3, hero4, hero5].filter(Boolean);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }

  function next() {
    setIndex((i) => (i + 1) % slides.length);
  }

  return (
    <section className="hero-section">
      <div className="hero-bg" style={{ backgroundImage: `url('${encodeURI(slides[index])}')` }} aria-hidden="true" />

      <div className="hero-overlay" />

      <div className="hero-content">
        <div className="hero-left">
          <h1 className="hero-title">Find the best restaurants in Addis Ababa</h1>
          <p className="hero-sub">Local favorites, menus, and honest reviews — all in one place.</p>
          <div className="hero-actions">
            <Button onClick={() => onQuickSearch && onQuickSearch("Ethiopian")}>Explore Ethiopian</Button>
            <Button className="button-ghost" onClick={() => onQuickSearch && onQuickSearch("Cafe")}>Cafés</Button>
          </div>
        </div>
      </div>

      <button className="hero-nav hero-prev" onClick={prev} aria-label="Previous slide">‹</button>
      <button className="hero-nav hero-next" onClick={next} aria-label="Next slide">›</button>

      <div className="hero-indicators hero-indicators-bottom">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroSection;
