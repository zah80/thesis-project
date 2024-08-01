const express = require('express');
const { register, login, getAll, getById, update, remove, getByOne,  updateUserController} = require('../controllers/users');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/multer');

const router = express.Router();

router.post('/register', upload.single('image'), register);
router.post('/login', login);
router.get('/', getAll);
router.get('/one', authMiddleware, getById);
router.get('/profile', authMiddleware, getByOne);
router.put('/:id', upload.single('image'), update); // Ensure field name matches
router.delete('/delete/:id', remove);
router.put('/update/:id', authMiddleware, updateUserController);

module.exports = router;
