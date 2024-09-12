
import { User } from "../models/user.model.js";
import  jwt  from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { mailer } from "../utils/mailer.utils.js";
import crypto from "crypto"


//generate access and refresh token
const generateAccessRefreshToken=async(userId)=>{
    const LoggedUser=await User.findById(userId)
    const accessToken=await LoggedUser.generateAccessToken()
    const refreshToken=await LoggedUser.generateRefreshToken()
    LoggedUser.refreshToken=refreshToken
await LoggedUser.save()
return {accessToken,refreshToken}
}


//User Register operation
const registerUser = async (req, res) => {
    try {
        const { email, userName, fullName, password, confirmPassword } = req.body;
        
        // Check for empty fields
        if (!email || !fullName || !password || !userName) {
            return res.status(400).json({message:"All fields are required"});
        }

        // Check if email already exists
        const checkEmail = await User.findOne({ email: email });
        if (checkEmail) {
            return res.status(400).send({message:"Email already exists"});
        }

        // Check if username already exists
        const checkUserName = await User.findOne({ userName: userName });
        if (checkUserName) {
            return res.status(400).json({message:"UserName already exists"});
        }

        // Check password length
        if (password.length < 8) {
            return res.status(400).json({message:"Password should be of minimum 8 characters"});
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({message:"Passwords do not match"});
        }

        // Create new user
        const userData = await User.create({
            email: email.toLowerCase(),
            fullName,
            password,
            userName: userName.toLowerCase()
        });

        if (!userData) {
            return res.status(400).json({message:"Something went wrong while saving data to the database"});
        }

        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({message:"An error occurred while creating the user"});
    }
};



// login function

const userLogin= async(req,res)=>{
    const {email, password}=req.body
    const isUserRegistered= await User.findOne({email:email})
    if(!isUserRegistered){
        return res.status(401).json("User is not registered")
    }
    const checkPassword= await isUserRegistered.comparePassword(password)
    if(!checkPassword){
        return res.status(401).json("Wrong password")
    }
    const{accessToken,refreshToken}=await generateAccessRefreshToken(isUserRegistered._id);
    // console.log(accessToken,"\n", refreshToken)
    const cookieOptions={
    httpOnly:true, //the cookie cant be ready by client
    secure:true
}

     res.status(200)
    .cookie("AccessToken",accessToken,cookieOptions)  //setting the cookies
    .cookie("RefreshToken",refreshToken,cookieOptions)
    .json({message:"User Logged In"})
    const getCookies= req.cookies
    // console.log(getCookies)    //getting the cookies
    // console.log(getCookies['Refresh Token'])
}
const logoutUser= async (req,res)=>{
    // console.log(req.loggedInUser._id)
    if (!req.loggedInUser || !req.loggedInUser._id) {
        return res.status(401).json({message:"User not logged in"});
    }
   const loggedInUser=req.loggedInUser

   loggedInUser.refreshToken = undefined;
   await loggedInUser.save();

    const cookieOptions={
        httpOnly:true,
        secure:true
    }
    return res.status(201)
    .clearCookie("AccessToken",cookieOptions)
    .clearCookie("RefreshToken",cookieOptions)
    .json({message:"User Logged Out"})
}


//Refreshing access Token
const refreshAccessToken = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies?.RefreshToken || req.body.refreshToken;
        
        if (!incomingRefreshToken) {
            return res.status(401).json("Unauthorized request");
        }



        // Verify the incoming refresh token
        const decodedRefreshToken = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedRefreshToken._id);
        
        if (!user) {
            return res.status(401).json("Invalid token");
        }

        // Log tokens for comparison
        // console.log("Incoming refresh token:", incomingRefreshToken);
        // console.log("Stored refresh token:", user.refreshToken);

        // Ensure the incoming token matches the one in the database
        if (incomingRefreshToken !== user.refreshToken) {
            return res.status(401).json("Refresh token expired or used");
        }

        // Generate new tokens
        const { accessToken, refreshToken:newRefreshToken } = await generateAccessRefreshToken(user._id);
        // console.log("New refresh token:", newRefreshToken);
        // console.log(accessToken)

        // Update user's refresh token and save
        // user.refreshToken = newRefreshToken;
        // await user.save();

        // Set cookies
        const cookieOptions = {
            httpOnly: true,
            secure: true,  // Set to false for local testing if not using HTTPS
        };

        res.status(201)
            .cookie("AccessToken", accessToken, cookieOptions)
            .cookie("RefreshToken", newRefreshToken, cookieOptions)
            .json("Token refreshed");

    } catch (error) {
        console.log("Error occurred while decoding the tokens:", error.message);
        return res.status(500).json("Internal Server Error");
    }
};


