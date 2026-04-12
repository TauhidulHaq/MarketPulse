const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Shop name is required'],
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    logoColor: {
      type: String,
      default: "#000000",
    },
    status: {
      type: String,
      enum: ['connected', 'action_required'],
      default: 'connected',
    },
    lastSynced: {
      type: Date,
      default: Date.now,
    },
    color: {
      type: String,
      default: '#8B9A46',
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Shop', shopSchema);
