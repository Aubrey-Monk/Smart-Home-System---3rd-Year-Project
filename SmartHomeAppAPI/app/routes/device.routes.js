const devices = require('../controllers/device.controller.js');

module.exports = (app) => {
  // add new Device
  app.post('/device/add', devices.add);
  // get list of Devices
  app.get('/device/list/:device_type/:usr_id', devices.list);
  // delete a Device
  app.delete('/device/delete/:device_id', devices.delete);
};
