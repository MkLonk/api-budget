// projectWork.js контроллер, проектные работы +++

const ProjectWork = require('../models/projectWork');
const { errMes, message } = require('../utils/constants');
const NotFoundErr = require('../errors/notFound');
const BadRequestErr = require('../errors/badRequest');
// const ConflictErr = require('../errors/conflict');
// const ForbiddenErr = require('../errors/forbidden');

// ************************************************
// *** getProjectWorks - найти проектные работы ***
// ************************************************
function getProjectWorks(req, res, next) {
  ProjectWork.find({})
    .then((projectWorks) => {
      if ((!projectWorks) || (projectWorks.length === 0)) {
        throw new NotFoundErr(errMes.notFoundProjectWorks);
      }
      return res.status(200).send(projectWorks);
    })
    .catch(next);
}

// *****************************************************
// *** createProjectWork - добавить проектную работу ***
// *****************************************************
function createProjectWork(req, res, next) {
  // записываю id авторизованного пользователя в body.owner
  // req.body.owner = req.user._id;

  ProjectWork.create(req.body)
    .then((createdProjectWork) => {
      res.status(201).send({ data: createdProjectWork });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr(errMes.incorrectData));
      }
      next(err);
    })
    .catch(next);
}

// **********************************************************
// *** deleteProjectWork - удалить проектную работу по id ***
// **********************************************************
function deleteProjectWork(req, res, next) {
  ProjectWork.findById(req.params.id)
    .then((foundProjectWork) => {
      // если запись не найдена, выдать ошибку
      if (!foundProjectWork) {
        throw new NotFoundErr(errMes.notFoundProjectWorks);
      }
      ProjectWork.deleteOne(foundProjectWork)
        .then(() => res.status(200).send({ data: { message: message.delProjectWork } }))
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

// **************************************************************
// *** patchProjectWork - обновляет данные о проектной работе ***
// **************************************************************
function patchProjectWork(req, res, next) {
  const {
    contract, sectionProject, developer,
    price, comment,
  } = req.body;

  // если данные не переданы выдать ошибку
  if (
    !contract
    && !sectionProject
    && !developer
    && !price
    && !comment
  ) {
    throw new BadRequestErr(errMes.incorrectData);
  }

  // ищем запись по id
  ProjectWork.findById(req.params.id)
    .then((foundProjectWork) => {
      // запись не найдена выдать ошибку
      if (!foundProjectWork) {
        throw new NotFoundErr(errMes.notProjectWorksId);
      }
      // если переданные и существующие данны равны, выбросить ошибку
      if (contract === foundProjectWork.contract
        || sectionProject === foundProjectWork.sectionProject
        || developer === foundProjectWork.developer
        || price === foundProjectWork.price
        || comment === foundProjectWork.comment
      ) next(new BadRequestErr(errMes.valuesNotChanged));
      // иначе изменить данные
      else {
        ProjectWork.findByIdAndUpdate(req.params.id, req.body,
          { new: true, runValidators: true })
          .then((updatedProjectWork) => res.status(201).send(updatedProjectWork))
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
  getProjectWorks,
  createProjectWork,
  deleteProjectWork,
  patchProjectWork,
};
