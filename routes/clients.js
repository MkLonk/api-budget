const router = require('express').Router();
// const { celebrate } = require('celebrate');

// const { validSetCreateMovies, validSetDelMovies } = require('../middlewares/validSets');
// const { getMovies, createMovies, deleteMovies } = require('../controllers/payment');
const { getClients, createClient, deleteClient, patchClient, getClientId } = require('../controllers/clients');

router.get('/', getClients); // — показать всех клиентов
router.get('/:id', /* celebrate(validSetCreateMovies), */ getClientId); // — добавить нового клиента
router.post('/', /* celebrate(validSetCreateMovies), */ createClient); // — добавить нового клиента
router.delete('/:id', /* celebrate(validSetDelMovies), */ deleteClient); // — удалить клиента
router.patch('/:id', /* celebrate(validSetCreateMovies), */ patchClient); // — изменить данные клиента

module.exports = router;
