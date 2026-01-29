import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="notfound-page container">
      <h1>Page not found</h1>
      <p>Sorry — we couldn't find that page.</p>
      <Link className="button button-primary" to="/">Go home</Link>
    </div>
  );
}

export default NotFound;
