const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes');
const app = express();

mongoose.Promise = global.Promise;

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost/spacetime');
}

app.use(bodyParser.json());

routes(app);

// Middleware to handle error responses
app.use((err, req, res, next) => {
  console.log('Error: ', err);
  res.status(422).json({ error: err.message });
  next();
});

app.listen(3050, () => {
  console.log('Running on port 3050');
});

module.exports = app;
