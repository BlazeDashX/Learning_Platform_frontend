"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import toast from "react-hot-toast";

const schema = z
  .object({
    name: z
      .string()
      .nonempty("Name is required")
      .regex(/^[A-Za-z\s]+$/, "Letters only"),
    email: z.string().nonempty("Email is required").email("Invalid email"),
    country: z.string().nonempty("Country is required"),
    age: z
      .number({ invalid_type_error: "Age is required" })
      .int("Must be an integer")
      .min(18, "Must be 18+"),
    gender: z.string().nonempty("Gender is required"),
    password: z.string().min(6, "At least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

type RegisterResponse = {
  message: string;
  teacher: {
    id: number;
    name: string;
    email: string;
    country: string;
    age: number;
    gender: string;
  };
};

export default function TeacherSignUpPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const { confirmPassword, ...payload } = data;

    try {
      const res = await api.post<RegisterResponse>("/teacher/register", payload);

      toast.success(res.data.message || "Account created successfully!");
      reset();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to create account"
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-700 via-teal-800 to-cyan-900 text-white relative">
      <section className="flex flex-col items-center justify-center py-24 px-4">
        <div className="bg-gradient-to-br from-green-500 via-teal-600 to-cyan-500 rounded-3xl shadow-2xl p-10 max-w-md w-full">
          <h1 className="text-4xl font-extrabold mb-6 text-center">Sign Up</h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div>
              <input
                type="text"
                placeholder="Full Name"
                {...register("name")}
                className="p-3 rounded-xl bg-white/10 text-white placeholder-gray-200 w-full"
              />
              {errors.name && (
                <div className="mt-1 text-sm text-red-300">
                  {errors.name.message}
                </div>
              )}
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className="p-3 rounded-xl bg-white/10 text-white placeholder-gray-200 w-full"
              />
              {errors.email && (
                <div className="mt-1 text-sm text-red-300">
                  {errors.email.message}
                </div>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Country"
                {...register("country")}
                className="p-3 rounded-xl bg-white/10 text-white placeholder-gray-200 w-full"
              />
              {errors.country && (
                <div className="mt-1 text-sm text-red-300">
                  {errors.country.message}
                </div>
              )}
            </div>
            <div>
              <input
                type="number"
                placeholder="Age"
                {...register("age", { valueAsNumber: true })}
                className="p-3 rounded-xl bg-white/10 text-white placeholder-gray-200 w-full"
              />
              {errors.age && (
                <div className="mt-1 text-sm text-red-300">
                  {errors.age.message}
                </div>
              )}
            </div>
            <div>
              <select
                {...register("gender")}
                className="p-3 rounded-xl bg-white/10 text-white w-full"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && (
                <div className="mt-1 text-sm text-red-300">
                  {errors.gender.message}
                </div>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                {...register("password")}
                className="p-3 rounded-xl bg-white/10 text-white placeholder-gray-200 w-full"
              />
              {errors.password && (
                <div className="mt-1 text-sm text-red-300">
                  {errors.password.message}
                </div>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword")}
                className="p-3 rounded-xl bg-white/10 text-white placeholder-gray-200 w-full"
              />
              {errors.confirmPassword && (
                <div className="mt-1 text-sm text-red-300">
                  {errors.confirmPassword.message}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-400 to-teal-500 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition"
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-center text-white/80">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="underline hover:text-green-200 transition"
            >
              Sign In
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
