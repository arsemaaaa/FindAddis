import React from "react";

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div>© {new Date().getFullYear()} Find Addis</div>
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
