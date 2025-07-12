
const express = require('express');
const Routes = express.Router();
const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  approveItem,
  getItemsByUser
} = require('../controllers/itemController');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../utils/upload');

// Include advanced results middleware
const Item = require('../models/Item');
const advancedResults = require('../middlewares/advancedResults');

router
  .route('/')
  .get(
    advancedResults(Item, {
      path: 'user',
      select: 'name avatar'
    }),
    getItems
  )
  .post(protect, upload.array('images', 5), createItem);

router
  .route('/:id')
  .get(getItem)
  .put(protect, upload.array('images', 5), updateItem)
  .delete(protect, deleteItem);

router.route('/:id/approve').put(protect, authorize('admin'), approveItem);
router.route('/user/:userId').get(getItemsByUser);

module.exports = router;
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { getItemsByUser } = require('../controllers/itemController');

// GET /api/items/user (protected)
router.get('/user', protect, getItemsByUser);

module.exports = router;