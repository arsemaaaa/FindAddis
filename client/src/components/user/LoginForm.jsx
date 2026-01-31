import React from "react";
import InputField from "../common/InputField";
import Button from "../common/Button";

function LoginForm({ onLogin }) {
  const [form, setForm] = React.useState({ email: "", password: "", role: "user" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (onLogin) onLogin(form);
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <InputField name="email" label="Email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
      <InputField name="password" label="Password" type="password" value={form.password} onChange={handleChange} placeholder="••••••" />

      <Button type="submit">Log in</Button>
    </form>
  );
}

export default LoginForm;
