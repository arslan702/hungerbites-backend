const StaffMonthlySalary = require("../models/salary.model");
const Staff = require("../models/staff.model");

exports.createStaffWorkingHours = async (req, res) => {
  try {
    const newStaffWorkingHours = await StaffMonthlySalary.create(req.body);
    res.status(201).json(newStaffWorkingHours);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllStaffWorkingHours = async (req, res) => {
  try {
    const allStaffWorkingHours = await StaffMonthlySalary.findAll({
      include: [
        { model: Staff, as: "Staff" },
      ],
    });
    res.json(allStaffWorkingHours);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStaffWorkingHoursById = async (req, res) => {
  const id = req.params.id;
  try {
    const staffWorkingHours = await StaffMonthlySalary.findByPk(id);
    if (!staffWorkingHours) {
      return res.status(404).json({ error: 'StaffWorkingHours not found' });
    }
    res.json(staffWorkingHours);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStaffWorkingHours = async (req, res) => {
  const id = req.params.id;
  try {
    const rowsUpdated = await StaffMonthlySalary.findByPk(id);
    if (!rowsUpdated) {
      res.status(404).send('StaffSalary record not found');
    } else {
      await rowsUpdated.update(req.body.values);
      res.status(200).json(rowsUpdated);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteStaffWorkingHours = async (req, res) => {
  const id = req.params.id;
  try {
    const rowsDeleted = await StaffMonthlySalary.destroy({
      where: { id },
    });
    if (rowsDeleted === 0) {
      return res.status(404).json({ error: 'StaffWorkingHours not found' });
    }
    res.json({ message: 'StaffWorkingHours deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};