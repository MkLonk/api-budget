const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const { errMes } = require('../utils/constants');

const userSchema = new mongoose.Schema({

  email: { // email пользователя
    type: String,
    unique: true, // уникальное
    required: true, // обязательное
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },

  password: { // password пользователя
    type: String,
    required: true,
    minlength: 2,
    select: false, // так по умолчанию хеш пароля не будет возвращаться из базы
  },

  // необязательные поля
  // фамилия
  lastName: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },

  // имя
  firstName: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },

  // отчество
  patronymic: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },

  // ноиер телефона
  phoneNumber: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },

  // основные разделы
  mainSection: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
});

/** ****************************************************************
 * Дополняем объект userSchema методом findUserByCredentials.      *
 * Метод findUserByCredentials находит пользователя в БД по email, *
 * и сравнивает полученный пароль с сохраненным                    *
 * Функция findUserByCredentials не должна быть стрелочной!!!      *
 ***************************************************************** */
userSchema.statics.findUserByCredentials = function noName(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      // не нашёлся — отклоняем промис
      if (!user) {
        return Promise.reject(new Error(errMes.notLogin));
      }

      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { // не совпали — отклоняем промис
            return Promise.reject(new Error(errMes.notLogin));
          }

          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
