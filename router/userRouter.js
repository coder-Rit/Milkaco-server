const express = require('express')
const { signUp, login, logOut, signUpFaculty } = require('../controller/userContoller')
const { isAuthenticated, authorizedRole } = require('../middleware/auth')
 

const Router = express.Router()

Router.route("/signup").post(signUp) 
Router.route("/login").post(login)
Router.route("/logout").get(logOut)
 

module.exports =Router