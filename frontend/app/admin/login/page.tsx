"use client";

import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login submitted:", form);
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input type="text" name="username" value={form.username} onChange={handleChange} />
        </div>

        <div>
          <label>Password: </label>
          <input type="password" name="password" value={form.password} onChange={handleChange} />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
