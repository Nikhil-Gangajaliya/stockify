import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import connectDB from "../db/connectDB.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const email = "nikhilgajjar810@gmail.com";

    const adminExists = await User.findOne({ email });

    if (adminExists) {
      console.log("Admin already exists");
      process.exit(0);
    }

    await User.create({
      username: "Stockify Admin",
      email,
      password: "Admin@12345",
      role: "admin",
    });

    console.log("Admin created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Admin creation failed", error);
    process.exit(1);
  }
};

createAdmin();
