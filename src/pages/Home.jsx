import React from "react";
import HeroSection from "../components/home/HeroSection";
import CategoryCards from "../components/home/CategoryCards";
import RestaurantList from "../components/restaurant/RestaurantList";
import FeaturedCard from "../components/home/FeaturedCard";
import RecentlyViewed from "../components/home/RecentlyViewed";
import { useContext } from "react";
import RestaurantsContext from "../context/RestaurantsContext";
import { useNavigate, Link } from "react-router-dom";

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
        <div className="section-header">
          <h2 className="section-title">Featured restaurants</h2>
          <Link to="/restaurants" className="section-view-all">View all →</Link>
        </div>
        <div className="featured-row">
          {restaurants.slice(0, 6).map((r) => (
            <FeaturedCard key={r.id} restaurant={r} />
          ))}
        </div>
      </section>

      <RecentlyViewed />
    </main>
  );
}

export default Home;
