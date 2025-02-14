// projectWork.js - схема - проектые работы
const mongoose = require('mongoose');

const projectWorkSchema = new mongoose.Schema({

  contract: { // в рамках кокого договора выполняется работа
    type: mongoose.Schema.Types.ObjectId,
    ref: 'contract',
    required: true, // обязательное поле
  },

  sectionProject: { // раздел проекта developer
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sectionProject',
    required: true, // обязательное поле
  },

  developer: { // проектировщик раздела (разработчик)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'developer',
    required: true, // обязательное поле
  },

  price: { // стоимость раздела
    type: Number,
    required: true, // обязательное поле
  },

  comment: { // комментарий
    type: String,
    maxlength: 256,
  },
});

module.exports = mongoose.model('projectWork', projectWorkSchema);
