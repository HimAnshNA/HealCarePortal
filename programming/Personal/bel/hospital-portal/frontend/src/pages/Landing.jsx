import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const handlePatient = () => {
    navigate("/login");
  };

  const handleDoctor = () => {
    navigate("/login");
  };

  const handleGetStarted = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 via-slate-100 to-pink-300 flex flex-col">
      <header className="w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            H
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800">
              HealCare Portal
            </h1>
            <p className="text-xs text-slate-500">
              Smart hospital appointment system
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-sm px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-white shadow-sm"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="text-sm px-4 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md"
          >
            Register
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 pb-10 gap-10 lg:gap-16">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-500 font-semibold mb-2">
            Hospital Management System
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
            Manage doctor appointments
            <span className="text-blue-600"> without the chaos.</span>
          </h2>
          <p className="text-slate-600 text-sm md:text-base mb-6">
            A simple portal where patients can easily book appointments, and
            doctors can manage their schedules and visits in one clean dashboard.
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={handleGetStarted}
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-md"
            >
              Get Started
            </button>
            <button
              onClick={handlePatient}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white hover:bg-slate-50 shadow-sm"
            >
              I&apos;m a Patient
            </button>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Online booking, no calls needed
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Real-time doctor availability
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              Separate doctor & patient dashboards
            </div>
          </div>
        </div>

        <div className="w-full max-w-md grid grid-cols-1 gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800">
                For Patients
              </h3>
              <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                Easy booking
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Create an account, browse doctors, check their availability, and
              book appointments with just a few clicks.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handlePatient}
                className="px-3 py-1.5 rounded-lg text-xs bg-emerald-500 text-white hover:bg-emerald-600"
              >
                Patient Login
              </button>
              <button
                onClick={handleGetStarted}
                className="px-3 py-1.5 rounded-lg text-xs border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                New Patient
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800">
                For Doctors
              </h3>
              <span className="text-[10px] px-2 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                Pro dashboard
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Set your availability, manage appointments, and keep track of your
              daily schedule in a clean, simple interface.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleDoctor}
                className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 text-white hover:bg-blue-700"
              >
                Doctor Login
              </button>
              <button
                onClick={handleGetStarted}
                className="px-3 py-1.5 rounded-lg text-xs border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                New Doctor
              </button>
            </div>
          </div>

          <div className="bg-stone-950 rounded-2xl text-slate-100 p-4 text-xs shadow-lg">
            <p className="font-medium mb-1">Sample project By HimAnshU NA.</p>
            <p className="text-slate-300 mb-2">
              This portal is powered by MERN stack (MongoDB, Express, React,
              Node) with Tailwind CSS.
            </p>
            <p className="text-slate-400">
              Using it to showcase my full-stack skills: auth, role-based dashboards,
              live booking flow, CRUD & clean UI.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
