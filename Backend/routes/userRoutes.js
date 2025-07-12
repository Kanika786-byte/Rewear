
const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserItems,
  getUserSwaps,
  updateUserPoints
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/auth');

// Include advanced results middleware
const User = require('../models/User');
const advancedResults = require('../middlewares/advancedResults');

router
  .route('/')
  .get(
    protect,
    authorize('admin'),
    advancedResults(User, {
      path: 'items',
      select: 'title images points'
    }),
    getUsers
  )
  .post(protect, authorize('admin'), createUser);

router
  .route('/:id')
  .get(protect, getUser)
  .put(protect, updateUser)
  .delete(protect, authorize('admin'), deleteUser);

router.route('/:id/items').get(protect, getUserItems);
router.route('/:id/swaps').get(protect, getUserSwaps);
router.route('/:id/points').put(protect, authorize('admin'), updateUserPoints);

module.exports = router;