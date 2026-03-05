import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    try {
      await login({ email, password });
      const dest = location.state?.from || "/feed";
      nav(dest);
    } catch (e2) {
      setErr(e2?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <div className="text-lg font-semibold mb-1">Login</div>
        <div className="text-sm text-slate-600 mb-4">
          Sign in to view your subscription-scoped feed.
        </div>

        <form className="space-y-3" onSubmit={onSubmit}>
          <input
            className="w-full border border-slate-200 rounded-md p-2 text-sm"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            className="w-full border border-slate-200 rounded-md p-2 text-sm"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
          />

          {err ? <div className="text-sm text-red-600">{err}</div> : null}

          <Button disabled={submitting || !email.trim() || !password.trim()}>
            {submitting ? "Signing in…" : "Login"}
          </Button>
        </form>

        <div className="text-sm text-slate-600 mt-4">
          No account?{" "}
          <Link className="text-blue-600 hover:text-blue-700" to="/signup">
            Signup
          </Link>
        </div>
      </Card>
    </div>
  );
}