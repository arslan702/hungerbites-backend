const router = require("express").Router();

const staffShift = require("../controllers/staffWorkingController");

router.post("/", staffShift.createStaffWorkingHours);

router.get("/", staffShift.getAllStaffWorkingHours);

router.get("/:id", staffShift.getStaffWorkingHoursById);

router.put("/:id", staffShift.updateStaffWorkingHours);

router.delete("/:id", staffShift.deleteStaffWorkingHours);

module.exports = router;
