const userSchema = require('../../models/userModel');
const instructorSchema = require('../../models/instructorModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const resetPassword = require('../../models/passwordReset');
const randomString = require('randomstring');
const {default: mongoose} = require('mongoose');
const nodemailer = require('nodemailer');
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
        delete user.userPassword;
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

const forgotpassword = async (req, res) => {
  const {userEmail, userName} = req.body;

  try {
    const User = await userSchema.findOne({
      userEmail,
    });
    if (!User) {
      return res.status(400).json({
        success: false,
        msg: "Email doesn't exist",
      });
    }

    let expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 1);
    const randomString = '1234567890';

    let code = '';
    for (let i = 0; i < 4; i++) {
      code += randomString[Math.floor(Math.random() * randomString.length)];
    }

    const updateUser = await userSchema.updateOne(
      {userEmail},
      {
        $set: {
          isCode: code,
          expiryCode: expiryTime,
        },
      },
    );

    if (!!updateUser) {
      const message = `
        <h1>Reset Password - KICKS</h1>
        <p>Dear ${userName},</p>
        <p>Your OTP code is: <b>${code}</b></p>
        <p>This code is valid for 1 minutes.</p>`;

      const Mail = nodemailer.createTransport({
        host: 'smtp.logicloopsolutions.net',
        port: 465,
        secure: true,

        auth: {
          user: 'talhaarshad010@gmail.com',
          pass: 'Program@403',
        },
      });

      Mail.sendMail(
        {
          subject: 'Forget Password',
          from: 'talhaarshad010@gmail.com',
          to: userEmail,
          html: message,
        },
        (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
          } else {
            console.log('Email sent:', info.response);
          }
        },
      );
    }
    res.send({
      message: 'Code Has Been Sent to Your Email PLzz CHeck it ',
    });
  } catch (error) {
    res.send({
      message: 'Not',
      status: false,
      iserror: error,
    });
  }
};

const resetpassword = async (req, res) => {};

module.exports = {
  userSignup,
  userLogin,
  instructorSignup,
  instructorLogin,
  forgotpassword,
  resetpassword,
};
