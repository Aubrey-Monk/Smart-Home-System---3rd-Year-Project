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
