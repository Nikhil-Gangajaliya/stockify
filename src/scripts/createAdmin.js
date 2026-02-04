import dotenv from "dotenv";
dotenv.config();

import connectDB from "../db/connectDB.js";
import { User } from "../models/user.model.js";
import { Store } from "../models/store.model.js";

const createAdminStore = async () => {
  await connectDB();

  const admin = await User.findOne({ role: "admin" });
  if (!admin) {
    console.log("Admin not found");
    process.exit(1);
  }

  if (admin.store) {
    console.log("Admin store already exists");
    process.exit(0);
  }

  const store = await Store.create({
    storeName: "Stockify Pvt Ltd",
    owner: admin._id,
    address: {
      line1: "Shop No. 12, Business Plaza",
      city: "Rajkot",
      state: "Gujarat",
      country: "India"
    },
    phone: "9876543210"
  });

  admin.store = store._id;
  await admin.save();

  console.log("Admin store created successfully");
  process.exit(0);
};

createAdminStore();
