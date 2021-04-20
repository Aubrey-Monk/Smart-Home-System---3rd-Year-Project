const devices = require('../controllers/device.controller.js');

module.exports = (app) => {
  // add new Device
  app.post('/device/add', devices.add);
};
