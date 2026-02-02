import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createProduct = asyncHandler(async (req, res) => {
  const { name, price, stock } = req.body;

  if (!name || name.trim() === "") {
    throw new ApiError(400, "Product name is required");
  }

  if (!price || price <= 0) {
    throw new ApiError(400, "Product price must be a positive number");
  }

  if (!stock || stock <= 0) {
    throw new ApiError(400, "Quantity must be a positive number");
  }

  const product = await Product.create({
    name: name.trim(),
    price: Number(price),
    stock: Number(stock)
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

  const updateData = {};

  if (name) updateData.name = name.trim();
  if (description) updateData.description = description.trim();
  if (price !== undefined) {
    if (price <= 0) {
      throw new ApiError(400, "Price must be positive");
    }
    updateData.price = Number(price);
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    updateData,
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

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();

  return res.status(200).json(
    new ApiResponse(200, products, "Products fetched successfully")
  );
});




export { 
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts
};