// projectSections.js - роут
const router = require('express').Router();
// const { celebrate } = require('celebrate');

// const { validSetCreateMovies, validSetDelMovies } = require('../middlewares/validSets');
// const { getMovies, createMovies, deleteMovies } = require('../controllers/payment');

const {
  getProjectSections,
  createProjectSection,
  deleteProjectSection,
  patchProjectSection,
} = require('../controllers/projectSections');

router.get('/', getProjectSections); // — показать все разделы проекта
router.post('/', /* celebrate(validSetCreateMovies), */ createProjectSection); // — добавить новый раздел проекта
router.delete('/:id', /* celebrate(validSetDelMovies), */ deleteProjectSection); // — удалить раздел проекта
router.patch('/:id', /* celebrate(validSetCreateMovies), */ patchProjectSection); // — изменить раздел проекта

module.exports = router;
