// payment.js - схема данных об оплатах по договорам
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  date: { // дата платежа
    type: Date,
    required: true, // обязательное поле
  },

  payment: { // сумма платежа
    type: Number,
    required: true, // обязательное поле
  },

  contract: { // договор за который выполнена оплата
    type: mongoose.Schema.Types.ObjectId,
    ref: 'contract',
    required: true, // обязательное поле
  },

  comment: { // комментарий платежа
    type: String,
    maxlength: 256,
  },
});

module.exports = mongoose.model('payment', paymentSchema);
