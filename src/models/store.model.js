import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const storeSchema = new Schema(
    {
        storeName: {
            type: String,
            required: true,
            trim: true
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        address: {
            type: String
        },

        phone: {
            type: String
        },

        gstNumber: {
            type: String,
            required: true,   // 🔥 important
            uppercase: true
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },

        isActive: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export const Store = mongoose.model("Store", storeSchema);