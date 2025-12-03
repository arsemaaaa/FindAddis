import React from "react";
import UserProfile from "../components/user/UserProfile";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function UserProfilePage() {
  const { user } = useContext(AuthContext);

  if (!user) return <div className="container"><h2>Please log in to view your profile.</h2></div>;

  return (
    <div className="profile-page container">
      <h1 className="page-title">Profile</h1>
      <UserProfile user={user} />
      <section className="profile-section">
        <h3>My reviews</h3>
        <p className="muted">Reviews will appear here.</p>
      </section>
    </div>
  );
}

export default UserProfilePage;
