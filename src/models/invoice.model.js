import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const invoiceSchema = new Schema(
    {
        order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentMode: {
      type: String,
      enum: ["cash", "upi", "card"],
      required: true,
    },

    paidAt: {
      type: Date,
      default: Date.now,
    }
    },
    {
        timestamps: true
    }
);

export const Invoice = mongoose.model("Invoice", invoiceSchema);