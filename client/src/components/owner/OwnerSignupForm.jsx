import React, { useState } from "react";
import axios from "axios";
import InputField from "../common/InputField";
import Button from "../common/Button";

function OwnerSignupForm({ onSignup }) {
    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await axios.post("/api/owners", {
                name: form.name,
                email: form.email,
                password: form.password,
                phoneNumber: form.phoneNumber
            });
            alert("Account created successfully!");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || err.response?.data?.message || "Server error");
        }
        if (onSignup) onSignup(form);
    }


    return (
        <form className="signup-form" onSubmit={handleSubmit}>
            <InputField name="name" label="Name" value={form.name} onChange={handleChange} placeholder="Your name" />
            <InputField name="email" label="Email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            <InputField name="phoneNumber" label="Phone Number" value={form.phoneNumber} onChange={handleChange} placeholder="+251 9XXXXXXXX" type="tel" />
            <InputField name="password" label="Password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="Choose a password" />
            <label> <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} autoComplete="new-password" />Show password</label>

            <Button type="submit">Create account</Button>
        </form>
    );
}

export default OwnerSignupForm;
