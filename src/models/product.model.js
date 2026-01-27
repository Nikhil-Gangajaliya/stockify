import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const productSchema = new Schema(
    {
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true
        },

        stock: {
            type: Number,
            default: 0
        },

        category: {
            type: String
        }
    },
    {

        timestamps: true
    }
);

export const Product = mongoose.model("Product", productSchema);