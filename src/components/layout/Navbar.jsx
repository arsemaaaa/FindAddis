import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import InputField from "../common/InputField";
import { useDebounce } from "../../hooks/useDebounce";
import { useLocalStorage } from "../../hooks/useLocalStorage";

function Navbar({ onSearch }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches] = useLocalStorage("fa_recent_searches", []);
  const location = useLocation();
  const searchRef = useRef(null);
  const debouncedQuery = useDebounce(q, 300);

  // Get search suggestions from context or restaurants
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    // This would ideally come from RestaurantsContext
    // For now, we'll create basic suggestions
    const lower = debouncedQuery.toLowerCase();
    const categories = ["Ethiopian", "Italian", "Cafe", "Fast food"];
    const categoryMatches = categories.filter(cat => cat.toLowerCase().includes(lower));
    
    setSuggestions(categoryMatches.slice(0, 5));
  }, [debouncedQuery]);

  function submitSearch(e) {
    e.preventDefault();
    const qs = q.trim();
    if (!qs) return;
    
    // Save to recent searches
    const updated = [qs, ...recentSearches.filter(s => s !== qs)].slice(0, 5);
    localStorage.setItem("fa_recent_searches", JSON.stringify(updated));
    
    navigate(`/search?q=${encodeURIComponent(qs)}`);
    setShowSuggestions(false);
    if (onSearch) onSearch(qs);
  }

  function handleSuggestionClick(suggestion) {
    setQ(suggestion);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
  }

  function handleRecentSearchClick(search) {
    setQ(search);
    navigate(`/search?q=${encodeURIComponent(search)}`);
    setShowSuggestions(false);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="nav-container">
      <div className="nav-left">
        <Link to="/" className="nav-logo">Find Addis</Link>
      </div>

      <form className="nav-search-bar" onSubmit={submitSearch} ref={searchRef}>
        <div className="search-group">
          <label className="search-label">Find</label>
          <input
            className="search-input"
            placeholder="tacos, cheap dinner, Max's"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
        </div>
        <button type="submit" className="search-btn" aria-label="Search">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
        
        {(showSuggestions && (suggestions.length > 0 || recentSearches.length > 0)) && (
          <div className="search-suggestions">
            {suggestions.length > 0 && (
              <div className="suggestions-section">
                <div className="suggestions-header">Suggestions</div>
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            {recentSearches.length > 0 && (
              <div className="suggestions-section">
                <div className="suggestions-header">Recent searches</div>
                {recentSearches.slice(0, 5).map((search, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="suggestion-item"
                    onClick={() => handleRecentSearchClick(search)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                    {search}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
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
