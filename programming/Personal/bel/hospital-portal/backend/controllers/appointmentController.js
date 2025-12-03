const Appointment = require("../models/Appointment");
const Availability = require("../models/Availability");

exports.bookAppointment = async (req, res) => {
  try {
    const { availabilityId, slotIndex, doctorId, patientId, date } = req.body;

    const availability = await Availability.findById(availabilityId);

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    const slot = availability.timeSlots[slotIndex];
    if (!slot) {
      return res.status(400).json({ message: "Invalid time slot" });
    }

    if (slot.isBooked) {
      return res.status(400).json({ message: "This slot is already booked" });
    }

    const appointment = await Appointment.create({
      doctorId,
      patientId,
      availabilityId,
      date: date || availability.date,
      startTime: slot.start,
      endTime: slot.end,
      status: "pending",
    });

    availability.timeSlots[slotIndex].isBooked = true;
    await availability.save();

    res.json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    const appointments = await Appointment.find({ doctorId })
      .populate("patientId", "name email")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    const appointments = await Appointment.find({ patientId })
      .populate("doctorId", "name email specialization")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



exports.updateAppointmentStatus = async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;

    const body = req.body || {};
    const status = body.status;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status;
    await appointment.save();

    if (status === "cancelled") {
      const availability = await Availability.findById(
        appointment.availabilityId
      );

      if (availability) {
        const index = availability.timeSlots.findIndex(
          (slot) =>
            slot.start === appointment.startTime &&
            slot.end === appointment.endTime
        );

        if (index !== -1) {
          availability.timeSlots[index].isBooked = false;
          await availability.save();
        }
      }
    }

    res.json({
      message: "Appointment status updated",
      appointment,
    });
  } catch (error) {
    console.error("updateAppointmentStatus error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};
