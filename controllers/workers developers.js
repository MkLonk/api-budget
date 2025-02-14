// developers.js контроллер, для разработчиков (работники) +++

const Developers = require('../models/developer');
const { errMes, message } = require('../utils/constants');
const NotFoundErr = require('../errors/notFound');
const BadRequestErr = require('../errors/badRequest');
// const ConflictErr = require('../errors/conflict');
// const ForbiddenErr = require('../errors/forbidden');

// **************************************************
// *** getDevelopers - вернуть всех разработчиков ***
// **************************************************
function getDevelopers(req, res, next) {
  Developers.find({})
    .then((developers) => {
      if ((!developers) || (developers.length === 0)) {
        throw new NotFoundErr(errMes.notDevelopers); // изменить ошибку
      }
      return res.status(200).send(developers);
    })
    .catch(next);
}

// *****************************************************
// *** createDeveloper - создать нового разработчика ***
// *****************************************************
function createDeveloper(req, res, next) {
  // записываю id авторизованного пользователя в body.owner
  // req.body.owner = req.user._id;

  Developers.create(req.body)
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

// ****************************************************
// *** deleteDeveloper - удалить разработчика по id ***
// ****************************************************
function deleteDeveloper(req, res, next) {
  Developers.findById(req.params.id)
    .then((foundDeveloper) => {
      // если запись не найдена, выдать ошибку
      if (!foundDeveloper) {
        throw new NotFoundErr(errMes.notDeveloperId);
      }
      Developers.deleteOne(foundDeveloper)
        .then(() => res.status(200).send({ data: { message: message.delDeveloper } })) // исправить
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
// *** patchDeveloper - обновляет данные о разработчике ***
// ********************************************************
function patchDeveloper(req, res, next) {
  const {
    name, workPhone, workMail,
    user, comment,
  } = req.body;

  if ( // если данные не переданы выдать ошибку
    !name
    && !workPhone
    && !workMail
    && !user
    && !comment
  ) {
    throw new BadRequestErr(errMes.incorrectData);
  }

  // ищем разработчика по id
  Developers.findById(req.params.id)
    .then((foundDeveloper) => {
      // запись не найдена выдать ошибку
      if (!foundDeveloper) {
        throw new NotFoundErr(errMes.notDeveloperId);
      }
      // если переданные и существующие данны равны, выбросить ошибку
      if (name === foundDeveloper.name
        || workPhone === foundDeveloper.workPhone
        || workMail === foundDeveloper.workMail
        || user === foundDeveloper.users
        || comment === foundDeveloper.comment
      ) next(new BadRequestErr(errMes.valuesNotChanged));
      else {
        Developers.findByIdAndUpdate(req.params.id, req.body,
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
  createDeveloper,
  deleteDeveloper,
  patchDeveloper,
};
