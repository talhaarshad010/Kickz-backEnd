if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const router = require('./src/routes');
const bodyParser = require('body-parser');

const App = express();
const Port = 6000;

// DataBase Path //
require('./src/config/dataBase');

// DataBase Path //
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({extended: true}));
App.use('/', router);
App.listen(Port, () => {
  console.log('Hello World');
});
