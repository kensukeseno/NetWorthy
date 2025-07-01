'use client';
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess(true);
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
    }
  };

  return (
    <div className="my-auto m-auto flex flex-col gap-3 min-w-min w-1/2">
      <div>
        <h2 className="font-bold text-lg mb-1">Reset your password</h2>
        <p className="mb-4">Enter your new password below.</p>
      </div>
      {success ? (
        <div className="text-green-600">
          <p>Your password has been reset successfully.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium text-gray-700" htmlFor="password">
            New Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mb-2 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <label className="block mb-2 font-medium text-gray-700" htmlFor="confirm">
            Confirm Password
          </label>
          <input
            id="confirm"
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="mb-4 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition text-sm mb-4"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
      )}
      <div className="mt-2 text-gray-600 text-center">
        Back to Login?{' '}
        <span
          onClick={() => router.push('/login')}
          className="text-blue-700 font-semibold cursor-pointer hover:underline"
        >
          Sign in
        </span>
      </div>
    </div>
  );
} 