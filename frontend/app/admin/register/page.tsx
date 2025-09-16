"use client";

import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    password: "",
    dob: "",
    socialLink: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    fullName: "",
    password: "",
    dob: "",
    socialLink: "",
  });

  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {
      username: "",
      fullName: "",
      password: "",
      dob: "",
      socialLink: "",
    };

    if (!form.username) newErrors.username = "Username is required";

    if (!form.fullName) newErrors.fullName = "Full Name is required";
    else if (!/^[A-Za-z\s]+$/.test(form.fullName))
      newErrors.fullName = "Full Name must only contain letters";

    if (!form.password) newErrors.password = "Password is required";
    else if (!/[@#$&]/.test(form.password))
      newErrors.password = "Password must include @, #, $ or &";

    if (!form.dob) newErrors.dob = "Date of Birth is required";

    try {
      if (form.socialLink) new URL(form.socialLink);
    } catch {
      newErrors.socialLink = "Invalid social media link";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setErrors({
      username: "",
      fullName: "",
      password: "",
      dob: "",
      socialLink: "",
    });

    const validationErrors = validateForm();
    setErrors(validationErrors);


    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== ""
    );
    if (hasErrors) return;

    try {
      const response = await axios.post("http://localhost:3000/admin", form);
      setSuccess("Registration successful!");

      setForm({
        username: "",
        fullName: "",
        password: "",
        dob: "",
        socialLink: "",
      });

      console.log("Backend response:", response.data);
    } catch (err: any) {
      setSuccess("");

      // Check if backend returns field-specific errors
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        // fallback
        setErrors((prev) => ({ ...prev, username: err.response.data.message }));
      } else {
        setErrors((prev) => ({
          ...prev,
          username: "Failed to register. Try again.",
        }));
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Registration</h2>

        {success && (
          <p className="text-green-600 text-center mb-4">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Username:</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Full Name:</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Password:</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Date of Birth:</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.dob && (
              <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Social Media Link:</label>
            <input
              type="text"
              name="socialLink"
              value={form.socialLink}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.socialLink && (
              <p className="text-red-500 text-sm mt-1">{errors.socialLink}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
