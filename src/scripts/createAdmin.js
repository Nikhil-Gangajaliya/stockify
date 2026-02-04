import dotenv from "dotenv";
dotenv.config();

import connectDB from "../db/connectDB.js";
import { User } from "../models/user.model.js";
import { Store } from "../models/store.model.js";

// const createAdminWithStore = async () => {
//   try {
//     await connectDB();

//     // 1️⃣ Check if admin already exists
//     let admin = await User.findOne({ role: "admin" });

//     if (admin) {
//       console.log("Admin already exists");

//       if (admin.store) {
//         console.log("Admin store already exists");
//         process.exit(0);
//       }
//     }

//     // 2️⃣ Create admin if not exists
//     if (!admin) {
//       admin = await User.create({
//         username: "Stockify Admin",
//         email: "nikhilgajjar810@gmail.com",
//         password: "Admin@12345",
//         role: "admin",
//         address: "Kalawad Road, Rajkot",
//         contact: "9876543210"
//       });

//       console.log("Admin user created");
//     }

//     // 3️⃣ Create store for admin
//     const store = await Store.create({
//       storeName: "Stockify Pvt Ltd",
//       owner: admin._id,
//               address: "Kalawad Road, Rajkot",
//         contact: "9876543210",
//       status: "approved",
//       isActive: true
//     });

//     // 4️⃣ Link store to admin
//     admin.store = store._id;
//     await admin.save();

//     console.log("Admin store created & linked successfully");
//     process.exit(0);

//   } catch (error) {
//     console.error("Error creating admin/store:", error);
//     process.exit(1);
//   }
// };

// createAdminWithStore();

// const updateAdminGST = async () => {
//   try {
//     await connectDB();

//     // 1️⃣ Find admin
//     const admin = await User.findOne({ role: "admin" });
//     if (!admin) {
//       console.log("Admin not found");
//       process.exit(0);
//     }

//     // 2️⃣ Ensure admin has store
//     if (!admin.store) {
//       console.log("Admin store not linked");
//       process.exit(0);
//     }

//     // 3️⃣ Find admin store
//     const store = await Store.findById(admin.store);
//     if (!store) {
//       console.log("Store not found");
//       process.exit(0);
//     }

//     // 4️⃣ Update GST (force update)
//     store.gstNumber = "24ABCDE1234F1Z5"; // 🔥 your GST
//     await store.save();

//     console.log("Admin GST updated successfully");
//     process.exit(0);

//   } catch (err) {
//     console.error("GST update failed:", err.message);
//     process.exit(1);
//   }
// };

// updateAdminGST();
