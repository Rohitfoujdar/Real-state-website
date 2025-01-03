import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: true,
    },

    name: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
      maxLength: 256,
    },

    address: {
      type: String,
      default: "",
    },

    company: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    photo: {},

    role: {
      type: [String],
      default: ["Buyer"],
      enum: ["Buyer", "Seller", "Admin"],
    },

    enquiredProperties: [{
      type: ObjectId,
      ref: "Ad",
    }],

    wishlist: [{
      type: ObjectId,
      ref: "Ad",
    }],

    resetCode: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Auth = mongoose.model("User", Schema);
export default Auth;
