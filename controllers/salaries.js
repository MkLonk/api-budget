// salaries.js контроллер, учет заработных плат +++

const Salary = require('../models/salary');
const { errMes, message } = require('../utils/constants');
const NotFoundErr = require('../errors/notFound');
const BadRequestErr = require('../errors/badRequest');
/* const ConflictErr = require('../errors/conflict');
const ForbiddenErr = require('../errors/forbidden'); */

// **************************************************
// *** getSalaries - вернать все заработные платы ***
// **************************************************
function getSalaries(req, res, next) {
  Salary.find({})
    .then((foundSalaries) => {
      if (!foundSalaries) {
        throw new NotFoundErr(errMes.notFoundSalaries);
      }
      return res.status(200).send(foundSalaries);
    })
    .catch(next);
}

// ************************************************
// *** createSalary - добавить заработную плату ***
// ************************************************
function createSalary(req, res, next) {
  // записываю id авторизованного пользователя в body.owner
  // req.body.owner = req.user._id;

  Salary.create(req.body)
    .then((createdSalary) => {
      res.status(201).send({ data: createdSalary });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr(errMes.incorrectData));
      }
      next(err);
    })
    .catch(next);
}

// ************************************************
// *** deleteSalary - удалить заработную плату ***
// ************************************************
function deleteSalary(req, res, next) {
  Salary.findById(req.params.id)
    // если запись не найдена, выдать ошибку
    .then((foundSalary) => {
      if (!foundSalary) {
        throw new NotFoundErr(errMes.notFoundId);
      }
      Salary.deleteOne(foundSalary)
        .then(() => res.status(200).send({ data: { message: message.delSalary } }))
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

// ********************************************************
// *** patchSalary - обновляет данные о заработной плате***
// ********************************************************
function patchSalary(req, res, next) {
  const {
    date,
    projectWork,
    amount,
    comment,
  } = req.body;

  if ( // если данные не переданы выдать ошибку
    !date
    && !projectWork
    && !amount
    && !comment
  ) {
    throw new BadRequestErr(errMes.incorrectData);
  }

  // ищем запись по id
  Salary.findById(req.params.id)
    .then((foundSalary) => {
      // запись не найдена выдать ошибку
      if (!foundSalary) {
        throw new NotFoundErr(errMes.notFoundId);
      }
      // если переданные и существующие данны равны, выбросить ошибку
      if (date === foundSalary.date
        || projectWork === foundSalary.projectWork
        || amount === foundSalary.amount
        || comment === foundSalary.comment
      ) next(new BadRequestErr(errMes.valuesNotChanged));
      else {
        // иначе изменить данные
        Salary.findByIdAndUpdate(req.params.id, req.body,
          { new: true, runValidators: true })
          .then((updatedSalary) => res.status(201).send(updatedSalary))
          .catch((err) => {
            // если ошибка валидации
            if (err.name === 'ValidationError') {
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
  getSalaries,
  createSalary,
  deleteSalary,
  patchSalary,
};
