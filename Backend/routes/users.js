const express = require('express');
const { register, login, getAll, getById, update, remove,getByOne,searchForUserController } = require('../controllers/users');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/multer');

const router = express.Router();

router.post('/register', upload.single('image'), register);
router.post('/login', login);
router.get('/', getAll);
router.get('/profile', authMiddleware, getById);
router.get('/profile', getByOne);
router.put('/profile', authMiddleware, update);
router.delete('/delete', remove);
router.get('/search', searchForUserController);

module.exports = router;
