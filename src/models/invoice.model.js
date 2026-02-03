import mongoose, { Schema } from "mongoose";

const InvoiceItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  productCode: String,
  description: String,
  quantity: {
    type: Number,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  taxRate: {
    type: Number,
    default: 0
  },
  lineTotal: {
    type: Number,
    required: true
  }
});

const InvoiceSchema = new Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
      required: true
    },

    invoiceDate: {
      type: Date,
      default: Date.now
    },

    dueDate: Date,

    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },

    seller: {
      companyName: String,
      address: String,
      contact: String,
      gstNumber: String
    },

    buyer: {
      name: String,
      address: String,
      contact: String
    },

    items: [InvoiceItemSchema],

    summary: {
      subtotal: Number,
      totalDiscount: Number,
      totalTax: Number,
      shippingCharges: {
        type: Number,
        default: 0
      },
      grandTotal: Number
    },

    paymentTerms: {
      type: String,
      default: "Due on receipt"
    },

    paymentMethod: String,

    bankDetails: {
      accountName: String,
      accountNumber: String,
      ifsc: String,
      bankName: String
    },

    notes: String,

    status: {
      type: String,
      enum: ["generated", "paid", "cancelled"],
      default: "generated"
    }
  },
  { timestamps: true }
);

export const Invoice = mongoose.model("Invoice", InvoiceSchema);
