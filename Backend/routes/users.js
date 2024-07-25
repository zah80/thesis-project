const express = require('express');
const { register, login, getAll, getById, update, remove,getByOne, updateProfilePic } = require('../controllers/users');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/multer');

const router = express.Router();

router.post('/register', upload.single('image'), register);
router.post('/login', login);
router.get('/', getAll);
router.get('/one', authMiddleware, getById);
router.get('/profile', authMiddleware, getByOne);
router.put('/profile', authMiddleware, update);
router.delete('/delete', remove);
router.post('/profile-pic', upload.single('profilePic'), updateProfilePic);

module.exports = router;
