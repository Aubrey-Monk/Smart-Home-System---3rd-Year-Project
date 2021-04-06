module.exports = (app) => {
  const users = require('../controllers/user.controller.js');

  // Create new User
  app.post('/user', users.create);
};
