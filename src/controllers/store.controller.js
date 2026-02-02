import { asyncHandler } from "../utils/asyncHandler.js";;
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Store } from "../models/store.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getMyStores = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;
  const { status } = req.query;

  const filter = { owner: ownerId };

  // if status is provided, filter by it
  if (status) {
    filter.status = status; // approved | pending | rejected
  }

  const stores = await Store.find(filter);

  return res.status(200).json(
    new ApiResponse(200, stores, "My stores retrieved successfully")
  );
});

const updateMyStore = asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const { storeName, address, phone } = req.body;

  const store = await Store.findOne({
    _id: storeId,
    owner: req.user._id
  });

  if (!store) {
    throw new ApiError(404, "Store not found or unauthorized");
  }

  if (storeName) store.storeName = storeName.trim();
  if (address) store.address = address.trim();
  if (phone) store.phone = phone.trim();

  await store.save();

  return res.status(200).json(
    new ApiResponse(200, store, "Store updated successfully")
  );
});

// ADMIN FUNCTION
const getAllStores = asyncHandler(async (req, res) => {
  const stores = await Store.find().populate("owner", "username email");

  return res.status(200).json(
    new ApiResponse(200, stores, "All stores retrieved successfully")
  );
});

const getPendingStores = asyncHandler(async (req, res) => {
  const stores = await Store.find({ status: "pending" })
    .populate("owner", "username email");

  return res.status(200).json(
    new ApiResponse(200, stores, "Pending store requests")
  );
});

const approveStore = asyncHandler(async (req, res) => {
  const store = await Store.findById(req.params.storeId);

  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  store.status = "approved";
  store.isActive = true;

  await store.save();

  return res.status(200).json(
    new ApiResponse(200, store, "Store approved successfully")
  );
});

const rejectStore = asyncHandler(async (req, res) => {
  const store = await Store.findById(req.params.storeId);

  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  store.status = "rejected";
  store.isActive = false;

  await store.save();

  return res.status(200).json(
    new ApiResponse(200, store, "Store rejected")
  );
});


export {
    getMyStores,
    updateMyStore,
    getAllStores,
    getPendingStores,
    approveStore,
    rejectStore
};