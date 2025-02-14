// Developers.js контроллер, для "проектные бюро" +++

const Developer = require('../models/developer');
const { errMes, message } = require('../utils/constants');
const NotFoundErr = require('../errors/notFound');
const BadRequestErr = require('../errors/badRequest');
const ForbiddenErr = require('../errors/forbidden');
// const ConflictErr = require('../errors/conflict');

// *************************************************
// *** getDevelopers - вернуть всех подрядчиков ***
// *************************************************
function getDevelopers(req, res, next) {
  // ищем все проектные бюро к которым пользователь имеет доступ
  Developer.find({ users: req.user._id })
    .then((foundDeveloper) => {
      if ((!foundDeveloper) || (foundDeveloper.length === 0)) {
        throw new NotFoundErr(errMes.notDevelopers); //*
      }
      return res.status(200).send(foundDeveloper);
    })
    .catch(next);
}

// ********************************************
// *** getDeveloperId - искомого подрядчика ***
// ********************************************

function getDeveloperId(req, res, next) {
  Developer.findById(req.params.id)
    .then((foundDeveloper) => {
      // если запись не найдена, выдать ошибку
      if (!foundDeveloper) {
        throw new NotFoundErr(errMes.notDeveloperId);
      }
      return res.status(200).send(foundDeveloper)
    })
    .catch(next);
}





// *********************************************************
// *** addUserToContractor - добавить в группу пользователя ***
// *********************************************************
function addUserToDeveloper(req, res, next) {
  Developer.findByIdAndUpdate(
    req.params.id, // id проектного бюро, в которое необходимо добавить пользователя
    { $addToSet: { users: req.body.user } }, // добавить в массив нового пользователя
    { new: true },
  )
    .populate(['owner', 'users', 'moderators'])
    .then((developer) => {
      if (developer) {
        return res.status(200).send(developer);
      }
      throw new NotFoundErr(errMes.notDeveloperId);
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
// *** createDeveloper - добавить нового подрядчика ***
// *****************************************************
function createDeveloper(req, res, next) {
  // записываю id авторизованного пользователя в body.owner
  // он будет записан как создатель, модератор и пользователь
  req.body.owner = req.user._id;
  req.body.moderators = req.user._id;
  req.body.users = req.user._id;

  Developer.create(req.body)
    .then((createdDeveloper) => {
      res.status(201).send({ data: createdDeveloper });
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
// *** deleteDeveloper - удалить подрядчика по id ***
// ***************************************************
function deleteDeveloper(req, res, next) {
  Developer.findById(req.params.id)
    .then((foundDeveloper) => {
      // если запись не найдена, выдать ошибку
      if (!foundDeveloper) {
        throw new NotFoundErr(errMes.notDeveloperId);
      }
      Developer.deleteOne(foundDeveloper)
        .then(() => res.status(200).send({ data: { message: message.delDeveloper } }))
        .catch(next);
      // проверить права авторизованного пользователя на уделение
      /* if (String(foundDeveloper.owner._id) === String(req.user._id)) {
        Developer.deleteOne(foundDeveloper)
          .then(() => res.status(200)
            .send({ data: { message: message.delDeveloper } }))
          .catch(next);
      } else {
        throw new ForbiddenErr(errMes.notEnoughRights);
      } */
    })
    .catch(next);
}

// **********************************************************
// *** patchDeveloper - изменяет данные подрядчика по id ***
// **********************************************************
function patchDeveloper(req, res, next) {
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
  Developer.findById(req.params.id)
    .then((foundDeveloper) => {
      // запись не найдена выдать ошибку
      if (!foundDeveloper) {
        throw new BadRequestErr(errMes.notDeveloperId);
      }
      // если переданные и существующие данны равны, выбросить ошибку
      if (name === foundDeveloper.name
        || fullName === foundDeveloper.fullName
        || users === foundDeveloper.users
        || comment === foundDeveloper.comment
      ) next(new BadRequestErr(errMes.valuesNotChanged));
      else {
        // иначе изменить данные
        Developer.findByIdAndUpdate(req.params.id, req.body,
          { new: true, runValidators: true })
          .then((updatedDeveloper) => res.status(201).send(updatedDeveloper))
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
  getDevelopers,
  addUserToDeveloper,
  createDeveloper,
  deleteDeveloper,
  patchDeveloper,
  getDeveloperId,
};
