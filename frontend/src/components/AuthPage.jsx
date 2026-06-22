import { useState } from "react";
import { authApi } from "../api/auth";
import { useAuthStore } from "../store/authStore";

export default function AuthPage({ onContinueAsGuest }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  const setField = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const data = await authApi.signup(form.username, form.email, form.password);
        // Use backend user object if provided, otherwise build from form fields
        const user = data.user || { username: form.username, email: form.email };
        login(data.token, user);
      } else {
        const data = await authApi.login(form.email, form.password);
        const user = { username: data.username, email: form.email };
        login(data.token, user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setError(null);
    setForm({ username: "", email: "", password: "" });
  };

  return (
    <div className="auth-page">
      <div className="auth-grid" />

      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-dot" />
          <span className="auth-logo-text">
            OSPF<span className="brand-accent">vis</span>
          </span>
        </div>

        <p className="auth-subtitle">Dynamic Routing Visualizer</p>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === "login" ? "auth-tab-active" : ""}`}
            onClick={() => mode !== "login" && switchMode()}
            type="button"
          >
            Login
          </button>
          <button
            className={`auth-tab ${mode === "signup" ? "auth-tab-active" : ""}`}
            onClick={() => mode !== "signup" && switchMode()}
            type="button"
          >
            Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="auth-field">
              <label className="auth-label">Username</label>
              <input
                className="auth-input"
                type="text"
                placeholder="e.g. netadmin"
                value={form.username}
                onChange={setField("username")}
                required
                autoComplete="username"
              />
            </div>
          )}

          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={setField("email")}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={setField("password")}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          {error && (
            <div className="auth-error">
              <span>⚠</span> {error}
            </div>
          )}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading
              ? "Please wait…"
              : mode === "login"
              ? "Login"
              : "Create Account"}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button className="auth-guest" onClick={onContinueAsGuest} type="button">
          Continue without account
        </button>

        <p className="auth-guest-note">
          Guest mode — topology saving is disabled
        </p>
      </div>
    </div>
  );
}