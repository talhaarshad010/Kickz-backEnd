if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const router = require('./src/routes');
const bodyParser = require('body-parser');

const App = express();
const Port = 3000;

// DataBase Path //
require('./src/config/dataBase');

// DataBase Path //
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({extended: true}));
App.use('/', router);
App.listen(Port, () => {
  console.log(`Server is Running at http://localhost:${Port}`);
});
