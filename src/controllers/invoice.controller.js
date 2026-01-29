import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Invoice } from "../models/invoice.model.js";
import { Order } from "../models/order.model.js";

const generateInvoice = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.status !== "approved") {
        throw new ApiError(400, "Invoice can only be generated for approved orders");
    }

    const existingInvoice = await Invoice.findOne({ order: orderId });
    if (existingInvoice) {
        throw new ApiError(400, "Invoice already exists for this order");
    }

    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const invoice = await Invoice.create({
        order: orderId,
        invoiceNumber,
        amount: order.totalAmount
    });

    return res.status(201).json(
        new ApiResponse(201, invoice, "Invoice generated successfully")
    );
});

const getInvoiceByOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const invoice = await Invoice.findOne({ order: orderId })
    .populate("order");

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  const isAdmin = req.user.role === "admin";
  const isOwner = invoice.order.user.toString() === req.user._id.toString();

  if (!isAdmin && !isOwner) {
    throw new ApiError(403, "Not authorized to view this invoice");
  }

  return res.status(200).json(
    new ApiResponse(200, invoice, "Invoice retrieved successfully")
  );
});


const getInvoicesByStore = asyncHandler(async (req, res) => {
  const { storeId } = req.params;

  const invoices = await Invoice.find()
    .populate({
      path: "order",
      match: { store: storeId },
      populate: {
        path: "user",
        select: "name email"
      }
    });

  // remove invoices whose order didn't match
  const filteredInvoices = invoices.filter(inv => inv.order !== null);

  return res.status(200).json(
    new ApiResponse(200, filteredInvoices, "Invoices retrieved successfully")
  );
});


export {
    generateInvoice,
    getInvoiceByOrder,
    getInvoicesByStore
};