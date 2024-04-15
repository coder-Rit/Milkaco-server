const express = require('express')
const { uploadImage ,uploadVideo} = require('../controller/uploadsController')
 

const Router = express.Router()

Router.route("/uploadImage/:imgName").post(uploadImage) 
Router.route("/uploadVideo/:vidName").post(uploadVideo) 
 
 

module.exports =Router