
const express = require('express');
const Routes = express.Router();
const {
  getSwaps,
  getSwap,
  createSwap,
  updateSwapStatus,
  completeSwap,
  getSwapsByUser
} = require('../controllers/swapController');
const { protect } = require('../middlewares/auth');

// Include advanced results middleware
const Swap = require('../models/Swap');
const advancedResults = require('../middlewares/advancedResults');

router
  .route('/')
  .get(
    protect,
    advancedResults(Swap, [
      { path: 'requester', select: 'name avatar' },
      { path: 'recipient', select: 'name avatar' },
      { path: 'requestedItem' },
      { path: 'offeredItem' }
    ]),
    getSwaps
  )
  .post(protect, createSwap);

router.route('/:id').get(protect, getSwap);
router.route('/:id/status').put(protect, updateSwapStatus);
router.route('/:id/complete').put(protect, completeSwap);
router.route('/user/:userId').get(protect, getSwapsByUser);

module.exports = router;
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { createSwap } = require('../controllers/swapController');

// POST /api/swaps (protected)
router.post('/', protect, createSwap);

module.exports = router;