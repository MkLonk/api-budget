// salary.js - схема данных - оплата за работы
const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  date: { // дата платежа
    type: Date,
    required: true, // обязательное поле
  },

  projectWork: { // работа за которую выполняется оплата
    type: mongoose.Schema.Types.ObjectId,
    ref: 'projectWork',
    required: true, // обязательное поле
  },

  amount: { // сумма оплаты за работу
    type: Number,
    required: true, // обязательное поле
  },

  comment: { // комментарий
    type: String,
    maxlength: 256,
  },
});

module.exports = mongoose.model('salary', salarySchema);
