import mongoose, { Schema } from "mongoose";

const invoiceSchema = new Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true   // 👈 ADMIN
    },

    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },

    amount: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true
  }
);

export const Invoice = mongoose.model("Invoice", invoiceSchema);