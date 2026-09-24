"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Layers,
  Sparkles,
  Loader2,
} from "lucide-react";

function LoginForm() {
  const { login, isAuthenticated, isSubmitting } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});

  const isExpired = searchParams.get("expired") === "1";
  const returnUrl = searchParams.get("returnUrl") || "/products";

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(returnUrl);
    }
  }, [isAuthenticated, router, returnUrl]);

  const handleAutoFill = () => {
    setUsername("emilys");
    setPassword("emilyspass");
    setFieldErrors({});
    setErrorMessage(null);
  };

  const validate = () => {
    const errors: { username?: string; password?: string } = {};
    if (!username.trim()) {
      errors.username = "Username is required";
    }
    if (!password) {
      errors.password = "Password is required";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);
    if (!validate()) return;

    try {
      await login({ username: username.trim(), password });
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMessage(
        error?.message || "Invalid credentials. Please verify your username and password."
      );
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/25 mb-4 text-white">
          <Layers className="w-8 h-8" />
        </div>
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            PulseStack
          </h1>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 uppercase tracking-wider">
            PRO
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Enterprise Store Operations &amp; Inventory Management
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        {isExpired && (
          <div className="mb-6 flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <span>Your session has expired. Please sign in again to continue.</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 flex items-start gap-2.5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (fieldErrors.username) {
                    setFieldErrors((prev) => ({ ...prev, username: undefined }));
                  }
                }}
                disabled={isSubmitting}
                placeholder="Enter username (e.g. emilys)"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-slate-900 placeholder-slate-400 text-xs font-medium focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${
                  fieldErrors.username ? "border-rose-400" : "border-slate-200"
                }`}
              />
            </div>
            {fieldErrors.username && (
              <p className="mt-1 text-xs text-rose-600">{fieldErrors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                disabled={isSubmitting}
                placeholder="Enter password"
                className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-slate-900 placeholder-slate-400 text-xs font-medium focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${
                  fieldErrors.password ? "border-rose-400" : "border-slate-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-rose-600">{fieldErrors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            id="login-submit-button"
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition-all transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials Assistant */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-600">Assignment Credentials:</span>
            <button
              type="button"
              onClick={handleAutoFill}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Demo</span>
            </button>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">User:</span>
              <span className="font-bold text-slate-800">emilys</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Pass:</span>
              <span className="font-bold text-slate-800">emilyspass</span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        Connected to DummyJSON Auth API • Secured with Bearer Token
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12">
      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span>Loading...</span>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
