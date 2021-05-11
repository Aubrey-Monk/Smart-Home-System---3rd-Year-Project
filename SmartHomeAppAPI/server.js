const express = require('express');

const app = express();

// used to parse JSON bodies
app.use(express.json());

// used to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Smart Home App API!' });
});

require('./app/routes/user.routes.js')(app);
require('./app/routes/device.routes.js')(app);

// set port, listen for requests
app.listen(3333, () => {
  console.log('Server is running on port 3333.');
});
