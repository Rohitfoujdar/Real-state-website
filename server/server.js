import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
const app = express();
import { DATABASE } from "./config.js";
import Authroute from "./route/auth.js";

//middleware//
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
// dotenv.config();

// const URI = process.env.mongoDBURL

try {
  mongoose.connect(DATABASE);
  console.log("Database Connected");
} catch (err) {
  console.log("error:", err);
}

//Routes middleware//
app.use("/", Authroute);

app.listen(8000, () => {
  console.log("listening on port : 8000");
});
