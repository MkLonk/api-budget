// contractors.js роут, для "проектные бюро" +++
const router = require('express').Router();
// const { celebrate } = require('celebrate');

const {
  getContractors,
  createContractor,
  deleteContractor,
  patchContractor,
  addUserToContractor,
} = require('../controllers/contractors');

router.get('/', getContractors); // — показать
router.post('/', createContractor); // — добавить
router.delete('/:id', deleteContractor); // — удалить
router.patch('/:id', patchContractor); // — изменить
router.put('/:id/users', addUserToContractor);

module.exports = router;
