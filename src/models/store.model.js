import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
        }
    },
    {
        timestamps: true
    }
);

export const Store = mongoose.model("Store", storeSchema);