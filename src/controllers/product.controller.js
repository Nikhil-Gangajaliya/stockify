import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import { Store } from "../models/store.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, storeId } = req.body;

  if (!name || name.trim() === "") {
    throw new ApiError(400, "Product name is required");
  }

  if (!price || price <= 0) {
    throw new ApiError(400, "Product price is required and must be a positive number");
  }

  if (!storeId) {
    throw new ApiError(400, "Store ID is required");
  }

  const store = await Store.findById(storeId);
  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  const product = await Product.create({
    name: name.trim(),
    description: description?.trim(),
    price: parseFloat(price),
    store: storeId,
  });

  return res.status(201).json(
    new ApiResponse(201, product, "Product created successfully")
  );
});

const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { name, description, price } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      name: name?.trim(),
      description: description?.trim(),
      price: parseFloat(price),
    },
    { new: true }
  );

  return res.status(200).json(
    new ApiResponse(200, updatedProduct, "Product updated successfully")
  );
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  await Product.findByIdAndDelete(productId);

  return res.status(200).json(
    new ApiResponse(200, null, "Product deleted successfully")
  );
});

const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res.status(200).json(
    new ApiResponse(200, product, "Product fetched successfully")
  );
});

const getProductsByStore = asyncHandler(async (req, res) => {
  const { storeId } = req.params;

  const products = await Product.find({ store: storeId });

  return res.status(200).json(
    new ApiResponse(200, products, "Products fetched successfully")
  );
});

export { 
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByStore
};