const { NODE_ENV, JWT_SECRET, SALT_ROUNDS = 10 } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { errMes } = require('../utils/constants');
const NotFoundErr = require('../errors/notFound');
const BadRequestErr = require('../errors/badRequest');
const ConflictErr = require('../errors/conflict');
const UnauthorizedErr = require('../errors/unauthorized');

// возвращает аворизованного пользователя
function getMe(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundErr(errMes.notUser);
      }
      return res.status(200).send(user);
    })
    .catch(next);
}

// обновляет даннае пользователя пользователя
function patchMe(req, res, next) {
  User.findByIdAndUpdate(req.user._id, {
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    patronymic: req.body.patronymic,
    phoneNumber: req.body.phoneNumber,
    mainSection: req.body.mainSection,
  }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: false, // если пользователь не найден, он не будет создан
  })
    .then((editedUser) => res.status(201).send(editedUser))
    .catch(next);
}

// создаёт пользователя и возвращает токен
function createUser(req, res, next) {
  const { email, password } = req.body;

  // Хешируем пароль
  bcrypt.hash(password, Number(SALT_ROUNDS))
    .then((hashPass) => User.create({ email, password: hashPass }))
    .then((user) => {
      // Удаляем хеш пароля из ответа (он не должен передаваться клиенту)
      const { _id } = user;

      // Создаем JWT-токен
      const token = jwt.sign(
        { _id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );

      // Возвращаем токен, ID пользователя и email
      res.status(201).send({
        userId: _id,
        email: user.email,
        token,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new ConflictErr('Пользователь с таким email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
}

/* // создаёт пользователя
function createUser(req, res, next) {
  const { email, password } = req.body;

  bcrypt.hash(password, Number(SALT_ROUNDS)) // хешируем пароль
    .then((hashPass) => User.create({ email, password: hashPass }))
    .then(() => res.status(201).send({ message: `Email: ${email} зерагистрирован` }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr(errMes.incorrectData));
      } else if (err.name === 'MongoError') {
        next(new ConflictErr(errMes.conflictUser));
      } else {
        next(err);
      }
    });
} */

// контроллер login для аутентификации пользователя +
function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      res.status(200).send({
        token,
        userId: user._id,
        lastName: user.lastName,
        firstName: user.firstName,
        patronymic: user.patronymic,
        phoneNumber: user.phoneNumber,
        email: user.email,
        mainSection: user.mainSection,
      });
    })
    .catch(() => {
      // ошибка аутентификации
      next(new UnauthorizedErr(errMes.notLogin));
    });
}

module.exports = {
  getMe,
  patchMe,
  createUser,
  login,
};
