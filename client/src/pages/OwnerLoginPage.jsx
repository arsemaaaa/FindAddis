import React from "react";
import LoginForm from "../components/user/LoginForm";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function OwnerLoginPage() {
  const { ownerLogin } = useContext(AuthContext);
  const navigate = useNavigate('/addRestaurant');

  async function handleLogin(credentials) {
    try {
      await ownerLogin(credentials);
      navigate("/OwnerDashBoard");
    } catch (e) {
      alert(e);
    }
  }

  return (
    <div className="login-page container">
      <h1 className="page-title">Log in</h1>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}

export default OwnerLoginPage;
