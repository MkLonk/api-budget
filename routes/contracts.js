const router = require('express').Router();
// const { celebrate } = require('celebrate');

// const { validSetCreateMovies, validSetDelMovies } = require('../middlewares/validSets');
// const { getMovies, createMovies, deleteMovies } = require('../controllers/payment');
const {
  getContracts,
  createContract,
  deleteContract,
  patchContract,
} = require('../controllers/contracts');

router.get('/', getContracts); // — показать все договоры
router.post('/', /* celebrate(validSetCreateMovies), */ createContract); // — добавить новй договор
router.delete('/:id', /* celebrate(validSetDelMovies), */ deleteContract); // — удалить договор
router.patch('/:id', /* celebrate(validSetCreateMovies), */ patchContract); // — изменить данные договора

module.exports = router;
