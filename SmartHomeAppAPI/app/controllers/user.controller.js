const bcrypt = require('bcrypt');
const User = require('../models/user.model.js');

// create + save a new User
exports.create = async (req, res) => {
  // regex used to validate email
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // validate request
  if (!req.body) {
    res.status(400).send({
      message: 'Bad Request',
    });
  } else if (
    !emailRegex.test(String(req.body.email).toLowerCase()) ||
    req.body.password.length <= 5
  ) {
    res.status(400).send({ message: 'Bad Request' });
  } else {
    // generate salt and hashed password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create user
    const user = new User({
      user_firstname: req.body.firstname,
      user_lastname: req.body.lastname,
      user_email: req.body.email,
      user_password: hashedPassword,
    });

    // save user
    User.create(user, (err, data) => {
      if (err) {
        res.status(500).send({
          message: err.message || 'Server Error',
        });
      } else res.status(201).send(data);
    });
  }
};

// login
exports.login = (req, res) => {
  const { email } = req.body;
  const { password } = req.body;
  // authorize user
  User.auth(email, password, (err, id) => {
    if (err) {
      res.status(400).send({
        message: err.message || 'Invalid email/password supplied',
      });
    } else {
      // get auth token
      User.getToken(id, (_err, getToken) => {
        if (_err) {
          res.status(500).send({
            message: err.message || 'Server Error',
          });
        } else if (getToken) {
          res.status(200).send({ id, token: getToken });
        } else {
          // if no token exists set a new one
          User.setToken(id, (__err, setToken) => {
            if (__err) {
              res.status(500).send({
                message: err.message || 'Server Error',
              });
            } else res.status(200).send({ id, token: setToken });
          });
        }
      });
    }
  });
};

// logout
exports.logout = (req, res) => {
  try {
    // delete current token
    const token = req.get('X-Authorization');
    User.deleteToken(token, (err) => {
      if (err) {
        res.status(401).send({
          message: err.message || 'Unauthorised',
        });
      } else {
        res.status(200).send({
          message: 'OK',
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: 'Server Error',
    });
  }
};
