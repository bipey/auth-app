import { Router } from "express";
import { changePassword, forgetPassword, generateOTP, getUserProfile, logoutUser, refreshAccessToken, registerUser, userLogin, verifyOTP } from "../controllers/user.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router=new Router();

router.route("/register").post(registerUser)

router.route("/login").post(userLogin)

router.route("/logout").get(verifyJwt, logoutUser)

router.route("/refresh").post(refreshAccessToken)

router.route("/changepassword").post(verifyJwt, changePassword)

router.route("/sendOTP").post(generateOTP)

router.route("/verifyOTP").post(verifyJwt,verifyOTP)

router.route("/forgetPassword").post(verifyJwt,forgetPassword)
// router.route("/getProfile/:userName").get(verifyJwt,getUserChannelProfile)

router.route("/getProfile").get(verifyJwt,getUserProfile)   
export default router

