
const Item = require('../models/Item');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const upload = require('../utils/upload');

// @desc    Get all items
// @route   GET /api/items
// @access  Public
exports.getItems = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
exports.getItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate('user', 'name avatar');

  if (!item) {
    return next(
      new ErrorResponse(`Item not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: item
  });
});

// @desc    Create new item
// @route   POST /api/items
// @access  Private
exports.createItem = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Upload images
  if (req.files) {
    const images = await upload.uploadFiles(req.files);
    req.body.images = images;
  }

  const item = await Item.create(req.body);

  res.status(201).json({
    success: true,
    data: item
  });
});

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
exports.updateItem = asyncHandler(async (req, res, next) => {
  let item = await Item.findById(req.params.id);

  if (!item) {
    return next(
      new ErrorResponse(`Item not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is item owner or admin
  if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this item`,
        401
      )
    );
  }

  // Upload new images if any
  if (req.files) {
    const images = await upload.uploadFiles(req.files);
    req.body.images = [...item.images, ...images];
  }

  item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: item
  });
});

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
exports.deleteItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return next(
      new ErrorResponse(`Item not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is item owner or admin
  if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this item`,
        401
      )
    );
  }

  // Delete images from storage
  await upload.deleteFiles(item.images);

  await item.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Approve item
// @route   PUT /api/items/:id/approve
// @access  Private/Admin
exports.approveItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return next(
      new ErrorResponse(`Item not found with id of ${req.params.id}`, 404)
    );
  }

  item.isApproved = true;
  await item.save();

  res.status(200).json({
    success: true,
    data: item
  });
});

// @desc    Get items by user
// @route   GET /api/items/user/:userId
// @access  Public
exports.getItemsByUser = asyncHandler(async (req, res, next) => {
  const items = await Item.find({ user: req.params.userId });

  res.status(200).json({
    success: true,
    count: items.length,
    data: items
  });
});