// contract.js - схема данных - договор на проектирование
const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({

  date: { // дата подписания контракта
    type: String,
    required: true, // обязательное поле
  },

  dateEnd: { // дата завершения контракта
    type: String,
  },

  number: { // шифр проекта
    type: String,
    maxlength: 10,
  },

  name: { // наименование проекта
    type: String,
    required: true, // обязательное поле
    maxlength: 512,
  },

  price: { // сумма контракта
    type: Number,
    required: true, // обязательное поле
  },

  client: { // _id заказчика
    type: mongoose.Schema.Types.ObjectId,
    ref: 'client',
    required: true, // обязательное поле
  },

  developer: { // _id исполнителя-подрядчика
    type: mongoose.Schema.Types.ObjectId,
    ref: 'developer',
    required: true, // обязательное поле
  },

  comment: { // комментарий
    type: String,
    maxlength: 256,
  },
});

module.exports = mongoose.model('contract', contractSchema);
