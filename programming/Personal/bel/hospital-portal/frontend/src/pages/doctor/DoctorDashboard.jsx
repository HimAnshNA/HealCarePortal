import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [addingAvailability, setAddingAvailability] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [availabilityForm, setAvailabilityForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);
    if (user.role !== "doctor") {
      navigate("/login");
      return;
    }

    setDoctor(user);
  }, [navigate]);

  useEffect(() => {
    if (!doctor?._id) return;

    fetchAvailability();
    fetchAppointments();
  }, [doctor]);

  const fetchAvailability = async (doctorId) => {
    try {
      const id = doctorId || doctor?._id;
      if (!id) return;

      setLoadingAvailability(true);
      const res = await axios.get(
        `https://healcareportal.onrender.com/api/availability/${id}`
      );
      setAvailability(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load availability.");
    } finally {
      setLoadingAvailability(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      if (!doctor?._id) return;

      setLoadingAppointments(true);
      const res = await axios.get(
        `https://healcareportal.onrender.com/api/appointments/doctor/${doctor._id}`
      );
      setAppointments(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load appointments.");
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleAvailabilityChange = (e) => {
    setAvailabilityForm({
      ...availabilityForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !availabilityForm.date ||
      !availabilityForm.startTime ||
      !availabilityForm.endTime
    ) {
      setError("Please fill date, start time and end time.");
      return;
    }

    try {
      setAddingAvailability(true);

      const payload = {
        doctorId: doctor._id,
        date: availabilityForm.date,
        timeSlots: [
          {
            start: availabilityForm.startTime,
            end: availabilityForm.endTime,
          },
        ],
      };

      const res = await axios.post(
        "https://healcareportal.onrender.com/api/availability/add",
        payload
      );

      setAvailability((prev) => [...prev, res.data.availability]);

      setAvailabilityForm({
        date: "",
        startTime: "",
        endTime: "",
      });

      setSuccess("Availability added successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to add availability.");
    } finally {
      setAddingAvailability(false);
    }
  };

  const updateStatus = async (appointmentId, status) => {
    setError("");
    setSuccess("");
    setUpdatingStatusId(appointmentId);

    try {
      await axios.patch(
        `https://healcareportal.onrender.com/api/appointments/${appointmentId}/status`,
        { status }
      );

      setSuccess(`Appointment ${status} successfully.`);

      await fetchAppointments();

      if (status === "cancelled") {
        await fetchAvailability();
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to update appointment status.");
      }
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const totalAppointments = appointments.length;
  const pendingCount = appointments.filter(
    (a) => a.status === "pending"
  ).length;
  const confirmedCount = appointments.filter(
    (a) => a.status === "confirmed"
  ).length;
  const completedCount = appointments.filter(
    (a) => a.status === "completed"
  ).length;

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-600">Loading doctor data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="hidden md:flex flex-col w-60 bg-slate-900 text-slate-100 py-6 px-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="h-9 w-9 rounded-2xl bg-blue-500 flex items-center justify-center text-white font-bold shadow-md">
            H
          </div>
          <div>
            <p className="text-sm font-semibold">HealCare Portal</p>
            <p className="text-xs text-slate-400">Doctor Panel</p>
          </div>
        </div>

        <nav className="flex-1">
          <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-2 px-2">
            Main
          </div>
          <button className="w-full flex items-center gap-2 px-2 py-2 rounded-lg bg-slate-800 text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Dashboard
          </button>
        </nav>

        <div className="mt-6 border-t border-slate-700 pt-4 px-2">
          <p className="text-xs text-slate-400 mb-1">Logged in as</p>
          <p className="text-sm font-medium">{doctor.name}</p>
          {doctor.specialization && (
            <p className="text-xs text-slate-400 mt-0.5">
              {doctor.specialization}
            </p>
          )}
          <button
            onClick={handleLogout}
            className="mt-3 w-full text-xs px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="md:hidden bg-white shadow-sm px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              H
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Doctor Dashboard
              </p>
              <p className="text-[11px] text-slate-500">{doctor.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-[11px] rounded-lg bg-red-500 text-white"
          >
            Logout
          </button>
        </header>

        <main className="p-4 md:p-6 max-w-6xl mx-auto w-full space-y-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500">Welcome back,</p>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
                Dr. {doctor.name}
              </h1>
              {doctor.specialization && (
                <p className="text-xs text-slate-500 mt-0.5">
                  {doctor.specialization}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 text-xs">
              <div className="bg-white rounded-xl border border-slate-100 px-3 py-2 shadow-sm">
                <p className="text-[10px] text-slate-500">Total</p>
                <p className="text-lg font-semibold text-slate-900">
                  {totalAppointments}
                </p>
                <p className="text-[10px] text-slate-400">Appointments</p>
              </div>
              <div className="bg-white rounded-xl border border-blue-100 px-3 py-2 shadow-sm">
                <p className="text-[10px] text-slate-500">Pending</p>
                <p className="text-lg font-semibold text-blue-600">
                  {pendingCount}
                </p>
                <p className="text-[10px] text-slate-400">To review</p>
              </div>
              <div className="bg-white rounded-xl border border-emerald-100 px-3 py-2 shadow-sm">
                <p className="text-[10px] text-slate-500">Confirmed</p>
                <p className="text-lg font-semibold text-emerald-600">
                  {confirmedCount}
                </p>
                <p className="text-[10px] text-slate-400">Upcoming</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 px-3 py-2 shadow-sm">
                <p className="text-[10px] text-slate-500">Completed</p>
                <p className="text-lg font-semibold text-slate-900">
                  {completedCount}
                </p>
                <p className="text-[10px] text-slate-400">Finished</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-800">
                  Add Availability
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                  Quick slot
                </span>
              </div>

              <form
                onSubmit={handleAddAvailability}
                className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
              >
                <div className="sm:col-span-2">
                  <label className="block text-[11px] mb-1 text-slate-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={availabilityForm.date}
                    onChange={handleAvailabilityChange}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] mb-1 text-slate-700">
                    Start
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={availabilityForm.startTime}
                    onChange={handleAvailabilityChange}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] mb-1 text-slate-700">
                    End
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={availabilityForm.endTime}
                    onChange={handleAvailabilityChange}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={addingAvailability}
                  className="sm:col-span-4 w-full py-2.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-60"
                >
                  {addingAvailability ? "Adding..." : "Add Availability"}
                </button>
              </form>
            </section>

            <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-800">
                  Your Availability
                </h2>
                {loadingAvailability && (
                  <span className="text-[10px] text-slate-500">
                    Loading...
                  </span>
                )}
              </div>

              {availability.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No availability added yet. Use the form to add your first
                  slot.
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {availability.map((item) => (
                    <div
                      key={item._id}
                      className="border border-slate-200 rounded-xl p-3"
                    >
                      <p className="text-xs font-medium text-slate-800 mb-1">
                        Date: {item.date}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.timeSlots.map((slot) => (
                          <span
                            key={slot._id}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] border ${
                              slot.isBooked
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            {slot.start}–{slot.end}
                            <span className="ml-1 text-[10px]">
                              {slot.isBooked ? "Booked" : "Free"}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-800">
                Your Appointments
              </h2>
              {loadingAppointments && (
                <span className="text-[10px] text-slate-500">Loading...</span>
              )}
            </div>

            {appointments.length === 0 ? (
              <p className="text-xs text-slate-500">
                No appointments yet. Once patients start booking, they will
                appear here.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left border-b">Patient</th>
                      <th className="px-3 py-2 text-left border-b">Email</th>
                      <th className="px-3 py-2 text-left border-b">Date</th>
                      <th className="px-3 py-2 text-left border-b">Time</th>
                      <th className="px-3 py-2 text-left border-b">Status</th>
                      <th className="px-3 py-2 text-left border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt) => (
                      <tr key={appt._id} className="hover:bg-slate-50">
                        <td className="px-3 py-2 border-b">
                          {appt.patientId?.name || "-"}
                        </td>
                        <td className="px-3 py-2 border-b">
                          {appt.patientId?.email || "-"}
                        </td>
                        <td className="px-3 py-2 border-b">{appt.date}</td>
                        <td className="px-3 py-2 border-b">
                          {appt.startTime} - {appt.endTime}
                        </td>
                        <td className="px-3 py-2 border-b capitalize">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-[10px] border ${
                              appt.status === "pending"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : appt.status === "confirmed"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : appt.status === "completed"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            {appt.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 border-b">
                          <div className="flex flex-wrap gap-1">
                            {appt.status === "pending" && (
                              <button
                                onClick={() =>
                                  updateStatus(appt._id, "confirmed")
                                }
                                disabled={updatingStatusId === appt._id}
                                className="px-2 py-1 text-[11px] rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-60"
                              >
                                {updatingStatusId === appt._id
                                  ? "Updating..."
                                  : "Confirm"}
                              </button>
                            )}

                            {appt.status === "confirmed" && (
                              <button
                                onClick={() =>
                                  updateStatus(appt._id, "completed")
                                }
                                disabled={updatingStatusId === appt._id}
                                className="px-2 py-1 text-[11px] rounded bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-60"
                              >
                                {updatingStatusId === appt._id
                                  ? "Updating..."
                                  : "Complete"}
                              </button>
                            )}

                            {appt.status !== "cancelled" &&
                              appt.status !== "completed" && (
                                <button
                                  onClick={() =>
                                    updateStatus(appt._id, "cancelled")
                                  }
                                  disabled={updatingStatusId === appt._id}
                                  className="px-2 py-1 text-[11px] rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
                                >
                                  {updatingStatusId === appt._id
                                    ? "Updating..."
                                    : "Cancel"}
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
