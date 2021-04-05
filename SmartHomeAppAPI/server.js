const express = require('express');

const app = express();

app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Smart Home App API!' });
});

// set port, listen for requests
app.listen(3000, () => {
  console.log('Server is running on port 3000.');
});
