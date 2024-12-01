const express = require('express');
const routeRouter = express.Router();
const User = require('./User/userroute');

routeRouter.get('/', (req, res) => {
  res.send('Welcome to the home page!');
});

routeRouter.use('/', User);

module.exports = routeRouter;
