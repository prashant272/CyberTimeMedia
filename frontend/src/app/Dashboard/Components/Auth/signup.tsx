"use client";

import React, {
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { Bounce, toast } from "react-toastify";
import { UserContext } from "@/app/Dashboard/Context/ManageUserContext";
import {
  Users,
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Loader2,
  Key,
} from "lucide-react";
import { AuthChildProps } from "./types";

interface SignUpProps {
  setMode: (mode: string) => void;
}

type Role = "USER" | "ADMIN";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  role: Role;
  profilePicture?: string;
  secretKey: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

interface SignUpResponse {
  status: number;
  data?: {
    success?: boolean;
    user?: any;
    msg?: string;
  };
}

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) {
    const maybeMessage = (err as { message?: unknown }).message;
    if (typeof maybeMessage === "string") return maybeMessage;
  }
  return "Something went wrong";
};

export const SignUp: React.FC<AuthChildProps> = ({ setMode }) => {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    role: "USER",
    secretKey: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { UserSignUp } = useContext(UserContext) as any;

  const isValid = useMemo(
    () => ({
      email: EMAIL_REGEX.test(formData.email),
      password: PASSWORD_REGEX.test(formData.password),
    }),
    [formData]
  );

  // Secret key is now required for ALL roles
  const isFormValid =
    formData.name.trim() &&
    isValid.email &&
    isValid.password &&
    formData.secretKey.trim();

  const handleChange = useCallback(
    (field: keyof SignUpFormData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value as any }));
      },
    []
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.size < 2 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (ev) =>
          setFormData((prev) => ({
            ...prev,
            profilePicture: ev.target?.result as string,
          }));
        reader.readAsDataURL(file);
        toast.success("Profile picture selected!", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        toast.error("Image must be under 2MB", {
          position: "top-center",
          transition: Bounce,
        });
      }
    },
    []
  );

  const handleSignUp = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!isFormValid) {
        toast.error("Please fill all fields correctly", {
          position: "top-center",
          transition: Bounce,
        });
        return;
      }

      try {
        setLoading(true);

        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          ProfilePicture: formData.profilePicture,
          secretKey: formData.secretKey, // Always send secret key
        };

        const signupRes: SignUpResponse = await UserSignUp(payload);

        if (signupRes.status === 201) {
          toast.success("🎉 Account created successfully! Welcome aboard!", {
            position: "top-center",
            autoClose: 3000,
            transition: Bounce,
          });
          setTimeout(() => setMode("signin"), 1500);
        } else if (signupRes.status === 409) {
          toast.error(signupRes.data?.msg || "User already exists", {
            position: "top-center",
            transition: Bounce,
          });
        } else if (signupRes.status === 401) {
          toast.error(signupRes.data?.msg || "Invalid secret key", {
            position: "top-center",
            transition: Bounce,
          });
        } else {
          toast.error(signupRes.data?.msg || "Registration failed", {
            position: "top-center",
            transition: Bounce,
          });
        }
      } catch (error: unknown) {
        toast.error(getErrorMessage(error) || "Registration failed", {
          position: "top-center",
          transition: Bounce,
        });
      } finally {
        setLoading(false);
      }
    },
    [formData, isFormValid, UserSignUp, setMode]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,#0f172a_0%,#1e1b4b_50%,#0f172a_100%)] p-4 font-sans">
      <div className="w-full max-w-[380px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-7 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)]">
        <div className="text-center mb-7">
          <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Users className="w-7 h-7 text-teal-400" />
          </div>
          <h2 className="text-[1.75rem] font-bold bg-gradient-to-r from-teal-400 to-violet-400 bg-clip-text text-transparent">Create Account</h2>
        </div>

        <form onSubmit={handleSignUp} className="flex flex-col gap-3.5">
          <div className="relative">
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  role: e.target.value as Role,
                }))
              }
              className="w-full p-[0.625rem_1rem_0.625rem_2.25rem] bg-white/8 border border-white/15 rounded-xl text-white text-[0.875rem] font-medium appearance-none cursor-pointer duration-200 focus:outline-none focus:border-teal-400 focus:ring-3 focus:ring-teal-400/40 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <option value="USER" className="bg-[#0f172a] text-white">👤 User</option>
              <option value="ADMIN" className="bg-[#0f172a] text-white">🛡️ Admin</option>
            </select>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400">
              {formData.role === "USER" ? <Users className="w-4 h-4 text-blue-400" /> : <Shield className="w-4 h-4 text-orange-400" />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange("name")}
                className="w-full p-[0.625rem_1rem_0.625rem_2.25rem] bg-white/8 border border-white/15 rounded-xl text-white text-[0.875rem] transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:border-teal-400 focus:ring-3 focus:ring-teal-400/40 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading}
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange("email")}
                className={`w-full p-[0.625rem_1rem_0.625rem_2.25rem] bg-white/8 border border-white/15 rounded-xl text-white text-[0.875rem] transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:border-teal-400 focus:ring-3 focus:ring-teal-400/40 disabled:opacity-60 disabled:cursor-not-allowed ${!isValid.email && formData.email ? "!border-red-400 !ring-red-400/20" : ""}`}
                disabled={loading}
              />
            </div>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password (8+ chars, A-Z, a-z, 0-9, @$)"
              value={formData.password}
              onChange={handleChange("password")}
              className={`w-full p-[0.625rem_1rem_0.625rem_2.25rem] bg-white/8 border border-white/15 rounded-xl text-white text-[0.875rem] transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:border-teal-400 focus:ring-3 focus:ring-teal-400/40 disabled:opacity-60 disabled:cursor-not-allowed ${!isValid.password && formData.password ? "!border-red-400 !ring-red-400/20" : ""}`}
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

          {/* Secret Key Input - Required for ALL roles */}
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showSecretKey ? "text" : "password"}
              placeholder="Secret Key (Required)"
              value={formData.secretKey}
              onChange={handleChange("secretKey")}
              className="w-full p-[0.625rem_1rem_0.625rem_2.25rem] bg-white/8 border border-white/15 rounded-xl text-white text-[0.875rem] transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:border-teal-400 focus:ring-3 focus:ring-teal-400/40 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowSecretKey((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none text-slate-400 cursor-pointer p-0 hover:text-teal-400"
            >
              {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <label className="flex items-center justify-center w-full h-12 border-2 border-dashed border-white/30 rounded-xl bg-white/5 text-slate-400 text-[0.75rem] cursor-pointer transition-all duration-200 hover:border-teal-400 hover:bg-teal-400/10 hover:text-teal-400">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
            />
            {formData.profilePicture ? (
              <img
                src={formData.profilePicture}
                alt="Preview"
                className="w-8 h-8 rounded-full object-cover mr-2 border border-teal-400"
              />
            ) : (
              <ImageIcon className="w-4 h-4 mr-1" />
            )}
            {formData.profilePicture ? "Change" : "Photo"} (Optional)
          </label>

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="w-full flex items-center justify-center gap-2 p-[0.75rem_1.25rem] bg-gradient-to-r from-teal-600 to-teal-800 text-white text-[0.875rem] font-semibold rounded-xl shadow-[0_4px_12px_rgba(45,212,191,0.25)] transition-all duration-200 mt-2 hover:not-disabled:from-teal-700 hover:not-disabled:to-teal-600 hover:not-disabled:-translate-y-0.5 hover:not-disabled:shadow-[0_8px_20px_rgba(45,212,191,0.35)] disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center text-[0.75rem] text-slate-400 mt-6 pt-4 border-t border-white/5">
          Already have account?{" "}
          <button
            onClick={() => setMode("signin")}
            className="text-teal-400 font-semibold bg-none border-none cursor-pointer underline hover:text-teal-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
