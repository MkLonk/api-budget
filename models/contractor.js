// contractor.js - схема данных о подрядчике (проектном бюро)
const mongoose = require('mongoose');

const contractorSchema = new mongoose.Schema({

  name: { // наименование
    type: String,
    required: true, // обязательное поле
    maxlength: 512,
  },

  fullName: { // полное наименование
    type: String,
    required: true, // обязательное поле
    maxlength: 512,
  },

  owner: { // создатель проектного бюро
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true, // обязательное поле
  },

  moderators: [{ // массив пользователей, которым разрешено модерировать данные
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],

  users: [{ // массих пользователей, которым разрешено видеть подрядчика
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],

  comment: { // комментарий
    type: String,
    maxlength: 256,
  },
});

module.exports = mongoose.model('contractor', contractorSchema);
