import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

function Navbar({ onSearch }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [signupOption, setSignupOption] = useState(false);
  const [loginOption, setLoginOption] = useState(false);

  const loginRef = useRef(null);
  const signupRef = useRef(null);

  // Close popups if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginRef.current && !loginRef.current.contains(event.target)) {
        setLoginOption(false);
      }
      if (signupRef.current && !signupRef.current.contains(event.target)) {
        setSignupOption(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleLogin = () => setLoginOption(!loginOption);
  const toggleSignup = () => setSignupOption(!signupOption);

  const submitSearch = (e) => {
    e.preventDefault();
    const qs = q.trim();
    if (!qs) return;
    navigate(`/search?q=${encodeURIComponent(qs)}`);
    if (onSearch) onSearch(qs);
  };

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
            placeholder="Search for restaurants, cafes..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <button type="submit" className="search-btn" aria-label="Search">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>

      <div className="nav-right">
        <nav className="nav-actions">
          <Link to="/favorites" className="nav-link">Favorites</Link>
          <Link to="/restaurants" className="nav-link">Restaurants</Link>
        </nav>

        <div className="nav-auth" style={{ display: "flex", gap: "1rem" }}>
          {user ? (
            <div className="user-menu" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link to="/profile" className="nav-link user-link">
                <span className="user-name">Hi, {user.name}</span>
              </Link>
            </div>
          ) : (
            <>
              {/* LOGIN */}
              <div ref={loginRef} style={{ position: "relative", display: "inline-block" }}>
                <Link
                  to="#"
                  onClick={(e) => { e.preventDefault(); toggleLogin(); }}
                  className="nav-link auth-login"
                >
                  Log In
                </Link>

                {loginOption && (
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    background: "white",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    borderRadius: "5px",
                    padding: "10px",
                    zIndex: 100,
                    display: "flex",
                    flexDirection: "column"
                  }}>
                    <Link to="/login" className="button button-primary auth-signup">User</Link>
                    <Link to="/OwnerLoginPage" className="button button-primary auth-signup">Owner</Link>
                  </div>
                )}
              </div>

              {/* SIGNUP */}
              <div ref={signupRef} style={{ position: "relative", display: "inline-block" }}>
                <Link
                  to="#"
                  onClick={(e) => { e.preventDefault(); toggleSignup(); }}
                  className="button button-primary auth-signup"
                >
                  Sign Up
                </Link>

                {signupOption && (
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    background: "white",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    borderRadius: "5px",
                    padding: "10px",
                    zIndex: 100,
                    display: "flex",
                    flexDirection: "column"
                  }}>
                    <Link to="/signup" className="button button-primary auth-signup">User</Link>
                    <Link to="/OwnerSignUp" className="button button-primary auth-signup">Owner</Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
