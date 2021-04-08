const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sql = require('./db.js');

// constructor
class User {
  constructor(user) {
    this.user_firstname = user.user_firstname;
    this.user_lastname = user.user_lastname;
    this.user_email = user.user_email;
    this.user_password = user.user_password;
  }

  // create user
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

  // authenticate user
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
          // compare password hash with plaintext password
          if (bcrypt.compareSync(password, res[0].user_password)) {
            result(false, res[0].user_id);
            return;
          }
          result(true);
          return;
        }

        // no user found with email
        result({ kind: 'not_found' }, null);
      },
    );
  }

  // get token from database
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

  // create new token and insert into database
  static async setToken(id, result) {
    try {
      const token = crypto.randomBytes(16).toString('hex');
      console.log(token);
      sql.query(
        'UPDATE smarthomeapp_users SET user_token=? WHERE user_id=?',
        [token, id],
        (err) => result(err, token),
      );
    } catch (err) {
      console.log(err);
    }
  }

  // delete token from database
  static deleteToken(token, result) {
    try {
      sql.query(
        `UPDATE smarthomeapp_users SET user_token=null WHERE user_token='${token}'`,
        (err, res) => {
          console.log(`changed ${res.changedRows} rows`);
          if (err) {
            result(true);
          } else if (res.changedRows === 0) {
            result(true);
          }
          result(null);
        },
      );
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = User;
