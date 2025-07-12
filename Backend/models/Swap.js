
const mongoose = require('mongoose');

const SwapSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  requestedItem: {
    type: mongoose.Schema.ObjectId,
    ref: 'Item',
    required: true
  },
  offeredItem: {
    type: mongoose.Schema.ObjectId,
    ref: 'Item'
  },
  offeredPoints: {
    type: Number
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  message: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Swap', SwapSchema);