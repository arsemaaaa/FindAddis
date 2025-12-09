import React from "react";
import HeroSection from "../components/home/HeroSection";
import CategoryCards from "../components/home/CategoryCards";
import RestaurantList from "../components/restaurant/RestaurantList";
import FeaturedCard from "../components/home/FeaturedCard";
import { useContext } from "react";
import RestaurantsContext from "../context/RestaurantsContext";



function Home() {
  const { restaurants } = useContext(RestaurantsContext);

  function handleQuickSearch(q) {
    // for now: navigate to search page by location handled via router in navbar
    window.location.href = `/search?q=${encodeURIComponent(q)}`;
  }

  return (
    <main className="home-page">
      <HeroSection onQuickSearch={handleQuickSearch} />
      <section className="home-section container">
        <h2 className="section-title">Popular categories</h2>
        <CategoryCards />
      </section>

      <section className="home-section container">
        <h2 className="section-title">Featured restaurants</h2>
        <div className="featured-row">
          {restaurants.slice(0, 6).map((r) => (
            <FeaturedCard key={r.id} restaurant={r} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
