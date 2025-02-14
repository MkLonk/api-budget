const router = require('express').Router();
// const { celebrate } = require('celebrate');

// const { validSetCreateMovies, validSetDelMovies } = require('../middlewares/validSets');
// const { getMovies, createMovies, deleteMovies } = require('../controllers/payment');
const { getPayments, createPayments } = require('../controllers/payments');

router.get('/', getPayments); // — показать все платежи
router.post('/', /* celebrate(validSetCreateMovies), */ createPayments); // — добавить фильм в избранные
// router.delete('/:id', celebrate(validSetDelMovies), deleteMovies); // — удалить фильм

module.exports = router;
