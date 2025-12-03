const express = require("express");
const {
  bookAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  updateAppointmentStatus,
} = require("../controllers/appointmentController");

const router = express.Router();

router.post("/book", bookAppointment);

router.get("/doctor/:doctorId", getDoctorAppointments);

router.get("/patient/:patientId", getPatientAppointments);

router.patch("/:appointmentId/status", updateAppointmentStatus);

module.exports = router;
