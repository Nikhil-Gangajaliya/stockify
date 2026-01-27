import mongoose, { Mongoose, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const orderSchema = new Schema(
    {
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product"
                },
                quantity: Number,
                price: Number
            },
        ],

        totalAmount: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["pending", "completed", "cancelled"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

export const Order = mongoose.model("Order", orderSchema);