import React from "react";
import InputField from "../common/InputField";
import Button from "../common/Button";

function SignupForm({ onSignup }) {
  const [form, setForm] = React.useState({ name: "", email: "", password: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (onSignup) onSignup(form);
  }

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <InputField name="name" label="Name" value={form.name} onChange={handleChange} placeholder="Your name" />
      <InputField name="email" label="Email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
      <InputField name="password" label="Password" type="password" value={form.password} onChange={handleChange} placeholder="Choose a password" />
      <Button type="submit">Create account</Button>
    </form>
  );
}

export default SignupForm;
