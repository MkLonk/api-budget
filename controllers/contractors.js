// contractors.js контроллер, для "проектные бюро" +++

const Contractor = require('../models/contractor');
const { errMes, message } = require('../utils/constants');
const NotFoundErr = require('../errors/notFound');
const BadRequestErr = require('../errors/badRequest');
const ForbiddenErr = require('../errors/forbidden');
// const ConflictErr = require('../errors/conflict');

// *************************************************
// *** getContractors - вернуть всех подрядчиков ***
// *************************************************
function getContractors(req, res, next) {
  // ищем все проектные бюро к которым пользователь имеет доступ
  Contractor.find({ users: req.user._id })
    .then((foundContractor) => {
      if ((!foundContractor) || (foundContractor.length === 0)) {
        throw new NotFoundErr(errMes.notContractors);
      }
      return res.status(200).send(foundContractor);
    })
    .catch(next);
}

// *********************************************************
// *** addUserToContractor - добавить в группу пользователя ***
// *********************************************************
function addUserToContractor(req, res, next) {
  Contractor.findByIdAndUpdate(
    req.params.id, // id проектного бюро, в которое необходимо добавить пользователя
    { $addToSet: { users: req.body.user } }, // добавить в массив нового пользователя
    { new: true },
  )
    .populate(['owner', 'users', 'moderators'])
    .then((contractor) => {
      if (contractor) {
        return res.status(200).send(contractor);
      }
      throw new NotFoundErr(errMes.notContractorId);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestErr('Ошибка. Неверный формат Id');
      }
      return next(err);
    })
    .catch(next);
}

// *****************************************************
// *** createContractor - добавить нового подрядчика ***
// *****************************************************
function createContractor(req, res, next) {
  // записываю id авторизованного пользователя в body.owner
  // он будет записан как создатель, модератор и пользователь
  req.body.owner = req.user._id;
  req.body.moderators = req.user._id;
  req.body.users = req.user._id;

  Contractor.create(req.body)
    .then((createdContractor) => {
      res.status(201).send({ data: createdContractor });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr(errMes.incorrectData));
      }
      next(err);
    })
    .catch(next);
}

// ***************************************************
// *** deleteContractor - удалить подрядчика по id ***
// ***************************************************
function deleteContractor(req, res, next) {
  Contractor.findById(req.params.id)
    .then((foundContractor) => {
      // если запись не найдена, выдать ошибку
      if (!foundContractor) {
        throw new NotFoundErr(errMes.notContractorId);
      }
      // проверить права авторизованного пользователя на уделение
      if (String(foundContractor.owner._id) === String(req.user._id)) {
        Contractor.deleteOne(foundContractor)
          .then(() => res.status(200)
            .send({ data: { message: message.delContractor } }))
          .catch(next);
      } else {
        throw new ForbiddenErr(errMes.notEnoughRights);
      }
    })
    .catch(next);
}

// **********************************************************
// *** patchContractor - изменяет данные подрядчика по id ***
// **********************************************************
function patchContractor(req, res, next) {
  const {
    name, fullName,
    users, comment,
  } = req.body;

  if ( // если данные не переданы выдать ошибку
    !name
    && !fullName
    && !users
    && !comment
  ) {
    throw new BadRequestErr(errMes.incorrectData);
  }

  // ищем запись по id
  Contractor.findById(req.params.id)
    .then((foundContractor) => {
      // запись не найдена выдать ошибку
      if (!foundContractor) {
        throw new BadRequestErr(errMes.notContractorId);
      }
      // если переданные и существующие данны равны, выбросить ошибку
      if (name === foundContractor.name
        || fullName === foundContractor.fullName
        || users === foundContractor.users
        || comment === foundContractor.comment
      ) next(new BadRequestErr(errMes.valuesNotChanged));
      else {
        // иначе изменить данные
        Contractor.findByIdAndUpdate(req.params.id, req.body,
          { new: true, runValidators: true })
          .then((updatedContractor) => res.status(201).send(updatedContractor))
          .catch((err) => {
            // если ошибка валидации
            if (err.name === 'ValidationError') {
              return next(new BadRequestErr(errMes.incorrectData));
            }
            return next(err);
          });
      }
    })
    .catch(next);
}

module.exports = {
  getContractors,
  createContractor,
  deleteContractor,
  patchContractor,
  addUserToContractor,
};
