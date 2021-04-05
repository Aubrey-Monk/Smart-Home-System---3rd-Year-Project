const User = require('../models/user.model.js');

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
  }

  // Create a User
  const user = new User({
    user_firstname: req.body.firstname,
    user_lastname: req.body.lastname,
    user_email: req.body.email,
    user_password: req.body.password,
    user_salt: req.body.salt,
  });

  // Save User in the database
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the User.',
      });
    else res.send(data);
  });
};
