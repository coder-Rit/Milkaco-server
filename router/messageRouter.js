const express = require('express')
const {  sendOTP_phone, sendOTP_email } = require('../controller/sendotpController')
 
 

const Router = express.Router()

Router.route("/sendOTP_phone/:phone").post(sendOTP_phone) 
Router.route("/sendOTP_email/:email").post(sendOTP_email) 
 
 


module.exports =Router