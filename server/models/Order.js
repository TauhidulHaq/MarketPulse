const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    customerLocation: {
      division: String,
      district: String
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        name: String,
        quantity: {
          type: Number,
          min: 1,
        },
        price: {
          type: Number,
          min: 0,
        },
        cost: { 
          type: Number, 
          default: 0 
        },
        saleSource: { 
          type: String, 
          default: 'other' 
        }
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'refunded', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
