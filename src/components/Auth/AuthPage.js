import React, { useState } from "react";
import { useApp, findUser, saveUser, emailExists } from "../../context/AppContext";

export default function AuthPage() {
  const { state, dispatch } = useApp();
  const isLogin = state.authPage === "login";

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({});

  // Signup form state
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "", confirm: "", role: "viewer" });
  const [signupErrors, setSignupErrors] = useState({});
  const [signupSuccess, setSignupSuccess] = useState(false);

  // ── Login ──
  const handleLogin = () => {
    const errs = {};
    if (!loginForm.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(loginForm.email)) errs.email = "Enter a valid email";
    if (!loginForm.password) errs.password = "Password is required";
    if (Object.keys(errs).length > 0) { setLoginErrors(errs); return; }

    const user = findUser(loginForm.email.trim().toLowerCase(), loginForm.password);
    if (!user) {
      setLoginErrors({ general: "Invalid email or password. Try signing up first." });
      return;
    }
    dispatch({ type: "LOGIN", payload: { name: user.name, email: user.email, role: user.role } });
  };

  // ── Signup ──
  const handleSignup = () => {
    const errs = {};
    if (!signupForm.name.trim()) errs.name = "Full name is required";
    if (!signupForm.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(signupForm.email)) errs.email = "Enter a valid email";
    else if (emailExists(signupForm.email.trim().toLowerCase())) errs.email = "This email is already registered";
    if (!signupForm.password) errs.password = "Password is required";
    else if (signupForm.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (signupForm.confirm !== signupForm.password) errs.confirm = "Passwords do not match";
    if (Object.keys(errs).length > 0) { setSignupErrors(errs); return; }

    saveUser({
      name: signupForm.name.trim(),
      email: signupForm.email.trim().toLowerCase(),
      password: signupForm.password,
      role: signupForm.role,
    });
    setSignupSuccess(true);
    setTimeout(() => {
      setSignupSuccess(false);
      dispatch({ type: "SET_AUTH_PAGE", payload: "login" });
      setLoginForm({ email: signupForm.email.trim().toLowerCase(), password: "" });
    }, 1800);
  };

  const inputStyle = (hasError) => ({
    width: "100%",
    background: "var(--bg-input)",
    border: `1px solid ${hasError ? "var(--accent-red)" : "var(--border)"}`,
    borderRadius: "var(--radius-sm)",
    padding: "10px 12px",
    color: "var(--text-primary)",
    fontSize: "0.88rem",
    outline: "none",
    fontFamily: "var(--font-body)",
    transition: "border 0.2s",
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    }}>
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: "40px 36px",
        width: "100%",
        maxWidth: 420,
        boxShadow: "var(--shadow-lg)",
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{
            width: 40, height: 40,
            background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>💰</div>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--text-primary)" }}>
            Fintrax
          </span>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: "flex",
          background: "var(--bg-hover)",
          borderRadius: "var(--radius-sm)",
          padding: 4,
          marginBottom: 28,
        }}>
          {["login", "signup"].map((tab) => (
            <button
              key={tab}
              onClick={() => { dispatch({ type: "SET_AUTH_PAGE", payload: tab }); setLoginErrors({}); setSignupErrors({}); }}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                background: state.authPage === tab ? "var(--bg-card)" : "transparent",
                color: state.authPage === tab ? "var(--text-primary)" : "var(--text-muted)",
                fontWeight: state.authPage === tab ? 600 : 400,
                fontSize: "0.88rem",
                cursor: "pointer",
                boxShadow: state.authPage === tab ? "var(--shadow-sm)" : "none",
                transition: "all 0.2s",
                fontFamily: "var(--font-body)",
                textTransform: "capitalize",
              }}
            >
              {tab === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* ── LOGIN FORM ── */}
        {isLogin && (
          <div>
            <div style={{ marginBottom: 6, fontSize: "1.2rem", fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
              Welcome back
            </div>
            <div style={{ fontSize: "0.83rem", color: "var(--text-muted)", marginBottom: 24 }}>
              Sign in to your Fintrax account
            </div>

            {loginErrors.general && (
              <div style={{
                background: "var(--accent-red-dim)", border: "1px solid rgba(255,82,82,0.25)",
                borderRadius: "var(--radius-sm)", padding: "10px 12px",
                color: "var(--accent-red)", fontSize: "0.82rem", marginBottom: 16,
              }}>
                ⚠️ {loginErrors.general}
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 6 }}>
                Email
              </label>
              <input
                style={inputStyle(loginErrors.email)}
                type="email"
                placeholder="you@example.com"
                value={loginForm.email}
                onChange={(e) => { setLoginForm({ ...loginForm, email: e.target.value }); setLoginErrors({ ...loginErrors, email: "", general: "" }); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              {loginErrors.email && <div style={{ color: "var(--accent-red)", fontSize: "0.75rem", marginTop: 4 }}>{loginErrors.email}</div>}
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 6 }}>
                Password
              </label>
              <input
                style={inputStyle(loginErrors.password)}
                type="password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => { setLoginForm({ ...loginForm, password: e.target.value }); setLoginErrors({ ...loginErrors, password: "", general: "" }); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              {loginErrors.password && <div style={{ color: "var(--accent-red)", fontSize: "0.75rem", marginTop: 4 }}>{loginErrors.password}</div>}
            </div>

            <button
              onClick={handleLogin}
              style={{
                width: "100%", padding: "11px",
                background: "var(--accent-blue)", color: "white",
                border: "none", borderRadius: "var(--radius-sm)",
                fontWeight: 600, fontSize: "0.9rem", cursor: "pointer",
                fontFamily: "var(--font-body)", transition: "opacity 0.2s",
              }}
              onMouseOver={(e) => e.target.style.opacity = 0.88}
              onMouseOut={(e) => e.target.style.opacity = 1}
            >
              Sign In →
            </button>

            <div style={{ marginTop: 16, textAlign: "center", fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Don't have an account?{" "}
              <span
                onClick={() => dispatch({ type: "SET_AUTH_PAGE", payload: "signup" })}
                style={{ color: "var(--accent-blue)", cursor: "pointer", fontWeight: 500 }}
              >
                Sign up
              </span>
            </div>

            <div style={{ marginTop: 20, padding: "12px 14px", background: "var(--bg-hover)", borderRadius: "var(--radius-sm)", fontSize: "0.76rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              💡 <strong style={{ color: "var(--text-secondary)" }}>Demo app</strong> — sign up first to create an account, then log in. Accounts are stored in your browser.
            </div>
          </div>
        )}

        {/* ── SIGNUP FORM ── */}
        {!isLogin && (
          <div>
            <div style={{ marginBottom: 6, fontSize: "1.2rem", fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
              Create account
            </div>
            <div style={{ fontSize: "0.83rem", color: "var(--text-muted)", marginBottom: 24 }}>
              Start tracking your finances today
            </div>

            {signupSuccess && (
              <div style={{
                background: "var(--accent-green-dim)", border: "1px solid rgba(34,208,122,0.25)",
                borderRadius: "var(--radius-sm)", padding: "10px 12px",
                color: "var(--accent-green)", fontSize: "0.82rem", marginBottom: 16, textAlign: "center",
              }}>
                ✅ Account created! Redirecting to sign in...
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 6 }}>
                Full Name
              </label>
              <input
                style={inputStyle(signupErrors.name)}
                placeholder="Alex Johnson"
                value={signupForm.name}
                onChange={(e) => { setSignupForm({ ...signupForm, name: e.target.value }); setSignupErrors({ ...signupErrors, name: "" }); }}
              />
              {signupErrors.name && <div style={{ color: "var(--accent-red)", fontSize: "0.75rem", marginTop: 4 }}>{signupErrors.name}</div>}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 6 }}>
                Email
              </label>
              <input
                style={inputStyle(signupErrors.email)}
                type="email"
                placeholder="you@example.com"
                value={signupForm.email}
                onChange={(e) => { setSignupForm({ ...signupForm, email: e.target.value }); setSignupErrors({ ...signupErrors, email: "" }); }}
              />
              {signupErrors.email && <div style={{ color: "var(--accent-red)", fontSize: "0.75rem", marginTop: 4 }}>{signupErrors.email}</div>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 6 }}>
                  Password
                </label>
                <input
                  style={inputStyle(signupErrors.password)}
                  type="password"
                  placeholder="Min 6 chars"
                  value={signupForm.password}
                  onChange={(e) => { setSignupForm({ ...signupForm, password: e.target.value }); setSignupErrors({ ...signupErrors, password: "" }); }}
                />
                {signupErrors.password && <div style={{ color: "var(--accent-red)", fontSize: "0.72rem", marginTop: 4 }}>{signupErrors.password}</div>}
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 6 }}>
                  Confirm
                </label>
                <input
                  style={inputStyle(signupErrors.confirm)}
                  type="password"
                  placeholder="Repeat password"
                  value={signupForm.confirm}
                  onChange={(e) => { setSignupForm({ ...signupForm, confirm: e.target.value }); setSignupErrors({ ...signupErrors, confirm: "" }); }}
                />
                {signupErrors.confirm && <div style={{ color: "var(--accent-red)", fontSize: "0.72rem", marginTop: 4 }}>{signupErrors.confirm}</div>}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>
                Role
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                {["admin", "viewer"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setSignupForm({ ...signupForm, role: r })}
                    style={{
                      flex: 1, padding: "9px",
                      borderRadius: "var(--radius-sm)",
                      border: `1px solid ${signupForm.role === r ? (r === "admin" ? "var(--accent-purple)" : "var(--accent-blue)") : "var(--border)"}`,
                      background: signupForm.role === r ? (r === "admin" ? "var(--accent-purple-dim)" : "var(--accent-blue-dim)") : "var(--bg-input)",
                      color: signupForm.role === r ? (r === "admin" ? "var(--accent-purple)" : "var(--accent-blue)") : "var(--text-secondary)",
                      fontWeight: 600, fontSize: "0.84rem", cursor: "pointer",
                      transition: "all 0.2s", fontFamily: "var(--font-body)",
                    }}
                  >
                    {r === "admin" ? "🔐 Admin" : "👁 Viewer"}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 7 }}>
                {signupForm.role === "admin" ? "Full access — add, edit, delete transactions" : "Read-only access — view data and insights"}
              </div>
            </div>

            <button
              onClick={handleSignup}
              style={{
                width: "100%", padding: "11px",
                background: "var(--accent-blue)", color: "white",
                border: "none", borderRadius: "var(--radius-sm)",
                fontWeight: 600, fontSize: "0.9rem", cursor: "pointer",
                fontFamily: "var(--font-body)", transition: "opacity 0.2s",
              }}
              onMouseOver={(e) => e.target.style.opacity = 0.88}
              onMouseOut={(e) => e.target.style.opacity = 1}
            >
              Create Account →
            </button>

            <div style={{ marginTop: 16, textAlign: "center", fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Already have an account?{" "}
              <span
                onClick={() => dispatch({ type: "SET_AUTH_PAGE", payload: "login" })}
                style={{ color: "var(--accent-blue)", cursor: "pointer", fontWeight: 500 }}
              >
                Sign in
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
