const devices = require('../controllers/device.controller.js');

module.exports = (app) => {
  // add new Device
  app.post('/device/add', devices.add);
  // get list of Devices
  app.get('/device/list/:device_type/:usr_id', devices.list);
};
