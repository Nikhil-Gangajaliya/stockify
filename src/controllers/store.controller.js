import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Store } from "../models/store.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const createStore = asyncHandler(async (req, res) => {
  const { storeName, address, phone, ownerId } = req.body;

  if (!storeName || storeName.trim() === "") {
    throw new ApiError(400, "Store name is required");
  }

  if (!ownerId) {
    throw new ApiError(400, "Store owner (userId) is required");
  }

  // Verify owner user exists
  const ownerUser = await User.findById(ownerId);
  if (!ownerUser) {
    throw new ApiError(404, "Owner user not found");
  }

  const store = await Store.create({
    storeName: storeName.trim(),
    owner: ownerId, 
    address: address?.trim(),
    phone: phone?.trim(),
  });

  return res.status(201).json(
    new ApiResponse(201, store, "Store created successfully")
  );
}); 

const getMyStore = asyncHandler(async (req, res) => {
    const ownerId = req.user._id;

    const store = await Store.findOne({ owner: ownerId });

    if (!store) {
        throw new ApiError(404, "Store not found");
    }

    return res.status(200).json(
        new ApiResponse(200, store, "Store retrieved successfully")
    );
});

const updateMyStore = asyncHandler(async (req, res) => {
  const { storeName, address, phone } = req.body;

  const store = await Store.findOne({ owner: req.user._id });

  if (!store) {
    throw new ApiError(404, "Store not found for this user");
  }

  if (storeName) store.storeName = storeName.trim();
  if (address) store.address = address.trim();
  if (phone) store.phone = phone.trim();

  await store.save();

  return res.status(200).json(
    new ApiResponse(200, store, "Store updated successfully")
  );
});

const updateStoreByAdmin = asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const { storeName, address, phone } = req.body;

  const store = await Store.findById(storeId);
  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  if (storeName) store.storeName = storeName.trim();
  if (address) store.address = address.trim();
  if (phone) store.phone = phone.trim();

  await store.save();

  return res.status(200).json(
    new ApiResponse(200, store, "Store updated successfully")
  );
});

const getAllStores = asyncHandler(async (req, res) => {
    const stores = await Store.find();

    if (stores.length === 0) {
        throw new ApiError(404, "No stores found");
    }

    return res.status(200).json(
        new ApiResponse(200, stores, "Stores retrieved successfully")
    );
});

export {
    createStore,
    getMyStore,
    updateMyStore,
    updateStoreByAdmin,
    getAllStores
};