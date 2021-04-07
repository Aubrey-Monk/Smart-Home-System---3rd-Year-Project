const bcrypt = require('bcrypt');
const sql = require('./db.js');

// Constructor
class User {
  constructor(user) {
    this.user_firstname = user.user_firstname;
    this.user_lastname = user.user_lastname;
    this.user_email = user.user_email;
    this.user_password = user.user_password;
    this.user_salt = user.user_salt;
  }

  static create(newUser, result) {
    sql.query('INSERT INTO smarthomeapp_users SET ?', newUser, (err, res) => {
      if (err) {
        console.log('Error: ', err);
        result(err, null);
        return;
      }

      console.log('Created user: ', { id: res.insertId, ...newUser });
      result(null, { id: res.insertId });
    });
  }

  static authenticate(email, password, result) {
    sql.query(
      `SELECT user_id, user_password, user_salt FROM smarthomeapp_users WHERE user_email = '${email}'`,
      (err, res) => {
        if (err) {
          console.log('error: ', err);
          result(err, null);
          return;
        }

        if (res.length) {
          console.log('found user: ', res[0]);
          if (bcrypt.compareSync(password, res[0].user_password)) {
            result(false, res[0].user_id);
            return;
          }
          result(true); // failed password check
          return;
        }

        // not found User
        result({ kind: 'not_found' }, null);
        // eslint-disable-next-line comma-dangle
      }
    );
  }

  // static getToken(id, result){

  // }
}

module.exports = User;
