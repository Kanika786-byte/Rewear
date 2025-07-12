
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'tops',
      'bottoms',
      'dresses',
      'jackets',
      'shoes',
      'accessories',
      'other'
    ]
  },
  type: {
    type: String,
    required: [true, 'Please add a type (e.g., T-shirt, Jeans)']
  },
  size: {
    type: String,
    required: [true, 'Please select a size'],
    enum: ['xs', 's', 'm', 'l', 'xl', 'xxl', 'other']
  },
  condition: {
    type: String,
    required: [true, 'Please select condition'],
    enum: ['new', 'excellent', 'good', 'fair']
  },
  points: {
    type: Number,
    required: [true, 'Please set a points value'],
    min: [10, 'Points must be at least 10']
  },
  tags: {
    type: [String],
    required: true
  },
  images: {
    type: [String],
    required: true
  },
  location: {
    type: String
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'swapped'],
    default: 'available'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Item', ItemSchema);