import React from "react";

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content container">
        <div className="footer-copyright">© {new Date().getFullYear()} Find Addis</div>
        <div className="footer-links">
          <a href="/about" className="footer-link">About</a>
          <a href="/contact" className="footer-link">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
