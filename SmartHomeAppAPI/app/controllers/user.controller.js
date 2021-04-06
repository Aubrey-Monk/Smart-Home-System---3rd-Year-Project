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

  // Generate salt and hash password on seperate function calls
  const saltRounds = 10;
  let hashed_password = 0;
  let generated_salt = 0;
  await bcrypt.genSalt(saltRounds, function (err, salt) {
    generated_salt = salt;
    console.log(salt);
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      hashed_password = hash;
      console.log(hash);
    });
  });
  console.log(hashed_password);
  console.log(generated_salt);
  // Create User
  const user = new User({
    user_firstname: req.body.firstname,
    user_lastname: req.body.lastname,
    user_email: req.body.email,
    user_password: hashed_password,
    user_salt: generated_salt,
  });

  // Save User
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the User.',
      });
    else res.send(data);
  });
};
