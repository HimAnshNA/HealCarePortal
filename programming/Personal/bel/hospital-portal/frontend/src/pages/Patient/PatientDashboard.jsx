import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PatientDashboard() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [booking, setBooking] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);
    if (user.role !== "patient") {
      navigate("/login");
      return;
    }

    setPatient(user);
  }, [navigate]);

  useEffect(() => {
    if (!patient?._id) return;

    fetchDoctors();
    fetchAppointments();
  }, [patient]);

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const res = await axios.get("http://localhost:5000/api/doctors");
      setDoctors(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load doctors.");
    } finally {
      setLoadingDoctors(false);
    }
  };

  const fetchAvailability = async (doctorId) => {
    try {
      if (!doctorId) return;

      setLoadingAvailability(true);
      const res = await axios.get(
        `http://localhost:5000/api/availability/${doctorId}`
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
      if (!patient?._id) return;

      setLoadingAppointments(true);
      const res = await axios.get(
        `http://localhost:5000/api/appointments/patient/${patient._id}`
      );
      setAppointments(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load your appointments.");
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setAvailability([]);
    setSuccess("");
    setError("");
    fetchAvailability(doctor._id);
  };

  const handleBook = async (availabilityId, slotIndex, date) => {
    if (!selectedDoctor || !patient) return;

    setError("");
    setSuccess("");
    setBooking(true);

    try {
      const payload = {
        doctorId: selectedDoctor._id,
        patientId: patient._id,
        availabilityId,
        slotIndex,
        date,
      };

      await axios.post(
        "http://localhost:5000/api/appointments/book",
        payload
      );

      setSuccess("Appointment booked successfully!");

      await fetchAvailability(selectedDoctor._id);
      await fetchAppointments();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to book appointment.");
      }
    } finally {
      setBooking(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    setError("");
    setSuccess("");
    setCancellingId(appointmentId);

    try {
      await axios.patch(
        `http://localhost:5000/api/appointments/${appointmentId}/status`,
        { status: "cancelled" }
      );

      setSuccess("Appointment cancelled.");

      await fetchAppointments();

      if (selectedDoctor?._id) {
        await fetchAvailability(selectedDoctor._id);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to cancel appointment.");
      }
    } finally {
      setCancellingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const totalAppointments = appointments.length;
  const upcomingCount = appointments.filter(
    (a) => a.status === "pending" || a.status === "confirmed"
  ).length;
  const completedCount = appointments.filter(
    (a) => a.status === "completed"
  ).length;
  const cancelledCount = appointments.filter(
    (a) => a.status === "cancelled"
  ).length;

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-600">Loading patient data...</p>
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
            <p className="text-xs text-slate-400">Patient Panel</p>
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
          <p className="text-sm font-medium">{patient.name}</p>
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
                Patient Dashboard
              </p>
              <p className="text-[11px] text-slate-500">{patient.name}</p>
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
              <p className="text-xs text-slate-500">Welcome,</p>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
                {patient.name}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Book and manage your hospital appointments.
              </p>
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
                <p className="text-[10px] text-slate-500">Upcoming</p>
                <p className="text-lg font-semibold text-blue-600">
                  {upcomingCount}
                </p>
                <p className="text-[10px] text-slate-400">Pending/Confirmed</p>
              </div>
              <div className="bg-white rounded-xl border border-emerald-100 px-3 py-2 shadow-sm">
                <p className="text-[10px] text-slate-500">Completed</p>
                <p className="text-lg font-semibold text-emerald-600">
                  {completedCount}
                </p>
                <p className="text-[10px] text-slate-400">Finished visits</p>
              </div>
              <div className="bg-white rounded-xl border border-rose-100 px-3 py-2 shadow-sm">
                <p className="text-[10px] text-slate-500">Cancelled</p>
                <p className="text-lg font-semibold text-rose-600">
                  {cancelledCount}
                </p>
                <p className="text-[10px] text-slate-400">You cancelled</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 lg:col-span-1">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-800">
                  Doctors
                </h2>
                {loadingDoctors && (
                  <span className="text-[10px] text-slate-500">
                    Loading...
                  </span>
                )}
              </div>

              {doctors.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No doctors available yet.
                </p>
              ) : (
                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                  {doctors.map((doc) => (
                    <button
                      key={doc._id}
                      onClick={() => handleSelectDoctor(doc)}
                      className={`w-full text-left border rounded-xl px-3 py-2 text-xs hover:bg-slate-50 transition ${
                        selectedDoctor?._id === doc._id
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-slate-800 text-sm">
                          {doc.name}
                        </p>
                        {typeof doc.experience === "number" && (
                          <span className="text-[10px] text-slate-500">
                            {doc.experience} yrs
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {doc.specialization || "General Physician"}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-800">
                  {selectedDoctor
                    ? `Availability – ${selectedDoctor.name}`
                    : "Select a doctor to view availability"}
                </h2>
                {loadingAvailability && selectedDoctor && (
                  <span className="text-[10px] text-slate-500">
                    Checking slots...
                  </span>
                )}
              </div>

              {!selectedDoctor ? (
                <p className="text-xs text-slate-500">
                  Choose a doctor from the left panel to see available
                  appointment slots.
                </p>
              ) : availability.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No availability found for this doctor.
                </p>
              ) : (
                <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                  {availability.map((item) => (
                    <div
                      key={item._id}
                      className="border border-slate-200 rounded-xl p-3"
                    >
                      <p className="text-xs font-medium text-slate-800 mb-1">
                        Date: {item.date}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.timeSlots.map((slot, index) => (
                          <button
                            key={slot._id}
                            disabled={slot.isBooked || booking}
                            onClick={() =>
                              handleBook(item._id, index, item.date)
                            }
                            className={`px-3 py-1.5 rounded-full text-[11px] border transition ${
                              slot.isBooked
                                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            }`}
                          >
                            {slot.start} - {slot.end}{" "}
                            {!slot.isBooked && "(Book)"}
                            {slot.isBooked && "(Booked)"}
                          </button>
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
                You have no appointments yet. Book a slot from the availability
                section above.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left border-b">Doctor</th>
                      <th className="px-3 py-2 text-left border-b">
                        Specialization
                      </th>
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
                          {appt.doctorId?.name || "-"}
                        </td>
                        <td className="px-3 py-2 border-b">
                          {appt.doctorId?.specialization || "-"}
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
                          {appt.status !== "cancelled" &&
                            appt.status !== "completed" && (
                              <button
                                onClick={() => cancelAppointment(appt._id)}
                                disabled={cancellingId === appt._id}
                                className="px-2 py-1 text-[11px] rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
                              >
                                {cancellingId === appt._id
                                  ? "Cancelling..."
                                  : "Cancel"}
                              </button>
                            )}
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
