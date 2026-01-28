import React from "react";
import SignupForm from "../components/user/SignupForm";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Signup() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSignup(details) {
    try {
      await signup(details);
      navigate("/");
    } catch (e) {
      alert(e);
    }
  }

  return (
    <div className="signup-page container">
      <h1 className="page-title">Create an account</h1>
      <SignupForm onSignup={handleSignup} />
    </div>
  );
}

export default Signup;
