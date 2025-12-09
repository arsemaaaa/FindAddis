import React from "react";

function Contact() {
  return (
    <div className="contact-page container">
      <h1 className="page-title">Contact us</h1>
      <p>For partnership or support, email <a href="mailto:help@findaddis.example">help@findaddis.example</a> or call +251 911 000 000.</p>
      <p>Or use this quick form:</p>
      <form className="contact-form">
        <label className="input-label">Your email</label>
        <input className="input-field" type="email" placeholder="you@example.com" />
        <label className="input-label">Message</label>
        <textarea className="input-field" rows="6" placeholder="Message..." />
        <div className="form-actions">
          <button className="button button-primary" type="button">Send</button>
        </div>
      </form>
    </div>
  );
}

export default Contact;
