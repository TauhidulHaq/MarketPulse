const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/150' 
    },
    campaignRevenue: {
      type: Number,
      default: 0,
    },
    otherRevenue: {
      type: Number,
      default: 0,
    },
    price: { 
      type: Number, required: true, min: 0 },
    performance: {
      type: Number,
      default: 0, 
    },
    performanceTrend: {
      type: Number,
      default: 0,
    },
    revenueTrend: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },

  autoPromoCode: {
        type: String,
        default: null
      },
      autoPromoDiscount: {
        type: Number,
        default: 0
      },
    

    lostSalesQuantity: {
    type: Number,
    default: 0
    },
    lostRevenue: {
    type: Number,
    default: 0
    },

    
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    lastRestocked: {
      type: Date,
      default: Date.now
    },
    
    unitsSold: {
      type: Number,
      default: 0,
      min: 0,
    },
    revenue: {
      type: Number,
      default: 0,
      min: 0,
    },
    expirationDate: {
      type: Date,
      default: null,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
    status: {
      type: String,
      enum: ['active', 'low_stock', 'expiring', 'expired'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

productSchema.virtual('isExpiringSoon').get(function () {
  if (!this.expirationDate) return false;
  const daysUntilExpiry = (this.expirationDate - new Date()) / (1000 * 60 * 60 * 24);
  return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
});

productSchema.virtual('isLowStock').get(function () {
  return this.stock <= this.lowStockThreshold;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
