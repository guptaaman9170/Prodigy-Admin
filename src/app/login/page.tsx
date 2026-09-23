"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, Sparkles, Loader2 } from "lucide-react";

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

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(returnUrl);
    }
  }, [isAuthenticated, router, returnUrl]);

  // Demo auto-fill convenience helper
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

    if (!validate()) {
      return;
    }

    try {
      await login({ username: username.trim(), password });
      // Redirect handled by AuthContext or useEffect
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
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/25 mb-4">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Prodigy Admin
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Sign in to manage inventory, catalog, and products
        </p>
      </div>

      {/* Main Login Card */}
      <div className="glass-panel rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        {isExpired && (
          <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
            <span>Your session has expired. Please sign in again to continue.</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
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
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border rounded-xl text-slate-100 placeholder-slate-500 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
                  fieldErrors.username
                    ? "border-rose-500/60 focus:border-rose-500"
                    : "border-slate-700/80 focus:border-indigo-500"
                }`}
              />
            </div>
            {fieldErrors.username && (
              <p className="mt-1.5 text-xs text-rose-400">{fieldErrors.username}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
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
                placeholder="Enter your password"
                className={`w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border rounded-xl text-slate-100 placeholder-slate-500 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
                  fieldErrors.password
                    ? "border-rose-500/60 focus:border-rose-500"
                    : "border-slate-700/80 focus:border-indigo-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1.5 text-xs text-rose-400">{fieldErrors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            id="login-submit-button"
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Quick Helper */}
        <div className="mt-6 pt-5 border-t border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
            <span className="font-medium text-slate-300">Assignment Test Credentials:</span>
            <button
              type="button"
              onClick={handleAutoFill}
              className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Demo</span>
            </button>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Username:</span>
              <span className="text-slate-300 font-semibold">emilys</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Password:</span>
              <span className="text-slate-300 font-semibold">emilyspass</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <p className="mt-8 text-center text-xs text-slate-500">
        Connected to DummyJSON Auth API • Secured with Bearer Token
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Decorative Background Mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-900/20 to-violet-900/20 rounded-full blur-[120px] pointer-events-none" />
      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            <span>Loading...</span>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
