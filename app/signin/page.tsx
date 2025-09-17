"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";

const signInSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email"),
  password: z.string().nonempty("Password is required"),
  remember: z.boolean().optional(),
});

type FormData = z.infer<typeof signInSchema>;

export default function TeacherSignInPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError: setFieldError,
  } = useForm<FormData>({
    resolver: zodResolver(signInSchema),
  });

  const [generalError, setGeneralError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [prefilled, setPrefilled] = useState(false);

useEffect(() => {
  api.get("/teacher/profile")
    .then(() => router.push("/dashboard"))
    .catch(() => {
      const cookie = document.cookie
        .split("; ")
        .find(row => row.startsWith("rememberMe="));
      if (cookie) {
        try {
          const data = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
          setValue("email", data.email);
          setValue("password", data.password);
          setValue("remember", true);
        } catch (err) {
          console.error("Failed to parse rememberMe cookie", err);
        }
      }
      setPrefilled(true);
    });
}, [router, setValue]);

if (!prefilled) return null;

  const onSubmit = async (data: FormData) => {
    setGeneralError("");
    setLoading(true);

    try {
      await api.post("/teacher/login", data);
      router.push("/dashboard");
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Login failed";

      if (message === "No User Found!") {
        setFieldError("email", { type: "manual", message: "No account found with this email" });
      } else if (message === "Wrong password") {
        setFieldError("password", { type: "manual", message: "Password is incorrect" });
      } else {
        setGeneralError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-700 via-teal-800 to-cyan-900 text-white px-4">
      <div className="bg-white/10 rounded-2xl p-10 shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className={`px-4 py-2 rounded-xl bg-white/20 border ${
                errors.email ? "border-red-400" : "border-white/30"
              } text-white placeholder-gray-300 focus:outline-none`}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className={`px-4 py-2 rounded-xl bg-white/20 border ${
                errors.password ? "border-red-400" : "border-white/30"
              } text-white placeholder-gray-300 focus:outline-none`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2/4 -translate-y-2/4 text-gray-200 hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("remember")}
              id="remember"
              className="accent-green-500"
            />
            <label htmlFor="remember" className="text-gray-200 text-sm">
              Remember me
            </label>
          </div>

          {generalError && <p className="text-red-400 text-sm">{generalError}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`bg-green-500 px-4 py-2 rounded-xl font-semibold hover:bg-green-600 transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-200 text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="text-white underline hover:text-teal-300">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
