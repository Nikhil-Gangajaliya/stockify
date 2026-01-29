import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import { Store } from "../models/store.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addStock = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    throw new ApiError(400, "Quantity is required and must be a positive number");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { $inc: { stock: quantity } },
    { new: true }
  );

  return res.status(200).json(
    new ApiResponse(200, updatedProduct, "Stock added successfully")
  );
});

const reduceStock = asyncHandler(async (productId, quantity) => {
  const updatedProduct = await Product.findOneAndUpdate(
    {
      _id: productId,
      stock: { $gte: quantity }, // ensures enough stock
    },
    {
      $inc: { stock: -quantity },
    },
    { new: true }
  );

  if (!updatedProduct) {
    throw new ApiError(400, "Insufficient stock or product not found");
  }

  return updatedProduct;
});

const adjustStock = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  let { quantity, action } = req.body;

  if (!quantity || quantity <= 0) {
    throw new ApiError(400, "Quantity must be greater than 0");
  }

  action = action?.toLowerCase();

  let updatedProduct;

  if (action === "add") {
    updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: quantity } },
      { new: true }
    );

    if (!updatedProduct) {
      throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(
      new ApiResponse(200, updatedProduct, "Stock added successfully")
    );
  }

  if (action === "reduce") {
    updatedProduct = await reduceStock(productId, quantity);

    return res.status(200).json(
      new ApiResponse(200, updatedProduct, "Stock reduced successfully")
    );
  }

  throw new ApiError(400, "Invalid action. Use 'add' or 'reduce'");
});

const getLowStockProducts = asyncHandler(async (req, res) => {
  const lowStockThreshold = 10;

  const lowStockProducts = await Product.find({
    stock: { $lt: lowStockThreshold }
  });

  return res.status(200).json(
    new ApiResponse(200, lowStockProducts, "Low stock products retrieved successfully")
  );
});

export {
     addStock,
     reduceStock,
     adjustStock,
     getLowStockProducts
};