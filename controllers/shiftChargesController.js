const ShiftCharges = require("../models/shiftCharges.model");


exports.createShiftCharge = (req, res) => {
  ShiftCharges.create(req.body)
    .then((shift) => {
      res.status(201).send('Shift charge created successfully');
    })
    .catch((error) => {
      res.status(500).send('Error creating ShiftCharge: ' + error.message);
      console.log({ error });
    });
};


exports.getShiftChargeById = (req, res) => {
  const shiftChargeId = req.params.id;

  ShiftCharges.findByPk(shiftChargeId)
    .then((shiftCharge) => {
      if (!shiftCharge) {
        res.status(404).send('ShiftCharge not found');
      } else {
        res.status(200).json(shiftCharge);
      }
    })
    .catch((error) => {
      res.status(500).send('Error fetching ShiftCharge: ' + error.message);
      console.log({ error });
    });
};

exports.updateShiftCharge = (req, res) => {
  const shiftChargeId = req.params.id;
  const updatedData = req.body;

  ShiftCharges.findByPk(shiftChargeId)
    .then((shiftCharge) => {
      if (!shiftCharge) {
        res.status(404).send('ShiftCharge not found');
      } else {
        return shiftCharge.update(updatedData);
      }
    })
    .then((updatedShiftCharge) => {
      res.status(200).json(updatedShiftCharge);
    })
    .catch((error) => {
      res.status(500).send('Error updating ShiftCharge: ' + error.message);
      console.log({ error });
    });
};

exports.deleteShiftCharge = (req, res) => {
  const shiftChargeId = req.params.id;

  ShiftCharges.findByPk(shiftChargeId)
    .then((shiftCharge) => {
      if (!shiftCharge) {
        res.status(404).send('ShiftCharge not found');
      } else {
        return shiftCharge.destroy();
      }
    })
    .then(() => {
      res.status(200).send('ShiftCharge deleted successfully');
    })
    .catch((error) => {
      res.status(500).send('Error deleting ShiftCharge: ' + error.message);
      console.log({ error });
    });
};

