const Staff = require("../models/staff.model");

exports.addStaff = async(req, res) => {
  // const { name ,email, role, kitchen_access } = req.body;
  console.log(req.body)
  try {
    const newStaffWorkingHours = await Staff.create(req.body);
    res.status(201).json(newStaffWorkingHours);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStaff = async(req, res) => {
  try {
    const staff = await Staff.findAll();
    res.status(200).json(staff)
  } catch (error) {
    res.status(500).json({error});
  }
}

exports.getStaffById = (req, res) => {
  const staffId = req.params.id;

  Staff.findByPk(staffId)
    .then((staff) => {
      if (!staff) {
        res.status(404).send('Staff member not found');
      } else {
        res.status(200).json(staff);
      }
    })
    .catch((error) => {
      res.status(500).send('Error fetching staff member: ' + error.message);
      console.log({ error });
    });
};

exports.updateStaff = (req, res) => {
  const staffId = req.params.id;
  const updatedData = req.body;

  Staff.findByPk(staffId)
    .then((staff) => {
      if (!staff) {
        res.status(404).send('Staff member not found');
      } else {
        return staff.update(updatedData);
      }
    })
    .then((updatedStaff) => {
      res.status(200).json(updatedStaff);
    })
    .catch((error) => {
      res.status(500).send('Error updating staff member: ' + error.message);
      console.log({ error });
    });
};

exports.deleteStaff = (req, res) => {
  const staffId = req.params.id;

  Staff.findByPk(staffId)
    .then((staff) => {
      if (!staff) {
        res.status(404).send('Staff member not found');
      } else {
        return staff.destroy();
      }
    })
    .then(() => {
      res.status(200).send('Staff member deleted successfully');
    })
    .catch((error) => {
      res.status(500).send('Error deleting staff member: ' + error.message);
      console.log({ error });
    });
};
