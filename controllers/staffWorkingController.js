const Staff = require('../models/staff.model');
const StaffWorkingHours = require('../models/staffWorkingHours.model');

exports.createStaffWorkingHours = async (req, res) => {
  try {
    const newStaffWorkingHours = await StaffWorkingHours.create(req.body);
    res.status(201).json(newStaffWorkingHours);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllStaffWorkingHours = async (req, res) => {
  try {
    const allStaffWorkingHours = await StaffWorkingHours.findAll({
      include: [
        { model: Staff, as: "Staff" },
      ],
    });
    res.status(200).json(allStaffWorkingHours);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStaffWorkingHoursById = async (req, res) => {
  const staffWorkingHoursId = req.params.id;

  try {
    const staffWorkingHours = await StaffWorkingHours.findByPk(staffWorkingHoursId);
    if (!staffWorkingHours) {
      res.status(404).send('StaffWorkingHours record not found');
    } else {
      res.status(200).json(staffWorkingHours);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStaffWorkingHours = async (req, res) => {
  const staffWorkingHoursId = req.params.id;
  // const newData = req.body; // Assuming the request body contains the updated data
  console.log(req.body)
  try {
    const staffWorkingHours = await StaffWorkingHours.findByPk(staffWorkingHoursId);
    if (!staffWorkingHours) {
      res.status(404).send('StaffWorkingHours record not found');
    } else {
      await staffWorkingHours.update(req.body.values);
      res.status(200).json(staffWorkingHours);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteStaffWorkingHours = async (req, res) => {
  const staffWorkingHoursId = req.params.id;

  try {
    const staffWorkingHours = await StaffWorkingHours.findByPk(staffWorkingHoursId);
    if (!staffWorkingHours) {
      res.status(404).send('StaffWorkingHours record not found');
    } else {
      await staffWorkingHours.destroy();
      res.status(200).json({ message: 'StaffWorkingHours record deleted successfully.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
