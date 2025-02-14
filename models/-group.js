const mongoose = require('mongoose');
// const isURL = require('validator/lib/isURL');

const groupSchema = new mongoose.Schema({

  name: { // наименование группы, организации
    type: String,
    required: true, // обязательное поле
    maxlength: 512,
  },

  fullName: { // наименование группы полное
    type: String,
    required: true, // обязательное поле
    maxlength: 512,
  },

  owner: { // создетель группы
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true, // обязательное поле
  },

  moderators: [{ // массив пользователей которые могут создавать и изменять данные
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],

  financiers: [{ // массив пользователей которые видят финансы
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],

  users: [{ // массив пользователей которые видят финансы
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],
});

module.exports = mongoose.model('group', groupSchema);
