import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import zxcvbn from "zxcvbn";
dotenv.config();
import nodemailer from "nodemailer";
import multer from "multer";
import fs from "fs";

// maxAge for token expiration time in seconds(3 days).
const maxAge = 3 * 24 * 60 * 60;

// function to create token(Cookie) for users and Admins along with email and _id.
/**
 * Provides a JWT token for Admin or user.
 * @param {String} Email Admin or user Email
 * @param {String} ObjectId object id of Admin or user.
 * @returns {String} Jwt Token
 */
export const createToken = (email, id) => {
  return jwt.sign({ userId: id, email }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

/**
 *
 * @param {String} password Password to be checked for strength.
 * @param {*} res Response Object it is optional.
 * @returns {Object} Returns suggestions to improve password if password is weak.
 */
export const checkPasswordStrength = (password, res) => {
  const result = zxcvbn(password);
  console.log(result);
  if (result.score < 3) {
    // Accept passwords only if score is 3 or above
    console.log(result.feedback.suggestions);
    return res.status(400).json({
      message: "Weak password. Please try improving your password.",
      suggestions: result.feedback.suggestions,
    });
  }
};

/**
 * Function to send email to user.
 * @param {Object} option Object containing email, subject and message.
 */
export function sendEmail(option) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    port: process.env.EMAIL_PORT,
  });

  const emailOptions = {
    from:`Pizzeria Support <${process.env.SYSTEM_EMAIL}>`,
    to: option.email,
    subject: option.subject,
    text: option.message,
    };

    transporter.sendMail(emailOptions);
}

/**
 * Function to setup storage directory for image in the server.
 */
const storage = multer.diskStorage({
    destination: function (_, __, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (_, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

/**
 * Function to upload image to a defined storage directory in the server.
 */
export const upload = multer({ storage: storage });