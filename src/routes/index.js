const express = require('express');
const routeRouter = express.Router();
const User = require('./User/userroute');

routeRouter.use('/', User);

module.exports = routeRouter;
