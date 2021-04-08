const users = require('../controllers/user.controller.js');

module.exports = (app) => {
  // create new User
  app.post('/user', users.create);
  // login
  app.post('/user/login', users.login);
};
