const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const router = new Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const messageController = require('../controllers/message-controller');

router.post(
  '/registration',
  body('name').isLength({ min: 5, max: 32 }),
  body('email').isEmail(),
  body('password').isLength({ min: 5, max: 32 }),
  userController.registration,
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.patch(
  '/users/:id',
  authMiddleware,
  body('name').isLength({ min: 5, max: 32 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6, max: 32 }),
  userController.editUser,
);
router.get('/users/online', authMiddleware, userController.getOnlineUsers);
router.get('/users/:id', authMiddleware, userController.getUserById);
router.get('/users', authMiddleware, userController.getUsers);
router.get('/messages', authMiddleware, messageController.getMessages);

module.exports = router;
