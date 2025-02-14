// client.js - схема данных о заказчиках
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({

  name: { // наименование клиента
    type: String,
    required: true, // обязательное поле
    maxlength: 250,
  },

  representative: { // фио представителя клиента
    type: String,
    required: true, // обязательное поле
    maxlength: 50,
  },

  users: [{ // users - массих пользователей, предстовителей клиента
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false, // обязательное поле
  }],

  phone: { // телефон клиента
    type: String,
    required: false, // обязательное поле
    maxlength: 12,
  },

  email: { // email клиента
    type: String,
    required: false, // обязательное поле
    maxlength: 50,
  },

  inn: { // ИНН клиента
    type: String,
    maxlength: 256,
  },
});

module.exports = mongoose.model('client', clientSchema);
