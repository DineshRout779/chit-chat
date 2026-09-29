const {
  getAllUsers,
  getUserById,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const verifyAuthorization = require('../middlewares/verifyAuthorization');
const verifyLogin = require('../middlewares/verifyLogin');
const asyncHandler = require('../middlewares/asyncHandler');
const validate = require('../middlewares/validate');
const { updateUserSchema } = require('../validators/userValidators');
const { objectId } = require('../validators/common');

const router = require('express').Router();

// router.param runs before any of the route's own middleware, so the
// :userId format has to be checked here rather than via `validate` further
// down the chain.
router.param('userId', (req, res, next, userId) => {
  if (!objectId.safeParse(userId).success) {
    return res.status(400).json({ success: false, message: 'Invalid user id' });
  }
  Promise.resolve(getUserById(req, res, next, userId)).catch(next);
});

// get all users
router.get('/', verifyLogin, asyncHandler(getAllUsers));

// get a single user
router.get('/:userId', verifyLogin, asyncHandler(getUser));

// update an user
router.patch(
  '/:userId',
  verifyLogin,
  verifyAuthorization,
  validate(updateUserSchema),
  asyncHandler(updateUser),
);

// delete an user
router.delete('/:userId', verifyLogin, verifyAuthorization, asyncHandler(deleteUser));

module.exports = router;
