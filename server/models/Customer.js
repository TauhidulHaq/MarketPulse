const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    avatar: {
      type: String,
      default: '#6B7280',
    },
    rank: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Low',
    },
    totalSpend: {
      type: Number,
      default: 0,
      min: 0,
    },
    avgSpend: {
      type: Number,
      default: 0,
      min: 0,
    },
    orderCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastOrderDate: {
      type: Date,
      default: null,
    },
    memberStatus: {
      type: String,
      enum: ['Active', 'Inactive', 'New'],
      default: 'New',
    },
    location: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Customer', customerSchema);
