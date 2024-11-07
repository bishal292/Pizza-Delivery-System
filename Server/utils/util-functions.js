import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import zxcvbn from "zxcvbn";
dotenv.config();

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
    if (result.score < 3) { // Accept passwords only if score is 3 or above
        console.log(result.feedback.suggestions);
        return res.status(400).json({
            message: 'Weak password. Please try improving your password.',
            suggestions: result.feedback.suggestions,
        });
    }
}
