import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    specialization: "",
    experience: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (role) => {
    setForm((prev) => ({
      ...prev,
      role,
      specialization: role === "doctor" ? prev.specialization : "",
      experience: role === "doctor" ? prev.experience : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      if (form.role === "doctor") {
        payload.specialization = form.specialization;
        payload.experience = form.experience
          ? Number(form.experience)
          : undefined;
      }

      await axios.post("http://localhost:5000/api/auth/register", payload);

      setSuccess("Registration successful! Redirecting to login...");
      setLoading(false);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.error(err);
      setLoading(false);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
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
                Create your free account.
              </h2>
              <p className="text-sm text-blue-50 mb-6">
                Register either as a patient to book appointments, or as a
                doctor to manage your schedule and upcoming visits.
              </p>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  <span>Patients book and track appointments with ease.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-200" />
                  <span>
                    Doctors control availability and see all patient visits.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                  <span>Clean role-based dashboards powered by MERN stack.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-[11px] text-blue-100/80">
              You&apos;ll choose your role (Patient or Doctor) on the right
              and we&apos;ll tailor your experience based on that.
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-6 sm:p-8">
          <div className="mb-5 flex items-center justify-between md:justify-end md:mb-4">
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
              Already registered?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900 mb-1">
              Create an account
            </h2>
            <p className="text-xs text-slate-500">
              Choose your role below. You can register as a patient or as a
              doctor.
            </p>
          </div>

          <div className="flex mb-5 gap-2">
            <button
              type="button"
              onClick={() => handleRoleChange("patient")}
              className={`flex-1 py-2.5 rounded-xl border text-xs font-medium transition ${
                form.role === "patient"
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              I&apos;m a Patient
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("doctor")}
              className={`flex-1 py-2.5 rounded-xl border text-xs font-medium transition ${
                form.role === "doctor"
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              I&apos;m a Doctor
            </button>
          </div>

          {error && (
            <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-3 text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs mb-1.5 text-slate-700">
                Full name
              </label>
              <input
                className="w-full border border-slate-300/80 bg-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400"
                placeholder="Your name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

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
                placeholder="Create a strong password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {form.role === "doctor" && (
              <>
                <div>
                  <label className="block text-xs mb-1.5 text-slate-700">
                    Specialization
                  </label>
                  <input
                    className="w-full border border-slate-300/80 bg-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400"
                    placeholder="e.g. Cardiology, Neurology"
                    type="text"
                    name="specialization"
                    value={form.specialization}
                    onChange={handleChange}
                    required={form.role === "doctor"}
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1.5 text-slate-700">
                    Experience (years)
                  </label>
                  <input
                    className="w-full border border-slate-300/80 bg-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400"
                    placeholder="e.g. 5"
                    type="number"
                    min="0"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
            >
              {loading
                ? "Creating account..."
                : form.role === "doctor"
                ? "Register as Doctor"
                : "Register as Patient"}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <p className="text-[11px] text-slate-500">
              You can create multiple demo accounts (doctor / patient) to test
              the full booking flow and dashboards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