//change password

const changePassword= async(req,res)=>{
try {
        const {currentPassword, newPassword, confirmPassword}=req.body
        // console.log(currentPassword, newPassword, confirmPassword)
        const loggedInUser=req.loggedInUser
        if(newPassword.length<8){
            return res.status(400).json("Password should be of minimum 8 characters")
        }
        
        const checkPassword= await loggedInUser.comparePassword(currentPassword)
        if(!checkPassword){
            return res.status(401).json("Enter the correct current password")
        }
        if(newPassword===currentPassword){
            return res.status(401).json("The new password cant be same as old password")
        }
        if(newPassword!==confirmPassword){
            return res.status(401).json("The passwords should match")
        }
        loggedInUser.password= newPassword
        await loggedInUser.save();
        return res.status(200).json("Password updated.")
} catch (error) {
    console.log("Error occured:",error)
}
}


const forgetPassword= async(req,res)=>{
    try {
            const {newPassword, confirmPassword}=req.body
       
            const loggedInUser=req.loggedInUser
            if(newPassword.length<8){
                return res.status(400).json({message:"Password should be of minimum 8 characters"}) 
            }

            if(newPassword!==confirmPassword){
                return res.status(401).json({message:"The passwords should match"})
            }
            loggedInUser.password= newPassword
            loggedInUser.refreshToken = undefined;
            await loggedInUser.save();
            return res.status(200)
            .clearCookie("AccessToken")
            .clearCookie("RefreshToken")
            .json({message:"Password updated."})
    } catch (error) {
        console.log("Error occured:",error)
        return res.status(500).json({message:error.message})
    }
    }
    

//check email
const generateOTP=async(req,res)=>{
   try {
     const email=req.body.email

     const user= await User.findOne({email:email})
     if(!user){
         return res.status(401).json("No user found")
     }
     const cookieOptions = {
        httpOnly: true,
        secure: true,  // Set to false for local testing if not using HTTPS
    };
     const {accessToken,refreshToken}=await generateAccessRefreshToken(user._id);
     const OTP= crypto.randomInt(1000,9999).toString();
     const otpExpiry=Date.now()+2*60*1000;
     user.OTP=OTP;
     user.otpExpiry=otpExpiry
     await user.save();
     await mailer(email,"Your OTP",`Dear ${user.fullName}, your otp is ${OTP}, and will expire in 2 minutes.`)
     return res.status(200)
     .cookie("AccessToken",accessToken, cookieOptions)
     .cookie("RefreshToken",refreshToken, cookieOptions)
     .json({message:"OTP sent to your email"})
   } catch (error) {
    console.log("Error occured", error.message)
    return res.status(500).json("Error occured while sending otp")
   }

}
//verify OTP
const verifyOTP= async(req, res)=>{
 try {
    const loggedInUser=req.loggedInUser
    const OTP =req.body.otp

if(!OTP){
    return res.status(401).json({message:"OTP is required"})
}
    if(OTP!=loggedInUser.OTP){
        return res.status(401).json({message:"Invalid OTP"})
    }
   
    if(Date.now()>loggedInUser.otpExpiry){
        loggedInUser.OTP=undefined
        loggedInUser.otpExpiry=undefined
    loggedInUser.refreshToken = undefined;       
        await loggedInUser.save();
        return res.status(401).json("OTP expired. Please try again")
    }
    // user.password=changePassword
    loggedInUser.OTP=undefined
    loggedInUser.otpExpiry=undefined
    
    await loggedInUser.save();
    return res.status(200)
    .send({
        success:true,
        message: "OTP verified successfully"
    });
} catch (error) {
    console.log("Error occurred:", error.message);
    return res.status(500)
    .send({
        message: "Error occurred while changing the password"
    });
}
};


const getUserProfile=async(req,res)=>{
   try {
     const getUser= await User.findOne({_id:req.loggedInUser._id})
        if(!getUser){
            return res.status(401).json("No user found")
        }
     return res.status(200).json({data:getUser, message:"User Profile"})
   } catch (error) {
    console.log("Error occured", error.message)
    return res.status(500).json("Error occured while fetching user profile")    
   }
}
 //exporting the functions
export {registerUser, userLogin, logoutUser, refreshAccessToken, changePassword, verifyOTP,generateOTP, getUserProfile,forgetPassword}