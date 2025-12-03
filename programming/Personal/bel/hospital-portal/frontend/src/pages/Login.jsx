import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === "doctor") {
        navigate("/doctor/dashboard");
      } else if (user.role === "patient") {
        navigate("/patient/dashboard");
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "doctor") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/patient/dashboard");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-slate-50 to-blue-100 px-4">
      <div className="w-full max-w-5xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
        <div className="hidden md:flex md:flex-col md:w-1/2 bg-gradient-to-br from-blue-600 via-sky-500 to-emerald-400 text-white p-8 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-emerald-300/20 blur-2xl" />
          <div className="relative z-10 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-9 w-9 rounded-2xl bg-white/90 flex items-center justify-center text-blue-600 font-bold shadow-md">
                  H
                </div>
                <div>
                  <h1 className="text-lg font-semibold">HealCare Portal</h1>
                  <p className="text-xs text-blue-100">
                    Smart hospital appointment system
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-semibold mb-3">
                Welcome back, doctor or patient.
              </h2>
              <p className="text-sm text-blue-50 mb-6">
                Log in to manage appointments, check doctor availability,
                and keep your hospital visits organised in one place.
              </p>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  <span>Role-based dashboards for doctors & patients.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-200" />
                  <span>Book and manage appointments in real-time.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                  <span>Built on MERN stack with clean, responsive UI.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-[11px] text-blue-100/80">
              Tip: Use the same login screen for both doctor and patient
              accounts. Your role is detected automatically after login.
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between md:justify-end md:mb-4">
            <div className="md:hidden">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  H
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-slate-800">
                    HealCare Portal
                  </h1>
                  <p className="text-[11px] text-slate-500">
                    Hospital management system
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500">
              New here?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-medium hover:underline"
              >
                Create account
              </Link>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-1">
              Login to your account
            </h2>
            <p className="text-xs text-slate-500">
              Use your registered email and password. Works for both doctors
              and patients.
            </p>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs mb-1.5 text-slate-700">
                Email address
              </label>
              <input
                className="w-full border border-slate-300/80 bg-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400"
                placeholder="you@example.com"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-xs mb-1.5 text-slate-700">
                Password
              </label>
              <input
                className="w-full border border-slate-300/80 bg-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400"
                placeholder="Your password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-3 w-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  onChange={() => {}}
                />
                <span>Remember me on this device</span>
              </label>
              <span className="text-blue-500 cursor-default">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <p className="text-[11px] text-slate-500 mb-1">
              Demo hint (for you, not for real users):
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1">
              <li>
                • Login as{" "}
                <span className="font-mono bg-slate-100 px-1 rounded">
                  doctor1@example.com
                </span>{" "}
                to see the doctor dashboard.
              </li>
              <li>
                • Login as{" "}
                <span className="font-mono bg-slate-100 px-1 rounded">
                  patient1@example.com
                </span>{" "}
                to see the patient dashboard.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
