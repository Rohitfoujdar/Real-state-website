import * as config from "../config.js";
import jwt from "jsonwebtoken";
import { emailTemplate } from "../helpers/email.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import User from "../models/user.js";
import { nanoid } from "nanoid";
import validator from "email-validator";
import { token } from "morgan";

const tokenAndUserResponse = (req, res, user) => {
  const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
    expiresIn: "20d",
  });

  user.password = undefined;
  user.resetCode = undefined;
  return res.json({
    token,
    refreshToken,
    user,
  });
};

export const welcome = (req, res) => {
  res.json({
    data: "Hii this is Node js api key.....",
  });
};

export const preRegisterd = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.validate(email)) {
      return res.status(500).json({ error: "A valid email is required" });
    }
    if (!password) {
      return res.status(500).json({ error: "password is required" });
    }

    if (password && password?.length < 6) {
      return res
        .status(500)
        .json({ error: "password should be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(500).json({ error: "email is already taken" });
    }

    const token = jwt.sign({ email, password }, config.JWT_SECRET, {
      expiresIn: "24h",
    });
    config.AWSSES.sendEmail(
      emailTemplate(
        email,
        `
       <p>Please click the link below to activate your account</p>
       <a href="${config.CLIENT_URL}/auth/activate-account/${token}">Activate My Account</a>
      `,
        config.REPLY_TO,
        "Activate your account"
      ),
      (err, data) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ ok: false });
        } else {
          console.log(data);
          return res.status(200).json({ ok: true });
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong try again" });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password } = jwt.verify(req.body.token, config.JWT_SECRET);

    const hashedPassword = await hashPassword(password);

    const user = await new User({
      username: nanoid(6),
      email,
      password: hashedPassword,
    }).save();

    tokenAndUserResponse(req, res, user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong try again" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "No user found. Please resister." });
    }
    //compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(500).json({ error: "Wrong password" });
    }
    tokenAndUserResponse(req, res, user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong try again" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Step 1: Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(500)
        .json({ error: "Could not find a user with this email ID" });
    }

    // Step 2: Generate a reset code
    const resetCode = nanoid(6);
    console.log("Generated Reset Code:", resetCode);

    // Step 3: Update the user document with the reset code
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { resetCode: resetCode }, // Update resetCode
      { new: true } // Return the updated document
    );

    console.log("Updated User with Reset Code:", updatedUser);

    // Step 4: Send email with reset link
    const token = jwt.sign({ resetCode, email }, config.JWT_SECRET, {
      expiresIn: "1h",
    });

    config.AWSSES.sendEmail(
      emailTemplate(
        email,
        `
         <p>Please click the link below to reset your account password:</p>
         <a href="${config.CLIENT_URL}/auth/access-account/${token}">Access My Account</a>
        `,
        config.REPLY_TO,
        "Reset Your Password"
      ),
      (err, data) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ ok: false, error: "Email could not be sent" });
        } else {
          console.log("Email sent successfully:", data);
          return res
            .status(200)
            .json({ ok: true, message: "Reset code sent to your email" });
        }
      }
    );
  } catch (error) {
    console.log("Forgot Password Error:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong, please try again" });
  }
};

export const accessAccount = async (req, res) => {
  try {
    const { token } = req.body;

    // Step 1: Check if token is provided
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    // Step 2: Verify the token
    const { resetCode, email } = jwt.verify(token, config.JWT_SECRET);
    console.log("Reset Code from Token:", resetCode);
    console.log("Email from Token:", email);

    // Step 3: Find user with the matching resetCode and email
    const user = await User.findOneAndUpdate(
      { resetCode: resetCode.trim(), email: email.trim().toLowerCase() },
      { resetCode: "" }, // Clear the resetCode after successful verification
      { new: true }
    );

    console.log("User Found:", user);

    if (!user) {
      return res
        .status(500)
        .json({ error: "User not found or invalid reset code" });
    }

    // Step 4: Generate new tokens for the user
    tokenAndUserResponse(req, res, user);
  } catch (error) {
    console.log("Access Account Error:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong, please try again" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { _id } = jwt.verify(req.headers.refresh_token, config.JWT_SECRET);
    const user = await User.findById(_id);
    tokenAndUserResponse(req, res, user);
  } catch (error) {
    console.log(error);
    return res.status(403).json({ error: "Token is not found" });
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.password = undefined;
    user.resetCode = undefined;
    return res.json({ user });
  } catch (error) {
    console.log(error);
    return res.status(403).json({ error: "Unauthorized" });
  }
};

export const publicProfile = async (req, res) => {
  try {
    console.log(req.params.username);
    const user = await User.findOne({ username: req.params.username });
    user.password = undefined;
    user.resetCode = undefined;
    return res.json({ user });
  } catch (error) {
    console.log("err ---- ", error);
    return res.status(403).json({ error: "user does not exist" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(500).json({ error: "password is required" });
    }

    if (password && password?.length < 6) {
      return res
        .status(500)
        .json({ error: "password should be at least 6 characters" });
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
      password: await hashPassword(password),
    });
    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(403).json({ error: "Unauthorized" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });
    user.password = undefined;
    user.resetCode = undefined;
    res.json(user);
  } catch (err) {
    console.log(err);
    if (err.codeName === "DuplicateKey") {
      return res.json({ error: "Username or email is already taken" });
    } else {
      return res.status(403).json({ error: "Unauhorized" });
    }
  }
};
