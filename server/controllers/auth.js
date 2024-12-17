import * as config from "../config.js";
import jwt from "jsonwebtoken";
import { emailTemplate } from "../helpers/email.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import User from "../models/user.js";
import { nanoid } from "nanoid";
import validator from "email-validator";

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
      return res.status(500).json({ error: "password should be at least 6 characters" });
    }

    const user = await User.findOne({email});

    if(user){
      return res.status(500).json({error:"email is already taken"})
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

    const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.password = undefined;
    user.resetCode = undefined;
    return res.json({
      token,
      refreshToken,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong try again" });
  }
};
