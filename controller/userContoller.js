const fs = require("fs");
const path = require('path');



const catchAsyncErorr = require("../middleware/catchAsyncErorr");
const userModel = require("../model/userModel");
const ErrorHandler = require("../utils/errorHandler");
const sendJwt = require("../utils/sendJwt");
 

// these fuction are in  

 // Updated verifyOTP function
function verifyOTP(req, res, next) {
  const { email, phone, otp } = req.body;
  if (!otp || !(email || phone)) {
    return next(new ErrorHandler("Email or phone and OTP are required", 400));
  }

  const way = email || phone;
  const directoryPath = path.join(__dirname, '../otp-storage');
  const filePath = path.join(directoryPath, `${way}.json`);

  console.log(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      return next(new ErrorHandler("OTP Expired or not found", 404));
    }
    const otpData = JSON.parse(data);

    const isOtpValid = otpData.otp === otp;
    const isOtpExpired = new Date().getTime() - otpData.createdAt >= 300000; // 5 minutes

    fs.unlink(filePath, err => {
      if (err) {
        console.log("Failed to delete OTP file:", err);
      }
      if (!isOtpValid || isOtpExpired) {
        return next(new ErrorHandler("Invalid or expired OTP", 400));
      }
      // Call next only if OTP is valid and not expired
      next();
    });
  });
}

// Updated signUp function to handle errors properly
exports.signUp = catchAsyncErorr(async (req, res, next) => {
  verifyOTP(req, res, async (err) => {
    if (err) {
      return next(err); // Pass any errors from verifyOTP to the error handler
    }

    let userData = { ...req.body };
    delete userData.otp;

    try {
      const newAcc = await userModel.create(userData);
      sendJwt(newAcc, res, "Account created successfully", 201, req);
    } catch (error) {
        console.log(error);
      return next(new ErrorHandler("Failed to create account", 500));
    }
  });
});



// loged in
exports.login = catchAsyncErorr(async (req, res, next) => {
  const { email, password, phone } = req.body;

  let way;
  if (email) {
    way = {
      type: "email",
      selector: email,
    };
  } else if (phone) {
    way = {
      type: "phone",
      selector: phone,
    };
  } else {
    return next(new ErrorHandler("Please provide email or phone credentials", 400));
  }

  const user = await userModel.findOne({ [way.type]: way.selector }).select("+password");
  if (!user) {
    return next(new ErrorHandler("User does not exist", 404));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect password", 401));
  }

  sendJwt(user, res, "Logged in successfully", 200, req);
});


// log out
exports.logOut = catchAsyncErorr((req, res, next) => {
  res
    .clearCookie("token", {
      expire: new Date(Date.now() - 1000),
      httpOnly: true,
    })
    .json({
      msg: "logout successfully",
      logOut: true,
    });
});
