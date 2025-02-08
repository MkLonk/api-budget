// payments.js контроллер, платежи по договорам +++

const Payment = require('../models/payment');
const { errMes, message } = require('../utils/constants');
const NotFoundErr = require('../errors/notFound');
const BadRequestErr = require('../errors/badRequest');
/* const ConflictErr = require('../errors/conflict');
const ForbiddenErr = require('../errors/forbidden'); */

// *****************************************
// *** getPayments - вернуть все платежи ***
// *****************************************
function getPayments(req, res, next) {
  Payment.find({})
    .then((payments) => {
      if (!payments) {
        throw new NotFoundErr(errMes.notPayments);
      }
      return res.status(200).send(payments);
    })
    .catch(next);
}

// **************************************************
// *** createPayment - создать платеж по договору ***
// **************************************************
function createPayment(req, res, next) {
  // записываю id авторизованного пользователя в body.owner
  // req.body.owner = req.user._id;

  Payment.create(req.body)
    .then((createdPayment) => {
      res.status(201).send({ data: createdPayment });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr(errMes.incorrectData));
      }
      next(err);
    })
    .catch(next);
}

// **************************************************
// *** deletePayment - удалить платеж по договору ***
// **************************************************
function deletePayment(req, res, next) {
  Payment.findById(req.params.id)
    .then((foundPayment) => {
      // если запись не найдена, выдать ошибку
      if (!foundPayment) {
        throw new NotFoundErr(errMes.notPaymentId);
      }
      Payment.deleteOne(foundPayment)
        .then(() => res.status(200).send({ data: { message: message.delPayment } }))
        .catch(next);

      // проверить права авторизованного пользователя на уделение
      /*       if (String(findMovie.owner._id) === String(req.user._id)) {
              Movie.deleteOne(findMovie)
                .then(() => res.status(200).send({ data: { message: message.delMovie } }))
                .catch(next);
            } else {
              throw new ForbiddenErr(errMes.notEnoughRights);
            } */
    })
    .catch(next);
}

// *************************************************
// *** patchPayment - обновляет данные о платежах***
// *************************************************
function patchPayment(req, res, next) {
  const {
    date,
    payment,
    contract,
    comment,
  } = req.body;

  if ( // если данные не переданы выдать ошибку
    !date
    && !payment
    && !contract
    && !comment
  ) {
    throw new BadRequestErr(errMes.incorrectData);
  }

  // ищем платеж по id
  Payment.findById(req.params.id)
    .then((findPayment) => {
      // запись не найдена выдать ошибку
      if (!findPayment) {
        throw new NotFoundErr(errMes.notContract);
      }
      // если переданные и существующие данны равны, выбросить ошибку
      if (date === findPayment.date
        || payment === findPayment.payment
        || contract === findPayment.contract
        || comment === findPayment.comment
      ) next(new BadRequestErr(errMes.valuesNotChanged));
      else {
        // иначе изменить данные
        Payment.findByIdAndUpdate(req.params.id, req.body,
          { new: true, runValidators: true })
          .then((updatedPayment) => res.status(201).send(updatedPayment)) // исправить
          .catch((err) => {
            if (err.name === 'ValidationError') { // если ошибка валидации
              return next(new BadRequestErr(errMes.incorrectData));
            }
            return next(err);
          });
      }
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getPayments,
  createPayment,
  deletePayment,
  patchPayment,
};
