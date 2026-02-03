import dotenv from "dotenv";
dotenv.config();
import { User } from "../models/user.model.js";
import connectDB from "../db/connectDB.js";

const setupAdminComplete = async () => {
  try {
    await connectDB();

    const email = "nikhilgajjar810@gmail.com";

    const admin = await User.findOne({ email, role: "admin" });

    if (!admin) {
      console.log("Admin not found");
      process.exit(0);
    }

    // 🔒 Hard validation (real-world)
    if (admin.gstNumber) {
      console.log("Admin already fully configured");
      process.exit(0);
    }

    admin.username = "Stockify Pvt Ltd";

    admin.contact = {
      phone: "9876543210",
      alternatePhone: "9123456789"
    };

    admin.address = {
      line1: "Shop No. 12, Business Plaza",
      line2: "Kalawad Road",
      city: "Rajkot",
      state: "Gujarat",
      pincode: "360005",
      country: "India"
    };

    admin.gstNumber = "24ABCDE1234F1Z5";

    await admin.save();

    console.log("Admin FULL details configured successfully");
    process.exit(0);
  } catch (error) {
    console.error("Admin setup failed", error);
    process.exit(1);
  }
};

setupAdminComplete();
