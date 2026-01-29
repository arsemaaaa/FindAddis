import React from "react";
import InputField from "../common/InputField";
import Button from "../common/Button";

function SignupForm({ onSignup }) {
  const [form, setForm] = React.useState({ name: "", email: "", password: "", role: "user", adminSecret: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Frontend Email Validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address");
      return;
    }

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
          <option value="restaurant_owner">Restaurant Owner (Vendor)</option>
        </select>
      </div>

      {(form.role === "admin" || form.role === "restaurant_owner") && (
        <InputField
          name="adminSecret"
          label={form.role === "admin" ? "Admin Secret Code" : "Vendor Secret Code"}
          type="password"
          value={form.adminSecret}
          onChange={handleChange}
          placeholder={form.role === "admin" ? "Enter admin secret key" : "Enter vendor secret key"}
        />
      )}

      <Button type="submit">Create account</Button>
    </form>
  );
}

export default SignupForm;
