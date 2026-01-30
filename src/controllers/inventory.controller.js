import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { StoreInventory } from "../models/storeInventory.model.js";
import { Store } from "../models/store.model.js";


const getMyInventory = asyncHandler(async (req, res) => {
  const store = await Store.findOne({ owner: req.user._id });

  if (!store) {
    throw new ApiError(404, "Store not found for this user");
  }

  const inventory = await StoreInventory.find({
    store: store._id,
  }).populate("product", "name price");

  return res.status(200).json(
    new ApiResponse(200, inventory, "Store inventory fetched successfully")
  );
});

const reduceMyStock = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    throw new ApiError(400, "Quantity must be greater than 0");
  }

  const store = await Store.findOne({ owner: req.user._id });
  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  const inventory = await StoreInventory.findOne({
    store: store._id,
    product: productId
  });

  if (!inventory) {
    throw new ApiError(404, "Product not found in store inventory");
  }

  if (inventory.stock < quantity) {
    throw new ApiError(400, "Insufficient stock");
  }

  inventory.stock -= quantity;
  await inventory.save();

  return res.status(200).json(
    new ApiResponse(200, inventory, "Stock reduced successfully")
  );
});


export {
  getMyInventory,
  reduceMyStock
};
