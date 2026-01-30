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
    <nav className="navbar navbar-expand-lg bg-white shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand">Find Addis</Link>

        <form className="d-flex mx-auto w-50" onSubmit={submitSearch}>
          <input
            className="form-control me-2"
            placeholder="Search for restaurants, cafes..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>

        <div className="d-flex align-items-center">
          <nav className="me-3">
            <Link to="/favorites" className="nav-link d-inline">Favorites</Link>
            <Link to="/restaurants" className="nav-link d-inline">Restaurants</Link>
          </nav>

          <div className="nav-auth d-flex" style={{ gap: "0.75rem" }}>
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
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); toggleLogin(); }}
                  className="btn btn-link auth-login"
                >
                  Log In
                </a>

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
                    <Link to="/login" className="btn btn-outline-primary mb-2">User</Link>
                    <Link to="/OwnerLoginPage" className="btn btn-outline-primary">Owner</Link>
                  </div>
                )}
              </div>

              {/* SIGNUP */}
              <div ref={signupRef} style={{ position: "relative", display: "inline-block" }}>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); toggleSignup(); }}
                  className="btn btn-primary auth-signup"
                >
                  Sign Up
                </a>

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
                    <Link to="/signup" className="btn btn-outline-primary mb-2">User</Link>
                    <Link to="/OwnerSignUp" className="btn btn-outline-primary">Owner</Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      </div>
    </nav>
  );
}

export default Navbar;
