
const User = require('../models/User');
const Item = require('../models/Item');
const Swap = require('../models/Swap');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is requesting their own data or is admin
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this user`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is updating their own data or is admin
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this user`,
        401
      )
    );
  }

  // If admin is updating, allow role change
  if (req.user.role !== 'admin') {
    delete req.body.role;
    delete req.body.points;
    delete req.body.isVerified;
  }

  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  // Delete user's items
  await Item.deleteMany({ user: req.params.id });

  // Delete swaps involving this user
  await Swap.deleteMany({
    $or: [{ requester: req.params.id }, { recipient: req.params.id }]
  });

  await user.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get items for a user
// @route   GET /api/users/:id/items
// @access  Private
exports.getUserItems = asyncHandler(async (req, res, next) => {
  // Make sure user is requesting their own data or is admin
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access these items`,
        401
      )
    );
  }

  const items = await Item.find({ user: req.params.id });

  res.status(200).json({
    success: true,
    count: items.length,
    data: items
  });
});

// @desc    Get swaps for a user
// @route   GET /api/users/:id/swaps
// @access  Private
exports.getUserSwaps = asyncHandler(async (req, res, next) => {
  // Make sure user is requesting their own data or is admin
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access these swaps`,
        401
      )
    );
  }

  const swaps = await Swap.find({
    $or: [{ requester: req.params.id }, { recipient: req.params.id }]
  })
    .populate('requester', 'name avatar')
    .populate('recipient', 'name avatar')
    .populate('requestedItem')
    .populate('offeredItem');

  res.status(200).json({
    success: true,
    count: swaps.length,
    data: swaps
  });
});

// @desc    Update user points
// @route   PUT /api/users/:id/points
// @access  Private/Admin
exports.updateUserPoints = asyncHandler(async (req, res, next) => {
  const { points } = req.body;

  if (!points) {
    return next(new ErrorResponse('Please provide points value', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { points },
    {
      new: true,
      runValidators: true
    }
  );

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user
  });
});