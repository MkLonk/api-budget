const router = require('express').Router();

const {
  checkInn,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  joinCompanyAsGuest,
  updateUserRole,
  removeUserFromCompany,
} = require('../controllers/companies');

// Проверка ИНН и получения компаний с таким ИНН
router.get('/check-inn/:inn', checkInn);

// Получение всех данных о компании по ID
router.get('/:companyId', getCompanyById);

// Создание новой компании
router.post('/', createCompany);

// Обновление данных компании
router.patch('/:companyId', updateCompany);

// Удаление компании
router.delete('/:companyId', deleteCompany);

// Вступление в компанию в роли гостя
router.post('/:companyId/userJoin', joinCompanyAsGuest);

// Изменение роли пользователя
router.patch('/:companyId/userPatch', updateUserRole);

// Удаление пользователя из компании
router.patch('/:companyId/userDelete', removeUserFromCompany);

module.exports = router;
