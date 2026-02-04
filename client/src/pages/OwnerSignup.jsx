import React from "react";
import OwnerSignupForm from "../components/owner/OwnerSignupForm";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function OwnerSignUp() {
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
      <OwnerSignupForm onSignup={handleSignup} />
    </div>
  );
}

export default OwnerSignUp;
