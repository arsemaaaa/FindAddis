import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import InputField from "../common/InputField";
import AuthContext from "../../context/AuthContext";
import { useContext } from "react";



function Navbar({ onSearch }) {
  const { user } = useContext(AuthContext);
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
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link to="/" className="navbar-brand">Find Addis</Link>

        <form className="d-flex me-auto" onSubmit={submitSearch} role="search">
          <input
            className="form-control me-2"
            placeholder="Search for restaurants, cafes..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="submit" className="btn btn-outline-secondary" aria-label="Search">Search</button>
        </form>

        <div className="d-flex align-items-center">
          <nav className="me-3">
            <Link to="/favorites" className="nav-link d-inline">Favorites</Link>
            <Link to="/restaurants" className="nav-link d-inline">Restaurants</Link>
          </nav>

          <div className="nav-auth">
            {user ? (
              <div className="user-menu d-flex align-items-center" style={{ gap: '1rem' }}>
                <Link to="/profile" className="nav-link user-link">Hi, {user.name}</Link>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-link">Log In</Link>
                <Link to="/signup" className="btn btn-primary ms-2">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
