import React from "react";
import LoginForm from "../components/user/LoginForm";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = React.useState(null);

  async function handleLogin(credentials) {
    setError(null);
    try {
      await login(credentials);
      navigate("/");
    } catch (e) {
      setError(e);
    }
  }

  return (
    <div className="login-page container">
      <h1 className="page-title">Log in</h1>
      {error && <div className="alert-error" style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', background: '#ffebee', borderRadius: '4px' }}>{error}</div>}
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}

export default Login;
