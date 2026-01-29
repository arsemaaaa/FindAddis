import React from "react";
import HeroSection from "../components/home/HeroSection";
import CategoryCards from "../components/home/CategoryCards";
import RestaurantList from "../components/restaurant/RestaurantList";
import FeaturedCard from "../components/home/FeaturedCard";
import { useContext } from "react";
import RestaurantsContext from "../context/RestaurantsContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const { restaurants } = useContext(RestaurantsContext);
  const navigate = useNavigate();

  function handleQuickSearch(q) {
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <main className="home-page">
      <HeroSection onQuickSearch={handleQuickSearch} />

      <section className="home-section container">
        <h2 className="section-title">Popular categories</h2>
        <CategoryCards />
      </section>

      <section className="home-section container">
        <h2 className="section-title">Popular near you</h2>
        <div className="featured-row">
          {restaurants && restaurants.filter(r => r.category === 'Ethiopian').slice(0, 4).map((r) => (
            <FeaturedCard key={r.id} restaurant={r} />
          ))}
        </div>
      </section>

      <section className="home-section container">
        <h2 className="section-title">Top rated in Addis</h2>
        <div className="featured-row">
          {[...restaurants].sort((a, b) => b.rating - a.rating).slice(0, 4).map((r) => (
            <FeaturedCard key={r.id} restaurant={r} />
          ))}
        </div>
      </section>

      <section className="home-section container">
        <h2 className="section-title">Trending this week</h2>
        <div className="featured-row">
          {[...restaurants].sort(() => 0.5 - Math.random()).slice(0, 4).map((r) => (
            <FeaturedCard key={r.id} restaurant={r} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
