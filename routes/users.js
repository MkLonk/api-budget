const router = require('express').Router();
// const { celebrate } = require('celebrate');

// const { validSetPatchUser } = require('../middlewares/validSets');
const { patchMe, getMe } = require('../controllers/users');

router.get('/me', getMe); // — авторизованный пользователь
router.patch('/me', /* celebrate(validSetPatchUser), */ patchMe); // — обновить данные авторизованный пользователя

module.exports = router;
