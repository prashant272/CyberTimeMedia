"use client";

import React, { useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bounce, toast } from "react-toastify";
import { UserContext } from "@/app/Dashboard/Context/ManageUserContext";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Key } from "lucide-react";
import { AuthChildProps } from "./types";

type Role = "USER" | "ADMIN" | "SUPER_ADMIN";

interface SignInProps {
  setMode: (mode: string) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LoginResponse {
  status: number;
  data?: any;
  msg?: string;
  success?: boolean;
}

export const SignIn: React.FC<AuthChildProps> = ({ setMode }) => {
  const [formData, setFormData] = useState({
    role: "USER" as Role,
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { Userdispatch, UserSignIn } = useContext(UserContext) as any;

  const isValidEmail = EMAIL_REGEX.test(formData.email);
  const isFormValid =
    formData.email.trim() &&
    formData.password.trim() &&
    isValidEmail;

  const handleChange = useCallback(
    (field: keyof typeof formData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value as any }));
      },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isFormValid) {
        toast.error("Please fill all required fields with valid data", {
          position: "top-center",
          transition: Bounce,
        });
        return;
      }

      try {
        setLoading(true);

        const loginPayload: any = {
          email: formData.email,
          password: formData.password,
          role: formData.role,
        };

        const result: LoginResponse | null = await UserSignIn(loginPayload);

        if (!result) {
          toast.error("Unexpected error during login", { position: "top-center", transition: Bounce });
          return;
        }

        const { status, data } = result;

        switch (status) {
          case 200: {
            toast.success(data?.msg || "Welcome", {
              position: "top-center",
              autoClose: 3000,
              transition: Bounce,
            });

            Userdispatch({ type: "SIGN_IN", payload: data });
            router.push("/Dashboard/pages/Home");
            break;
          }

          case 400:
            toast.error(data?.msg || "Email and password are required", {
              position: "top-center",
              transition: Bounce,
            });
            break;

          case 401:
            toast.error(data?.msg || "Wrong password or invalid credentials", {
              position: "top-center",
              transition: Bounce,
            });
            break;

          case 403:
            toast.error(data?.msg || "Account is deactivated", {
              position: "top-center",
              transition: Bounce,
            });
            break;

          case 404:
            toast.error(data?.msg || "User does not exist", {
              position: "top-center",
              transition: Bounce,
            });
            break;

          case 500:
          default:
            toast.error(data?.msg || "Server error during login", {
              position: "top-center",
              transition: Bounce,
            });
            break;
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("Network error, please try again", {
          position: "top-center",
          transition: Bounce,
        });
      } finally {
        setLoading(false);
      }
    },
    [formData, isFormValid, UserSignIn, Userdispatch, router]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,#0f172a_0%,#1e1b4b_50%,#0f172a_100%)] p-4 font-sans">
      <div className="w-full max-w-[380px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-7 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)]">
        <div className="text-center mb-7">
          <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Lock className="w-7 h-7 text-teal-400" />
          </div>
          <h2 className="text-[1.75rem] font-bold bg-gradient-to-r from-teal-400 to-violet-400 bg-clip-text text-transparent">Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="relative">
            <select
              value={formData.role}
              onChange={(e) => setFormData((prev) => ({
                ...prev,
                role: e.target.value as Role,
              }))}
              className="w-full p-[0.625rem_1rem_0.625rem_2.25rem] bg-white/8 border border-white/15 rounded-xl text-white text-[0.875rem] font-medium appearance-none cursor-pointer duration-200 focus:outline-none focus:border-teal-400 focus:ring-3 focus:ring-teal-400/40 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <option value="USER" className="bg-[#0f172a] text-white">👤 User</option>
              <option value="ADMIN" className="bg-[#0f172a] text-white">🛡️ Admin</option>
              <option value="SUPER_ADMIN" className="bg-[#0f172a] text-white">👑 Super Admin</option>
            </select>
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange("email")}
              className={`w-full p-[0.625rem_1rem_0.625rem_2.25rem] bg-white/8 border border-white/15 rounded-xl text-white text-[0.875rem] transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:border-teal-400 focus:ring-3 focus:ring-teal-400/40 disabled:opacity-60 disabled:cursor-not-allowed ${!isValidEmail && formData.email ? "!border-red-400 !ring-red-400/20" : ""}`}
              disabled={loading}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange("password")}
              className="w-full p-[0.625rem_1rem_0.625rem_2.25rem] bg-white/8 border border-white/15 rounded-xl text-white text-[0.875rem] transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:border-teal-400 focus:ring-3 focus:ring-teal-400/40 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none text-slate-400 cursor-pointer p-0 hover:text-teal-400"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>


          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="w-full flex items-center justify-center gap-2 p-[0.75rem_1.25rem] bg-gradient-to-r from-teal-600 to-teal-800 text-white text-[0.875rem] font-semibold rounded-xl shadow-[0_4px_12px_rgba(45,212,191,0.25)] transition-all duration-200 mt-2 hover:not-disabled:from-teal-700 hover:not-disabled:to-teal-600 hover:not-disabled:-translate-y-0.5 hover:not-disabled:shadow-[0_8px_20px_rgba(45,212,191,0.35)] disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-5 pt-4 border-t border-white/5">
          <p className="mt-2 text-[0.75rem] text-slate-400">
            New here?{" "}
            <button
              onClick={() => setMode("signup")}
              className="text-teal-400 text-[0.75rem] font-medium bg-none border-none cursor-pointer transition-colors duration-200 hover:text-teal-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
