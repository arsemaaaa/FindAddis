import React from "react";

function UserProfile({ user }) {
  if (!user) return <div className="user-profile-empty">No user</div>;
  return (
    <div className="user-profile">
      <div className="user-avatar-placeholder">{user.name?.[0] ?? "U"}</div>
      <div className="user-info">
        <div className="user-name">{user.name}</div>
        <div className="user-email">{user.email}</div>
      </div>
    </div>
  );
}

export default UserProfile;
