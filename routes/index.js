const router = require('express').Router();
const { celebrate } = require('celebrate');
const routeUser = require('./users');
const routeCompanies = require('./companies');
// const routePayments = require('./payments');
//
const routeClients = require('./clients');
const routeContract = require('./contracts');
const routeProjectSections = require('./projectSections');
const routeDevelopers = require('./developers');
// const routeAllOthers = require('./allOthers');
const auth = require('../middlewares/auth');
const { validSetCreateUser } = require('../middlewares/validSets');
const { login, createUser } = require('../controllers/users');

// открытые роуты
router.post('/login', celebrate(validSetCreateUser), login); // — роут для логина
router.post('/signup', celebrate(validSetCreateUser), createUser); // роут для регистрации

// авторизация
router.use(auth);

// Эти роуты закрытые авторизацией
router.use('/users', routeUser);
router.use('/companies', routeCompanies);

// router.use('/payments', routePayments);
//
router.use('/clients', routeClients); // клиенты
router.use('/projectSections', routeProjectSections); // разделы проекта
router.use('/developers', routeDevelopers); // исполнители
router.use('/contracts', routeContract); // заказчики
// router.use('/*', routeAllOthers); createContract

module.exports = router;
