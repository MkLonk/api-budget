// developer.js - схема данных - разработчики, исполнители, работники
const mongoose = require('mongoose');

const developerSchema = new mongoose.Schema({

  name: { // наименование
    type: String,
    required: true, // обязательное поле
    maxlength: 512,
  },

  workPhone: { // рабочий телефон
    type: String,
    required: true, // обязательное поле
    maxlength: 512,
  },

  workMail: { // рабочая почта
    type: String,
    required: true, // обязательное поле
    maxlength: 512,
  },

  user: { // user - пользователь связаный с этим проектировщиком
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true, // обязательное поле
  },

  comment: { // комментарий
    type: String,
    maxlength: 256,
  },
});

module.exports = mongoose.model('developer', developerSchema);
