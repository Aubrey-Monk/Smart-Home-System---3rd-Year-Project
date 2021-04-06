const users = require('../controllers/user.controller.js');

module.exports = (app) => {
  // Create new User
  app.post('/user', users.create);
  // Login
  // app.post('/user/login', users.login);
};
