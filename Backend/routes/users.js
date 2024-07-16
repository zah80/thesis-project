const express = require('express');
const { register, login } = require('../controllers/users');
const { authMiddleware } = require('../middleware/auth');
const  upload = require('../middleware/multer');

const router = express.Router();
router.post('/register', upload.single('image'), register);
router.post('/login', login);
router.get('/one', authMiddleware, (req, res) => {
    // Your implementation for this route
    res.json({ success: true, message: 'Authorized' });
});

module.exports = router;