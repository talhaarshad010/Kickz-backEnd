const userSchema = require('../../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {default: mongoose} = require('mongoose');

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
        // delete user.userPassword;
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
  console.log('email: ', userEmail);

  try {
    const User = await userSchema.findOne({userEmail});
    if (!User) {
      return res.status(400).json({
        success: false,
        message: "Email doesn't exist",
      });
    }

    const currentTime = new Date();
    const OTP_EXPIRY_DURATION = 2 * 60 * 1000; // 1 minute in milliseconds

    // Check if a code was generated and if it's within the last 1 minute
    if (
      User.expiryCode &&
      currentTime - new Date(User.expiryCode) < OTP_EXPIRY_DURATION
    ) {
      const timeDifference = (currentTime - new Date(User.expiryCode)) / 1000; // Difference in seconds
      return res.status(429).json({
        success: false,
        message: `Please wait ${Math.ceil(
          60 - timeDifference,
        )} seconds before requesting a new code`,
      });
    }

    // Generate OTP code
    const randomString = '1234567890';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += randomString[Math.floor(Math.random() * randomString.length)];
    }

    console.log(`Generated OTP code for ${userEmail}: ${code}`);

    // Update the OTP and expiry time
    User.otp = code;
    User.expiryCode = new Date(currentTime.getTime() + OTP_EXPIRY_DURATION); // Set expiry time to 1 minute from now
    await User.save();

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

    // Check if user exists
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if OTP and expiryCode exist
    if (!user.otp || !user.expiryCode) {
      return res.status(400).json({
        success: false,
        message: 'OTP not generated, please request a new one',
      });
    }

    const currentTime = new Date();

    // Check if OTP has expired (assuming expiryCode is set as the expiration time)
    if (currentTime > user.expiryCode) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired, please request a new one',
      });
    }

    // Verify if OTP is correct
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    // OTP is verified, clear the OTP and expiration time
    // user.otp = null;
    // user.expiryCode = null;
    // await user.save();

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

// const verifyOtp = async (req, res) => {
//   const {userEmail, otp} = req.body;
//   console.log('is data receive:', userEmail, otp);
//   try {
//     const user = await userSchema.findOne({userEmail});
//     // console.log('the user we get:  ', user);
//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: 'User not found',
//       });
//     }

//     // Check if the OTP has been set for the use
//     if (!user.otp || !user.expiryCode) {
//       return res.status(400).json({
//         success: false,
//         message: 'OTP not generated, please request a new one',
//       });
//     }

//     // Check if OTP has expired
//     if (new Date() > user.expiryCode) {
//       return res.status(400).json({
//         success: false,
//         message: 'OTP has expired, please request a new one',
//       });
//     }

//     // Verify the OTP
//     if (user.otp !== otp) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid OTP',
//       });
//     }

//     // OTP is verified, clear the OTP and expiration time
//     user.otp = null;
//     user.expiryCode = null;
//     await user.save();

//     res.send({
//       success: true,
//       message: 'OTP verified successfully',
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'An error occurred during OTP verification',
//       // error,
//     });
//   }
// };

const updatePassword = async (req, res) => {
  const {userEmail, otp, newPassword} = req.body;
  console.log('Received data:', {userEmail, otp, newPassword});

  try {
    const user = await userSchema.findOne({userEmail});

    // Check if user exists
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if OTP and expiryCode exist
    if (!user.otp || !user.expiryCode) {
      return res.status(400).json({
        success: false,
        message: 'OTP not generated or expired, please request a new one',
      });
    }

    // Check if OTP has expired
    const currentTime = new Date();
    // const OTP_EXPIRY_DURATION = 1 * 60 * 1000; // 1 minute in milliseconds
    if (currentTime > new Date(user.expiryCode)) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired, please request a new one',
      });
    }

    // Verify the OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear OTP details
    user.userPassword = hashedPassword;
    user.otp = null; // Clear OTP after use
    user.expiryCode = null; // Clear expiry time
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
