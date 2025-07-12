
const Swap = require('../models/Swap');
const Item = require('../models/Item');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const sendEmail = require('../utils/email');

// @desc    Get all swaps
// @route   GET /api/swaps
// @access  Private
exports.getSwaps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single swap
// @route   GET /api/swaps/:id
// @access  Private
exports.getSwap = asyncHandler(async (req, res, next) => {
  const swap = await Swap.findById(req.params.id)
    .populate('requester', 'name avatar')
    .populate('recipient', 'name avatar')
    .populate('requestedItem')
    .populate('offeredItem');

  if (!swap) {
    return next(
      new ErrorResponse(`Swap not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is part of the swap
  if (
    swap.requester._id.toString() !== req.user.id &&
    swap.recipient._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this swap`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: swap
  });
});

// @desc    Create new swap
// @route   POST /api/swaps
// @access  Private
exports.createSwap = asyncHandler(async (req, res, next) => {
  // Get the requested item
  const requestedItem = await Item.findById(req.body.requestedItem);

  if (!requestedItem) {
    return next(
      new ErrorResponse(
        `Item not found with id of ${req.body.requestedItem}`,
        404
      )
    );
  }

  // Make sure user is not requesting their own item
  if (requestedItem.user.toString() === req.user.id) {
    return next(
      new ErrorResponse(`You cannot request a swap for your own item`, 400)
    );
  }

  // Check if item is available
  if (requestedItem.status !== 'available') {
    return next(
      new ErrorResponse(`This item is not available for swapping`, 400)
    );
  }

  // If offering an item, check it exists and belongs to the requester
  if (req.body.offeredItem) {
    const offeredItem = await Item.findById(req.body.offeredItem);

    if (!offeredItem) {
      return next(
        new ErrorResponse(
          `Offered item not found with id of ${req.body.offeredItem}`,
          404
        )
      );
    }

    if (offeredItem.user.toString() !== req.user.id) {
      return next(
        new ErrorResponse(
          `You cannot offer an item that doesn't belong to you`,
          401
        )
      );
    }

    if (offeredItem.status !== 'available') {
      return next(
        new ErrorResponse(`The item you're offering is not available`, 400)
      );
    }
  }

  // If offering points, check user has enough
  if (req.body.offeredPoints) {
    const user = await User.findById(req.user.id);

    if (user.points < req.body.offeredPoints) {
      return next(
        new ErrorResponse(`You don't have enough points for this swap`, 400)
      );
    }
  }

  // Create swap
  const swap = await Swap.create({
    requester: req.user.id,
    recipient: requestedItem.user,
    requestedItem: req.body.requestedItem,
    offeredItem: req.body.offeredItem,
    offeredPoints: req.body.offeredPoints,
    message: req.body.message
  });

  // Update item status if offering an item
  if (req.body.offeredItem) {
    await Item.findByIdAndUpdate(req.body.offeredItem, {
      status: 'pending'
    });
  }

  // Update requested item status
  await Item.findByIdAndUpdate(req.body.requestedItem, {
    status: 'pending'
  });

  // Send notification to recipient
  const recipient = await User.findById(requestedItem.user);
  const requester = await User.findById(req.user.id);

  const message = `You have a new swap request from ${requester.name} for your item "${requestedItem.title}".`;

  try {
    await sendEmail({
      email: recipient.email,
      subject: 'New Swap Request',
      message
    });
  } catch (err) {
    console.log('Email could not be sent');
  }

  res.status(201).json({
    success: true,
    data: swap
  });
});

// @desc    Update swap status
// @route   PUT /api/swaps/:id/status
// @access  Private
exports.updateSwapStatus = asyncHandler(async (req, res, next) => {
  const swap = await Swap.findById(req.params.id)
    .populate('requestedItem')
    .populate('offeredItem');

  if (!swap) {
    return next(
      new ErrorResponse(`Swap not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is the recipient
  if (swap.recipient.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this swap`,
        401
      )
    );
  }

  // Check if swap is already completed or rejected
  if (swap.status !== 'pending') {
    return next(
      new ErrorResponse(`Swap has already been ${swap.status}`, 400)
    );
  }

  const { status } = req.body;

  // Validate status
  if (!['accepted', 'rejected'].includes(status)) {
    return next(
      new ErrorResponse(`Invalid status. Must be either 'accepted' or 'rejected'`, 400)
    );
  }

  // Update swap status
  swap.status = status;
  swap.updatedAt = Date.now();
  await swap.save();

  // Update items status based on swap status
  if (status === 'accepted') {
    // Mark items as swapped
    await Item.findByIdAndUpdate(swap.requestedItem._id, {
      status: 'swapped'
    });

    if (swap.offeredItem) {
      await Item.findByIdAndUpdate(swap.offeredItem._id, {
        status: 'swapped'
      });
    }

    // Transfer points if applicable
    if (swap.offeredPoints) {
      // Deduct points from requester
      await User.findByIdAndUpdate(swap.requester, {
        $inc: { points: -swap.offeredPoints }
      });

      // Add points to recipient
      await User.findByIdAndUpdate(swap.recipient, {
        $inc: { points: swap.offeredPoints }
      });
    }

    // Send notification to requester
    const requester = await User.findById(swap.requester);
    const recipient = await User.findById(swap.recipient);

    const message = `Your swap request for "${swap.requestedItem.title}" has been accepted by ${recipient.name}.`;

    try {
      await sendEmail({
        email: requester.email,
        subject: 'Swap Accepted',
        message
      });
    } catch (err) {
      console.log('Email could not be sent');
    }
  } else {
    // Rejected - mark items as available again
    await Item.findByIdAndUpdate(swap.requestedItem._id, {
      status: 'available'
    });

    if (swap.offeredItem) {
      await Item.findByIdAndUpdate(swap.offeredItem._id, {
        status: 'available'
      });
    }

    // Send notification to requester
    const requester = await User.findById(swap.requester);
    const recipient = await User.findById(swap.recipient);

    const message = `Your swap request for "${swap.requestedItem.title}" has been rejected by ${recipient.name}.`;

    try {
      await sendEmail({
        email: requester.email,
        subject: 'Swap Rejected',
        message
      });
    } catch (err) {
      console.log('Email could not be sent');
    }
  }

  res.status(200).json({
    success: true,
    data: swap
  });
});

// @desc    Complete swap
// @route   PUT /api/swaps/:id/complete
// @access  Private
exports.completeSwap = asyncHandler(async (req, res, next) => {
  const swap = await Swap.findById(req.params.id);

  if (!swap) {
    return next(
      new ErrorResponse(`Swap not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is part of the swap
  if (
    swap.requester.toString() !== req.user.id &&
    swap.recipient.toString() !== req.user.id
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to complete this swap`,
        401
      )
    );
  }

  // Check if swap is accepted
  if (swap.status !== 'accepted') {
    return next(
      new ErrorResponse(`Swap must be accepted before it can be completed`, 400)
    );
  }

  // Update swap status
  swap.status = 'completed';
  swap.updatedAt = Date.now();
  await swap.save();

  res.status(200).json({
    success: true,
    data: swap
  });
});

// @desc    Get swaps by user
// @route   GET /api/swaps/user/:userId
// @access  Private
exports.getSwapsByUser = asyncHandler(async (req, res, next) => {
  const swaps = await Swap.find({
    $or: [{ requester: req.params.userId }, { recipient: req.params.userId }]
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