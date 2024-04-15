var unirest = require("unirest");
const catchAsyncErorr = require("../middleware/catchAsyncErorr");
const fs = require("fs");
const nodemailer = require("nodemailer");
const ErrorHandler = require("../utils/errorHandler");
const path = require("path");

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}

function saveOpt(way, otp, res, next) {
  const otpData = { way, otp, createdAt: new Date().getTime() };

  const directoryPath = path.join(__dirname, "../otp-storage");
  const filePath = path.join(directoryPath, `${way}.json`);

  console.log(filePath);

  // Store OTP with email in a file
  fs.writeFile(filePath, JSON.stringify(otpData), (err) => {
    if (err) {
      return next(new ErrorHandler("Failed to store OTP", 500));
    }
  });
}

// send OTP using phone
exports.sendOTP_phone = catchAsyncErorr(async (req, res, next) => {
  // Replace 'YOUR_API_KEY' with your actual Fast2SMS API key i
  const otp = generateOTP();

  // Define the message and phone number

  const apiEndpoint = "https://www.fast2sms.com/dev/bulkV2";

  const apikey = process.env.FAST2SMS_API;

  const route = "otp";
  const phone = req.params.phone;

  var req = unirest("GET", apiEndpoint);

  req.query({
    authorization: apikey,
    variables_values: otp,
    route: route,
    numbers: phone,
  });

  req.headers({
    "cache-control": "no-cache",
  });

  req.end(function (res) {
    if (res.error) throw new Error(res.error);
    saveOpt(phone, otp, res, next);
  });

  res.status(200).json({
    msg: "OPT sended",
  });
});

// send OTP using email
exports.sendOTP_email = catchAsyncErorr(async (req, res, next) => {
  const otp = generateOTP();

  let transporter = nodemailer.createTransport({
    service: "gmail", // true for 465, false for other ports
    port: 587,
    host: "smtp.gmail.com",
    auth: {
      user: `${process.env.MAIL_GMAIL}`, // generated ethereal user
      pass: `${process.env.MAIL_GMAIL_PASS}`, // generated ethereal password
    },
  });

  let message = {
    from: `"${process.env.PRODUCT_NAME}", <${req.params.email}>`, // sender address
    to: `${req.params.email}`, // list of receivers
    subject: `OTP Varification`, // Subject line
    text: "", // plain text body
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact Form Response</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f4f4f4;
        }
    
        .container {
          max-width: 600px;
          width: 100%;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
    
        h1 {
          text-align: center;
        }
    
        .response {
          margin-top: 20px;
          padding: 20px;
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
    
        .response p {
          margin: 0;
          padding: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>OTP</h1>
        <div class="response">
            Your OTP is ${otp}
        </div>
      </div>
    
      
    </body>
    </html>
    
         
         `, // html body
  };

  transporter
    .sendMail(message)
    .then((info) => {
      saveOpt(req.params.email, otp, res, next);

      return res.status(201).json({
        msg: "Query sended",
        status: true,
        info: info.messageId,
        preview: nodemailer.getTestMessageUrl(info),
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
});
