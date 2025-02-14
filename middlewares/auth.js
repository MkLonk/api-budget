const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const { errMes } = require('../utils/constants');
const Unauthorized = require('../errors/unauthorized');
const NotFoundErr = require('../errors/notFound');
const User = require('../models/user');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized(errMes.notAuth);
  }

  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    return Promise.reject(new Unauthorized(errMes.notAuth))
      .catch(next);
  }

  // проверием есть ли такой пользователь в базе
  return User.findById(payload._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundErr(errMes.notUser);
      }
      req.user = payload; // записываем пейлоуд в объект запроса
      next(); // пропускаем запрос дальше
    })
    .catch(next);
};
