import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    try {
      await signup({ email, name, password });
      nav("/feed");
    } catch (e2) {
      setErr(e2?.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <div className="text-lg font-semibold mb-1">Signup</div>
        <div className="text-sm text-slate-600 mb-4">
          Create an account to subscribe to channels and receive broadcasts.
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
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
          <input
            className="w-full border border-slate-200 rounded-md p-2 text-sm"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="new-password"
          />

          {err ? <div className="text-sm text-red-600">{err}</div> : null}

          <Button disabled={submitting || !email.trim() || !password.trim()}>
            {submitting ? "Creating…" : "Signup"}
          </Button>
        </form>

        <div className="text-sm text-slate-600 mt-4">
          Already have an account?{" "}
          <Link className="text-blue-600 hover:text-blue-700" to="/login">
            Login
          </Link>
        </div>
      </Card>
    </div>
  );
}