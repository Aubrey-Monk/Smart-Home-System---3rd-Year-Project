const Device = require('../models/device.model.js');

// create + save a new device
exports.add = async (req, res) => {
  // validate request
  if (!req.body) {
    res.status(400).send({
      message: 'Bad Request',
    });
  } else {
    // create device
    const device = new Device({
      serial_number: req.body.serial_number,
      device_name: req.body.device_name,
      device_type: req.body.device_type,
      device_room: req.body.device_room,
      devices_user_id: req.body.user_id,
    });

    // add device
    Device.add(device, (err, data) => {
      if (err) {
        res.status(500).send({
          message: err.message || 'Server Error',
        });
      } else res.status(201).send(data);
    });
  }
};

// get list of devices
exports.list = async (req, res) => {
  const type = req.params.device_type;
  const id = parseInt(req.params.usr_id, 10);
  // validate request
  if (!req.body) {
    res.status(400).send({
      message: 'Bad Request',
    });
  } else {
    console.log(type);
    console.log(id);
    // add device
    Device.list(type, id, (err, data) => {
      if (err) {
        res.status(500).send({
          message: err.message || 'Server Error',
        });
      } else res.status(200).send(data);
    });
  }
};