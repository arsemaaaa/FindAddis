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
        <Link to="/" className="nav-logo">Find Addis</Link>
      </div>

      <form className="nav-search-bar" onSubmit={submitSearch}>
        <div className="search-group">
          <label className="search-label">Find</label>
          <input
            className="search-input"
            placeholder="tacos, cheap dinner, Max's"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <button type="submit" className="search-btn" aria-label="Search">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
      </form>

      <div className="nav-right">
        <nav className="nav-actions">
          <Link to="/favorites" className="nav-link">Favorites</Link>
          <Link to="/restaurants" className="nav-link">Restaurants</Link>
        </nav>

        <div className="nav-auth">
          <Link to="/login" className="nav-link auth-login">Log In</Link>
          <Link to="/signup" className="button button-primary auth-signup">Sign Up</Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
