const bcrypt = require('bcrypt');
const User = require('../models/user.model.js');

// Create + Save a new User
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
  }

  // Generate salt and hashed password
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create User
  const user = new User({
    user_firstname: req.body.firstname,
    user_lastname: req.body.lastname,
    user_email: req.body.email,
    user_password: hashedPassword,
    user_salt: salt,
  });

  // Save User
  User.create(user, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the User.',
      });
    } else res.send(data);
  });
};
