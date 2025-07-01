'use client';
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setError("");
    setSubmitted(false);
    setPreviewUrl(null);

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok && data.error) {
      setError(data.error);
      setSubmitted(false);
      return;
    }
    setSubmitted(true);
    if (data.previewUrl) setPreviewUrl(data.previewUrl);
  };

  return (
    <div className="my-auto m-auto flex flex-col gap-3 min-w-min w-1/2">
      <div>
        <h2 className="font-bold text-lg mb-1">Forgot your password?</h2>
        <p className="mb-4">
          No worries, we'll send you a reset link.
        </p>
      </div>
      {submitted ? (
        <div className="text-green-600">
          <p>If an account with that email exists, a password reset link has been sent.</p>
          {previewUrl && (
            <div className="mt-4 p-3 bg-gray-50 rounded border">
              <span className="block text-gray-700 text-sm font-medium mb-2">📧 Test Email Preview (Development Only)</span>
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition"
              >
                View Email in Browser
              </a>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium text-gray-700" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mb-4 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition text-sm mb-4"
          >
            Send Reset Link
          </button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
      )}
      <div className="mt-2 text-gray-600 text-center">
        Remember Password?{' '}
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
