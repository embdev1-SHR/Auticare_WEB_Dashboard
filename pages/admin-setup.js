import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Spinner } from "reactstrap";
import Axios from "../util/api.util";
import AuticareLogo from "../components/shared/auticare-logo";

export default function AdminSetup() {
  const router = useRouter();
  const [form, setForm] = useState({ EmailId: "", UserName: "", Password: "", Confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    document.body.classList.add("auth-body-bg");
    return () => document.body.classList.remove("auth-body-bg");
  }, []);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: null }));
    setServerError("");
  };

  const validate = () => {
    const errs = {};
    if (!form.UserName.trim()) errs.UserName = "Name is required";
    if (!form.EmailId.trim()) errs.EmailId = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.EmailId)) errs.EmailId = "Enter a valid email";
    if (!form.Password) errs.Password = "Password is required";
    else if (form.Password.length < 8) errs.Password = "Minimum 8 characters";
    if (form.Password !== form.Confirm) errs.Confirm = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError("");
    try {
      await Axios.post("/api/v1/auth/setup-admin", {
        EmailId: form.EmailId,
        UserName: form.UserName,
        Password: form.Password,
      });
      setSuccess(true);
    } catch (err) {
      const msg =
        err.response?.data?.errors?.message ||
        err.errors?.message ||
        "Failed to create account. Please try again.";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    display: "block",
    width: "100%",
    padding: "10px 14px",
    fontSize: 14,
    border: `1.5px solid ${errors[field] ? "#dc3545" : "#dee2e6"}`,
    borderRadius: 6,
    outline: "none",
    background: "#fff",
    marginTop: 4,
    boxSizing: "border-box",
  });

  return (
    <>
      <Head>
        <title>Auticare – Admin Setup</title>
      </Head>

      <div style={{ minHeight: "100vh", background: "#f4f5f7", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
        <div style={{ width: "100%", maxWidth: 460, background: "#fff", borderRadius: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", overflow: "hidden" }}>

          {/* Header */}
          <div style={{ background: "linear-gradient(135deg, #3b5bdb 0%, #1971c2 100%)", padding: "28px 32px 24px", color: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <AuticareLogo />
              <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: 1 }}>Auticare</span>
            </div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Create Super Admin Account</h2>
            <p style={{ margin: "6px 0 0", opacity: 0.85, fontSize: 13 }}>
              One-time setup — only works if no admin exists yet.
            </p>
          </div>

          <div style={{ padding: "28px 32px 32px" }}>
            {success ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <h4 style={{ color: "#2f9e44", fontWeight: 700, marginBottom: 8 }}>Account Created!</h4>
                <p style={{ color: "#6c757d", fontSize: 14, marginBottom: 24 }}>
                  Your super admin account has been set up successfully.
                </p>
                <Link href="/login">
                  <a style={{ display: "inline-block", padding: "10px 28px", background: "#1971c2", color: "#fff", borderRadius: 6, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                    Go to Login
                  </a>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {serverError && (
                  <div style={{ background: "#fff5f5", border: "1px solid #ffa8a8", borderRadius: 6, padding: "10px 14px", marginBottom: 18, color: "#c92a2a", fontSize: 13 }}>
                    {serverError}
                  </div>
                )}

                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#343a40" }}>
                    Full Name <span style={{ color: "#dc3545" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Auticare Admin"
                    value={form.UserName}
                    onChange={set("UserName")}
                    style={inputStyle("UserName")}
                  />
                  {errors.UserName && <p style={{ color: "#dc3545", fontSize: 12, margin: "4px 0 0" }}>{errors.UserName}</p>}
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#343a40" }}>
                    Email Address <span style={{ color: "#dc3545" }}>*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={form.EmailId}
                    onChange={set("EmailId")}
                    style={inputStyle("EmailId")}
                    autoComplete="username"
                  />
                  {errors.EmailId && <p style={{ color: "#dc3545", fontSize: 12, margin: "4px 0 0" }}>{errors.EmailId}</p>}
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#343a40" }}>
                    Password <span style={{ color: "#dc3545" }}>*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={form.Password}
                    onChange={set("Password")}
                    style={inputStyle("Password")}
                    autoComplete="new-password"
                  />
                  {errors.Password && <p style={{ color: "#dc3545", fontSize: 12, margin: "4px 0 0" }}>{errors.Password}</p>}
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#343a40" }}>
                    Confirm Password <span style={{ color: "#dc3545" }}>*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    value={form.Confirm}
                    onChange={set("Confirm")}
                    style={inputStyle("Confirm")}
                    autoComplete="new-password"
                  />
                  {errors.Confirm && <p style={{ color: "#dc3545", fontSize: 12, margin: "4px 0 0" }}>{errors.Confirm}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "11px 0",
                    background: loading ? "#74c0fc" : "#1971c2",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  {loading && <Spinner size="sm" color="light" />}
                  {loading ? "Creating Account…" : "Create Admin Account"}
                </button>

                <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#6c757d" }}>
                  Already have an account?{" "}
                  <Link href="/login">
                    <a style={{ color: "#1971c2", fontWeight: 600 }}>Sign In</a>
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
