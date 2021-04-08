const bcrypt = require('bcrypt');
const crypto = require('crypto');
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

  static auth(email, password, result) {
    sql.query(
      `SELECT user_id, user_password FROM smarthomeapp_users WHERE user_email = '${email}'`,
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
          result(true); // failed password comparison
          return;
        }

        // no User found
        result({ kind: 'not_found' }, null);
      },
    );
  }

  static getToken(id, result) {
    try {
      sql.query(
        `SELECT user_token FROM smarthomeapp_users WHERE user_id=${id}`,
        (err, res) => {
          if (result.length === 1 && result[0].token) {
            result(null, res[0].token);
            return;
          }
          result(null, null);
        },
      );
    } catch (err) {
      console.log(err);
    }
  }

  static async setToken(id, result) {
    try {
      const token = crypto.randomBytes(16).toString('hex');
      console.log(token);
      sql.query(
        'UPDATE smarthomeapp_users SET user_token=? WHERE user_id=?',
        [token, id],
        (err) => result(err, token),
      );
      console.log('fluffy');
    } catch (err) {
      console.log('Error');
    }
  }
}

module.exports = User;
