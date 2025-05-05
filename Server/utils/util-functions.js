import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import zxcvbn from "zxcvbn";
dotenv.config();
import nodemailer from "nodemailer";
import multer from "multer";
import fs from "fs";
import { Inventory } from "../db/models/InventoryModel.js";
import { Admin } from "../db/models/AdminModel.js";
import { Pizza } from "../db/models/PizzaModels.js";

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
    from: `Pizzeria Support <${process.env.SYSTEM_EMAIL}>`,
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  transporter.sendMail(emailOptions);
}

export const sendEmailToAdmins = async (option) => {
  const admins = await Admin.find({}, "email");
  const emails=[];
  admins.forEach((admin) => {
    emails.push(admin.email);
  });
  const formattedEmails = emails.join(", ");
  console.log("Sending email to admins:", formattedEmails);

  const emailOptions = {
    from: process.env.SYSTEM_EMAIL,
    to: formattedEmails,
    subject: option.subject,
    text: option.message,
  };
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    port: process.env.EMAIL_PORT,
  });
  return await transporter.sendMail(emailOptions);
};

/**
 * Function to setup storage directory for image in the server.
 */
const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (_, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

/**
 * Function to upload image to a defined storage directory in the server.
 */
export const upload = multer({ storage: storage });

/**
 * Function to Calculate price of customized pizza on base of customizations.
 * @param {Object}  pizza -> Pizza object for which price is to be calculated.
 * @param {Object} Customizations -> customizations array according to which price will vary.
 * @returns {Number} Returns price of the customized pizza.
 */
export const calculatePrice = async (pizza, customizations) => {
  let price = pizza.price;

  if (customizations.base) {
    const baseItem = await Inventory.findById(customizations.base);
    if (baseItem) price += baseItem.price - pizza.base.price;
  }

  for (const category of ["sauce", "cheese", "toppings"]) {
    for (const itemId of customizations[category] || []) {
      const item = await Inventory.findById(itemId);
      if (item) price += item.price;
    }
  }

  return price;
};

/**
 * Function to get formatted and Populated cart items.This function will work for art Models as well as for Order Models.
 * @param {cart} Object containing cart items's array.
 * @returns {Array} Returns formatted and Populate cart items.
 */
export async function getFormattedCartItems({ cart }) {
  // cart.items = await Promise.all(
  //   cart.items.map(async (item) => {
  //     const { pizza, customizations } = item;
  //     const popPizza = await Pizza.findById(pizza)
  //       .populate("base sauce cheese toppings", "name")
  //       .lean();
  //     return {
  //       pizza: popPizza,
  //       quantity: item.quantity,
  //       price: item.price,
  //       finalPrice: item.finalPrice,
  //       customizations: customizations
  //     };
  //   })
  // );

  const origBaseIds = [];
  const origSauceIds = [];
  const origCheeseIds = [];
  const origToppingIds = [];
  const baseIds = [];
  const sauceIds = [];
  const cheeseIds = [];
  const toppingIds = [];
  cart.items.forEach((item) => {
    origBaseIds.push(item.pizza.base);
    if(item.pizza.sauce) origSauceIds.push(...item.pizza.sauce);
    if(item.pizza.cheese) origCheeseIds.push(...item.pizza.cheese);
    if(item.pizza.toppings) origToppingIds.push(...item.pizza.toppings);
    if (item.customizations.base) baseIds.push(item.customizations.base);
    if (item.customizations.sauce) sauceIds.push(...item.customizations.sauce);
    if (item.customizations.cheese)
      cheeseIds.push(...item.customizations.cheese);
    if (item.customizations.toppings)
      toppingIds.push(...item.customizations.toppings);
  });
  // Fetch all inventory items at once to reduce DB queries
  const [ baseMap, sauceMap, cheeseMap, toppingMap] = await Promise.all([
    Inventory.find({ _id: { $in: baseIds } }, "name price").then((items) =>
      items.reduce((acc, item) => ({ ...acc, [item._id]: item }), {})
    ),
    Inventory.find({ _id: { $in: sauceIds } }, "name").then((items) =>
      items.reduce((acc, item) => ({ ...acc, [item._id]: item.name }), {})
    ),
    Inventory.find({ _id: { $in: cheeseIds } }, "name").then((items) =>
      items.reduce((acc, item) => ({ ...acc, [item._id]: item.name }), {})
    ),
    Inventory.find({ _id: { $in: toppingIds } }, "name").then((items) =>
      items.reduce((acc, item) => ({ ...acc, [item._id]: item.name }), {})
    ),
  ]);
  // Process cart items
  const formattedItems = cart.items.map((item) => ({
    pizza: item.pizza,
    quantity: item.quantity,
    price: item.price,
    finalPrice: item.finalPrice,
    customizations: {
      base: item.customizations.base ? baseMap[item.customizations.base] : null,
      sauce:
        item.customizations.sauce?.map((id) => sauceMap[id]).filter(Boolean) ||
        [],
      cheese:
        item.customizations.cheese
          ?.map((id) => cheeseMap[id])
          .filter(Boolean) || [],
      toppings:
        item.customizations.toppings
          ?.map((id) => toppingMap[id])
          .filter(Boolean) || [],
    },
  }));
  return formattedItems;
}
