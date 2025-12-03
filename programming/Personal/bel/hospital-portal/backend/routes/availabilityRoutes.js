const express = require("express");
const { addAvailability, getDoctorAvailability } = require("../controllers/availabilityController");
const router = express.Router();

router.post("/add", addAvailability);
router.get("/:doctorId", getDoctorAvailability);

module.exports = router;
