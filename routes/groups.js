const router = require('express').Router();
// const { celebrate } = require('celebrate');

// const { validSetCreateMovies, validSetDelMovies } = require('../middlewares/validSets');
// const { getMovies, createMovies, deleteMovies } = require('../controllers/payment');
const { getGroups, createGroup, addListUser, delListUser } = require('../controllers/groups');

router.get('/', getGroups); // — показать все группы
router.post('/', createGroup); // — добавить новую группу
router.patch('/:id', addListUser); // — добавить новую группу
router.delete('/:id', delListUser); // — добавить новую группу

module.exports = router;
