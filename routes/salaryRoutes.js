const router = require("express").Router();

const salaryController = require('../controllers/salaryController');

router.post("/", salaryController.createStaffWorkingHours);

router.get("/", salaryController.getAllStaffWorkingHours);

router.put("/:id", salaryController.updateStaffWorkingHours);

router.get("/:id", salaryController.getStaffWorkingHoursById);

router.delete("/:id", salaryController.deleteStaffWorkingHours);

module.exports = router;