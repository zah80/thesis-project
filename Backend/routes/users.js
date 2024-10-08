const express = require('express');
const { register, login, getAll, getById, update, remove,getByOne,
    searchForUserController,removeWithoutAuth } = require('../controllers/users');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/multer');

const router = express.Router();

router.post('/register', upload.single('image'), register);
router.post('/login', login);
router.get('/', getAll);
router.get('/one', authMiddleware, getById);
router.get('/profile/:id', getByOne);
router.put('/profile-pic/:id', update);
router.delete('/delete', remove);
router.get('/search', searchForUserController);
router.delete('/deleteWithoutAuth/:userID', removeWithoutAuth);

module.exports = router;
