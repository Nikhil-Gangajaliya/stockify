import mongoose, { Schema } from "mongoose";

const StoreInventorySchema = new Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

// unique per store per product
StoreInventorySchema.index(
  { store: 1, product: 1 },
  { unique: true }
);

export const StoreInventory = mongoose.model(
  "StoreInventory",
  StoreInventorySchema
);
