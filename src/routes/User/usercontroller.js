const userSchema = require('../../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {default: mongoose} = require('mongoose');
const {sendEmail} = require('../../Helpers/mailer');

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

const userLogin = async (req, res) => {
  const {userEmail, userPassword} = req.body;
  console.log(userEmail, userPassword);
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
        checkUser.isToken = Token;
        await checkUser.save();
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
const forgetpassword = async (req, res) => {
  const {userEmail} = req.body;

  try {
    const User = await userSchema.findOne({userEmail});
    if (!User) {
      return res.status(400).json({
        success: false,
        message: "Email doesn't exist",
      });
    }

    const {userName} = User;
    const currentTime = new Date();
    const OTP_EXPIRY_DURATION = 2 * 60 * 1000;

    if (
      User.expiryCode &&
      currentTime - new Date(User.expiryCode) < OTP_EXPIRY_DURATION
    ) {
      const timeDifference = (currentTime - new Date(User.expiryCode)) / 1000;
      return res.status(429).json({
        success: false,
        message: `Please wait ${Math.ceil(
          60 - timeDifference,
        )} seconds before requesting a new code`,
      });
    }

    const randomString = '1234567890';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += randomString[Math.floor(Math.random() * randomString.length)];
    }

    const expiryCode = new Date(currentTime.getTime() + OTP_EXPIRY_DURATION);

    const updateUser = await userSchema.updateOne(
      {_id: User._id},
      {
        otp: code,
        expiryCode: expiryCode,
      },
    );

    if (!!updateUser) {
      const HTML_Email = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Template</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Dear ${userName},</p>
          <p>Here is your verification code to reset your password. Please use it within the next 2 minutes.</p>
          <hr>
          <p><strong>Verification Code:</strong> ${code}</p>
          <hr>
          <p>If you didn't request this verification code, please ignore this message.</p>
          <br>
          <p>Best regards,<br>Kicks Support Team</p>
        </body>
        </html>
      `;

      const mailContent = {
        from: 'talha@logicloopsolutions.net',
        to: userEmail,
        subject: 'Verification Code - Kicks',
        html: HTML_Email,
      };

      await sendEmail(mailContent);
      console.log(`Generated OTP code for ${userEmail}: ${code}`);
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to update user OTP',
      });
    }

    res.send({
      success: true,
      message: `Code has been sent to ${userEmail}, please check your email.`,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'An error occurred',
      success: false,
      error,
    });
  }
};

const verifyOtp = async (req, res) => {
  const {userEmail, otp} = req.body;
  console.log('Received data:', {userEmail, otp});

  try {
    const user = await userSchema.findOne({userEmail});

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.otp || !user.expiryCode) {
      return res.status(400).json({
        success: false,
        message: 'OTP not generated, please request a new one',
      });
    }

    const currentTime = new Date();

    if (currentTime > user.expiryCode) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired, please request a new one',
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during OTP verification',
    });
  }
};

const updatePassword = async (req, res) => {
  const {userEmail, otp, newPassword} = req.body;
  try {
    const user = await userSchema.findOne({userEmail});

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.otp || !user.expiryCode) {
      return res.status(400).json({
        success: false,
        message: 'OTP not generated or expired, please request a new one',
      });
    }

    const currentTime = new Date();
    if (currentTime > new Date(user.expiryCode)) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired, please request a new one',
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.userPassword = hashedPassword;
    user.otp = null;
    user.expiryCode = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the password',
      error,
    });
  }
};

module.exports = {
  userSignup,
  userLogin,
  forgetpassword,
  verifyOtp,
  updatePassword,
};
