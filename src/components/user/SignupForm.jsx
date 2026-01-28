import React from "react";
import InputField from "../common/InputField";
import Button from "../common/Button";

function SignupForm({ onSignup }) {
  const [form, setForm] = React.useState({ name: "", email: "", password: "", role: "user" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (onSignup) onSignup(form);
  }

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <InputField name="name" label="Name" value={form.name} onChange={handleChange} placeholder="Your name" className="mb-3" />
      <InputField name="email" label="Email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="mb-3" />
      <InputField name="password" label="Password" type="password" value={form.password} onChange={handleChange} placeholder="Choose a password" className="mb-3" />
      <div className="form-row mb-3">
        <label className="input-label form-label">Role</label>
        <select name="role" value={form.role} onChange={handleChange} className="form-select">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <Button type="submit">Create account</Button>
    </form>
  );
}

export default SignupForm;
