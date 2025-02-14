// Developers.js роут, для "проектные бюро" +++
const router = require('express').Router();
// const { celebrate } = require('celebrate');

const {
  getDevelopers, //+
  createDeveloper,
  deleteDeveloper,
  patchDeveloper,
  addUserToDeveloper,
  getDeveloperId,
} = require('../controllers/developers');

router.get('/', getDevelopers); // — показать
router.get('/:id', getDeveloperId); // — показать
router.post('/', createDeveloper); // — добавить
router.delete('/:id', deleteDeveloper); // — удалить
router.patch('/:id', patchDeveloper); // — изменить
router.put('/:id/users', addUserToDeveloper);

module.exports = router;
