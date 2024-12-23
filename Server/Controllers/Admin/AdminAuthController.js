import { Admin } from "../../db/models/AdminModel.js";
import bcrypt from "bcrypt";
import { createToken, sendEmail } from "../../utils/util-functions.js";
import validator from "validator";
import { configDotenv } from "dotenv";
import { checkPasswordStrength } from "../../utils/util-functions.js";
import crypto from "crypto";

configDotenv();

const maxAge = process.env.MAX_AGE;

export const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).send("Please provide email and password");

    if (!validator.isEmail(email))
      return res.status(400).send("Please provide a valid email");

    //Check if user exists in database.
    const user = await Admin.findOne({ email });
    if (!user) return res.status(401).send("No User Exists with this email");

    const auth = await bcrypt.compare(password, user.password);

    if (!auth) return res.status(401).send("Invalid Credentials");

    res.cookie("jwt", createToken(user.email, user._id), {
      secure: process.env.NODE_ENV === "production",
      sameSite: false,
      maxAge,
    });

    res.status(200).json({
      message:"Logged In as Admin",
      _id:user._id,
      name:user.name,
      email:user.email,
      role:'admin'
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const signUp = async (req, res, next) => {
  try {
    console.log(req.body);
    const { name, email, password, secretKey } = req.body;
    if (!name || !email || !password || !secretKey)
      return res.status(400).send("Please provide all fields");

    if (!validator.isEmail(email))
      return res
        .status(400)
        .send("Entered Email is not valid, Please provide a valid email");
    const user = await Admin.findOne({ email });
    if (user)
      return res
        .status(400)
        .send(
          "User already exists with this email, Please login, or use another email for signup."
        );

    if (secretKey !== process.env.ADMIN_CREATION_SECRET_KEY)
      return res.status(401).send("Invalid Secret Key");

    // checkPasswordStrength(password); // If password strength is less secure then simply respond with a message to improve password and try again.

    const newUser = await Admin.create({ name, email, password });
    if (!newUser) return res.status(500).send("Internal Server Error");

    res.cookie("jwt", createToken(newUser.email, newUser._id), {
      secure: process.env.NODE_ENV === "production",
      sameSite: false,
      maxAge,
    });

    res.status(201).json({
      message:"Admin Created Successfully",
      _id:newUser._id,
      name:newUser.name,
      email:newUser.email,
      role:'admin'
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const logOut = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(400).send("You are not logged in");
    res.clearCookie("jwt");
    res.status(200).send("Logged Out Successfully");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const userId = req.userId;
    console.log(userId);
    const { oldPassword, newPassword } = req.body;

    console.log(oldPassword);

    if (!userId) return res.status(400).send("You are not logged in");

    if (!oldPassword || !newPassword)
      return res.status(400).send("Please provide old and new password");

    const user = await Admin.findById(userId);

    if (!user) return res.status(400).send("User not found");

    if (oldPassword === newPassword)
      return res.status(400).send("Old and New Passwords Cannot be same.");

    const auth = await bcrypt.compare(oldPassword, user.password);

    if (!auth) return res.status(401).send("Old Password didnot match");

    // checkPasswordStrength(newPassword); // If password strength is less secure then simply respond with a message to improve password and try again.
    user.password = newPassword;

    await user.save();

    res.status(200).send("Password Changed Successfully");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const forgotpassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).send("Please provide email");
    if (!validator.isEmail(email))
      return res
        .status(400)
        .send("Entered Email is not valid, Please provide a valid email");
    const user = await Admin.findOne({ email });
    if (!user)
      return res
        .status(400)
        .send("User not found with this email please provide a valid email");

    if (user.resetOTP && (Date.now() < user.resetOTPExpires)) {
      return res
        .status(400)
        .send(
          "Password Reset OTP is already sent to your email , Please check your email"
        );
    }

    // instance method to create reset password token.
    const resetToken = user.createPasswordResetOTP();
    await user.save();

    const message = `We have received a password reset request for your account, Please use the below OTP to reset your password : \n\n${resetToken}\n\nThid reset OTP is valid till next 10 minutes only. If you are not trying to reset your password, please ignore this email!`;
    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        message,
      });

      res
        .status(200)
        .send(
          "Reset Password OTP Sent to your email, please check your email"
        );
    } catch (error) {
      console.log(error.message);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      return res
        .status(500)
        .send("Error in sending email, Please try again later");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const resetpassword = async (req, res, next) => {
    try {
        const token = crypto.createHash("sha256").update(req.params.token).digest("hex");

        // Find user with the token and token expiry time greater than current time.
        const user = await Admin.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() },
        });
        if (!user) return res.status(400).send("Invalid or Expired Token, Please try again");

        const { password , confirmPassword } = req.body;
        if (!password || !confirmPassword) return res.status(400).send("Please provide password and confirm password");

        if (password !== confirmPassword) return res.status(400).send("Password and Confirm Password must be same.");

        if(await bcrypt.compare(password, user.password)) return res.status(400).send("New Password cannot be same as old password");
        // checkPasswordStrength(password); // If password strength is less secure then simply respond with a message to improve password and try again.

        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        // res.status(200).send("Password Reset Successfully! Please login with your new password");

        res.cookie("jwt", createToken(user.email, user._id), {
            secure: process.env.NODE_ENV === "production",
            sameSite: false,
            maxAge,
          });
      
          res.status(200).json({
            message:"Password Reset Successfully!, And logged in as Admin",
            _id:user._id,
            name:user.name,
            email:user.email,
            role:'admin'
          });
          
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }

};

export const AdminInfo = async (req, res, next) => {

    try {
        const userId = req.userId;
        if (!userId) return res.status(400).send("You are not Authenticated, Try logging in or signing up");

        const user = await Admin.findById(userId).select("_id name email");
        if (!user) return res.status(400).send("User not found");

        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:'admin'
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");        
    }
  next();
};
