import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ✅ Navigate only AFTER render
  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate("/", { replace: true });
    } catch (err) {
      setError("Login failed. Check email/password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 grid place-items-center px-4">
      <div className="w-full max-w-sm bg-white border rounded-xl p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Login</h1>
        <p className="text-sm text-gray-600 mt-1">
          Sign in to manage inventory.
        </p>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label className="text-sm text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            disabled={submitting}
            className="w-full bg-gray-900 text-white rounded py-2 font-medium disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <Link
          to="/signup"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
        >
          Create an account
          <span className="text-base">→</span>
        </Link>
      </div>
    </div>
  );
}
