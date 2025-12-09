import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import InputField from "../common/InputField";



function Navbar({ onSearch }) {
  const navigate = useNavigate();
  const [q, setQ] = React.useState("");
  const location = useLocation();

  function submitSearch(e) {
    e.preventDefault();
    const qs = q.trim();
    if (!qs) return;
    navigate(`/search?q=${encodeURIComponent(qs)}`);
    if (onSearch) onSearch(qs);
  }

  return (
    <header className="nav-container">
      <div className="nav-left">
        {location.pathname !== "/" && (
          <button className="nav-back" onClick={() => navigate(-1)} aria-label="Go back" title="Back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <Link to="/" className="nav-logo">Find Addis</Link>
      </div>

      <form className="nav-search" onSubmit={submitSearch}>
        <InputField
          name="site-search"
          placeholder="Search restaurants, dishes, neighborhoods..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </form>

      <nav className="nav-links">
        <Link to="/restaurants" className="nav-link">Restaurants</Link>
        <Link to="/favorites" className="nav-link">Favorites</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/login" className="nav-link button-small">Log in</Link>
      </nav>
    </header>
  );
}

export default Navbar;
