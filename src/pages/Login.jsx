import React from "react";
import LoginForm from "../components/user/LoginForm";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleLogin(credentials) {
    try {
      await login(credentials);
      navigate("/");
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

export default Login;
