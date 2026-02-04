import React from "react";
import { useState } from "react";
import InputField from "../common/InputField";
import Button from "../common/Button";

function SignupForm({ onSignup }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        return;
      }
      alert("Account created successfully!");
    } catch (err) {

      console.error(err);
      alert("Server error");
    }
    if (onSignup) onSignup(form);
  }

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <InputField name="name" label="Name" value={form.name} onChange={handleChange} placeholder="Your name" />
      <InputField name="email" label="Email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
      <InputField name="password" label="Password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="Choose a password" />
      <label> <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />Show password</label>

      <Button type="submit">Create account</Button>
    </form>
  );
}

export default SignupForm;
