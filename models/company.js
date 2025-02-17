// company.js - схема данных о заказчиках
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // обязательное поле
    maxlength: 250,
  },
  // ИНН компании, не уникальный, может быть несколько компаний с одним ИНН
  inn: {
    type: String,
    maxlength: 12,
  },
  // owner - основатель
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  // members - массив участников с указанием роли
  members: [{
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'moderator', 'financier', 'user', 'guest'],
      required: true,
    },
    assigned_at: {
      type: Date,
      default: Date.now,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  }],
});

module.exports = mongoose.model('company', companySchema);
