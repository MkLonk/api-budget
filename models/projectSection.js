// projectSection.js - схема данных - разделы проекта
const mongoose = require('mongoose');

const projectSectionSchema = new mongoose.Schema({

  name: { // наименование сокращенно - АР
    type: String,
    required: true, // обязательное поле
    maxlength: 7,
  },

  fullName: { // наименование полное - Архитектурные решения
    type: String,
    required: true, // обязательное поле
    maxlength: 512,
  },

  comment: { // комментарий
    type: String,
    maxlength: 256,
  },
});

module.exports = mongoose.model('projectSection', projectSectionSchema);
