const userSchema = require('../../models/userModel');
const instructorSchema = require('../../models/instructorModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSignup = async (req, res) => {
  const {userEmail, userPassword} = req.body;

  try {
    let userValidate = await userSchema.findOne({
      userEmail: userEmail,
    });
    if (!userValidate) {
      const salt = await bcrypt.genSalt();
      const bcryptPassword = await bcrypt.hash(userPassword, salt);

      let result = await userSchema.create({
        ...req.body,
        userPassword: bcryptPassword,
      });
      res.send({
        data: result,
        message: 'User Successfully Created..!!',
        status: true,
      });
    } else {
      res.status(403).json({
        error: 'User already exist',
        status: false,
      });
    }
  } catch (error) {
    res.status(403).json({
      error: error.message,
      status: false,
    });
  }
};

const instructorSignup = async (req, res) => {
  const {userEmail, userPassword} = req.body;

  try {
    let userValidate = await instructorSchema.findOne({
      userEmail: userEmail,
    });
    if (!userValidate) {
      const salt = await bcrypt.genSalt();
      const bcryptPassword = await bcrypt.hash(userPassword, salt);

      let result = await instructorSchema.create({
        ...req.body,
        userPassword: bcryptPassword,
      });
      res.send({
        data: result,
        message: 'User Successfully Created..!!',
        status: true,
      });
    } else {
      res.status(403).json({
        error: 'User already exist',
        status: false,
      });
    }
  } catch (error) {
    res.status(403).json({
      error: error.message,
      status: false,
    });
  }
};

const userLogin = async (req, res) => {
  const {userEmail, userPassword} = req.body;
  try {
    let checkUser = await userSchema.findOne({
      userEmail: userEmail,
    });
    if (!!checkUser) {
      const checkPass = await bcrypt.compare(
        userPassword,
        checkUser.userPassword,
      );
      if (!!checkPass) {
        const Token = jwt.sign(
          {useid: checkUser.id, userEmail},
          process.env.SECRET_KEY,
        );
        let user = {...checkUser._doc, isToken: Token};
        res.send({
          data: user,
          status: true,
        });
      } else {
        res.status(403).json({
          error: 'Email/Password is incorrect',
          status: false,
        });
      }
    } else {
      res.status(403).json({
        error: 'Email/Password is incorrect',
        status: false,
      });
    }
  } catch (error) {
    res.status(403).json({
      error: error.message,
      status: false,
    });
  }
};

const instructorLogin = async (req, res) => {
  const {userEmail, userPassword} = req.body;
  try {
    let checkUser = await instructorSchema.findOne({
      userEmail: userEmail,
    });
    if (!!checkUser) {
      const checkPass = await bcrypt.compare(
        userPassword,
        checkUser.userPassword,
      );

      if (!!checkPass) {
        const Token = jwt.sign(
          {useid: checkUser.id, userEmail},
          process.env.SECRET_KEY,
        );
        let user = {...checkUser._doc, isToken: Token};
        res.send({
          data: user,
          status: true,
        });
      } else {
        res.status(403).json({
          error: 'Email/Password is incorrect',
          status: false,
        });
      }
    } else {
      res.status(403).json({
        error: 'Email/Password is incorrect',
        status: false,
      });
    }
  } catch (error) {
    res.status(403).json({
      error: error.message,
      status: false,
    });
  }
};
module.exports = {userSignup, userLogin, instructorSignup, instructorLogin};
