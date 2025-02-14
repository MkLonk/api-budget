// developer.js - схема данных о подрядчике (проектном бюро)
const mongoose = require('mongoose');

const developerSchema = new mongoose.Schema({

  name: { // наименование подрядчика
    type: String,
    required: true, // обязательное поле
    maxlength: 250,
  },

  representative: { // фио представителя подрядчика
    type: String,
    required: true, // обязательное поле
    maxlength: 50,
  },

  users: [{ // users - массих пользователей, предстовителей подрядчика
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false, // обязательное поле
  }],

  phone: { // телефон подрядчика
    type: String,
    required: false, // обязательное поле
    maxlength: 12,
  },

  email: { // email подрядчика
    type: String,
    required: false, // обязательное поле
    maxlength: 50,
  },

  inn: { // ИНН подрядчика
    type: String,
    maxlength: 256,
  },
});

module.exports = mongoose.model('developer', developerSchema);
