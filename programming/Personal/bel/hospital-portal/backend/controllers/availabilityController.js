const Availability = require("../models/Availability");

exports.addAvailability = async (req, res) => {
  try {
    const { doctorId, date, timeSlots } = req.body;

    const availability = await Availability.create({
      doctorId,
      date,
      timeSlots
    });

    res.json({
      message: "Availability added",
      availability
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDoctorAvailability = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    const availability = await Availability.find({ doctorId });

    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
