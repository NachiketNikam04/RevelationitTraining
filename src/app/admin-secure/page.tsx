"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminSecurePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        // The server successfully set the HTTP-only cookie!
        // Now we redirect the browser to the protected dashboard.
        router.push("/dashboard");
      } else {
        setError("Invalid Admin ID or Password.");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-6 relative overflow-hidden">
      {/* Background Decoratives */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl border border-gray-100 relative z-10">
        <div className="text-brand-orange bg-brand-orange/10 p-4 rounded-full w-fit mx-auto mb-6">
          <Lock className="w-6 h-6" />
        </div>
        
        <h1 className="text-[28px] font-bold text-brand-dark leading-tight text-center">
          Admin Portal
        </h1>
        <p className="text-[15px] text-brand-muted text-center mt-2 mb-8">
          Enter your credentials to access the dashboard.
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="text-[13px] font-bold text-brand-dark mb-1.5 block">
              Admin ID
            </label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Admin ID"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="text-[13px] font-bold text-brand-dark mb-1.5 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all"
              required
            />
          </div>

          {/* Error Message Placeholder */}
          <div className="h-4">
            {error && (
              <p className="text-red-500 text-[13px] font-bold text-center">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold text-[16px] hover:bg-black transition-colors mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Authenticating..." : "Secure Login →"}
          </button>
        </form>
      </div>
    </div>
  );
}