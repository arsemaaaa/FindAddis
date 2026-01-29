import React from "react";
import SignupForm from "../components/user/SignupForm";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Signup() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = React.useState(null);

  async function handleSignup(details) {
    setError(null);
    try {
      const userData = await signup(details);
      // Redirect Admins and Vendors directly to their dashboard
      if (userData.role === 'admin' || userData.role === 'restaurant_owner') {
        navigate("/profile");
      } else {
        navigate("/");
      }
    } catch (e) {
      setError(e);
    }
  }

  return (
    <div className="signup-page container">
      <h1 className="page-title">Create an account</h1>
      {error && <div className="alert-error" style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', background: '#ffebee', borderRadius: '4px' }}>{error}</div>}
      <SignupForm onSignup={handleSignup} />
    </div>
  );
}

export default Signup;
