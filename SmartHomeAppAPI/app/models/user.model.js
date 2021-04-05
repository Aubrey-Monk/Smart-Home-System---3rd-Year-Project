const sql = require('./db.js');

// constructor
const User = function (user) {
  this.user_firstname = user.user_firstname;
  this.user_lastname = user.user_lastname;
  this.user_email = user.user_email;
  this.user_password = user.user_password;
  this.user_salt = user.user_salt;
};

User.create = (newUser, result) => {
  sql.query('INSERT INTO smarthomeapp_users SET ?', newUser, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    console.log('created user: ', { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
  });
};

module.exports = User;
