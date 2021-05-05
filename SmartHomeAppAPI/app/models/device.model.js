const sql = require('./db.js');

// constructor
class Device {
  constructor(device) {
    this.serial_number = device.serial_number;
    this.device_name = device.device_name;
    this.device_type = device.device_type;
    this.device_room = device.device_room;
    this.device_channel = device.device_channel;
    this.devices_user_id = device.devices_user_id;
  }

  // add device
  static add(newDevice, result) {
    sql.query(
      'INSERT INTO smarthomeapp_devices SET ?',
      newDevice,
      (err, res) => {
        if (err) {
          console.log('Error: ', err);
          result(err, null);
          return;
        }

        console.log('Added device: ', { ...newDevice });
        result(null, { serial_number: res.serial_number });
      },
    );
  }

  // list devices
  static list(type, id, result) {
    sql.query(
      'SELECT serial_number, device_name, device_type, device_room, device_channel FROM smarthomeapp_devices WHERE (device_type = ? AND devices_user_id = ?)',
      [type, id],
      (err, res) => {
        if (err) {
          console.log('error: ', err);
          result(err, null);
          return;
        }

        if (res.length) {
          console.log('found devices: ', res);
          result(false, res);
          return;
        }

        // no devices found
        result({ kind: 'not_found' }, null);
      },
    );
  }
}

module.exports = Device;
