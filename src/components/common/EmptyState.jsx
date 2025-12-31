import React from "react";
import { Link } from "react-router-dom";

function EmptyState({ title, message, suggestions = [], actionLabel, actionLink }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      <h2 className="empty-state-title">{title}</h2>
      <p className="empty-state-message">{message}</p>
      
      {suggestions.length > 0 && (
        <div className="empty-state-suggestions">
          <h3 className="empty-state-suggestions-title">Suggestions:</h3>
          <ul className="empty-state-suggestions-list">
            {suggestions.map((suggestion, idx) => (
              <li key={idx}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {actionLabel && actionLink && (
        <Link to={actionLink} className="button button-primary empty-state-action">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;

