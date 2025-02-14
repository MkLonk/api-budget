// projectSections.js контроллер, разделы проекта

const ProjectSection = require('../models/projectSection');
const { errMes, message } = require('../utils/constants');
const NotFoundErr = require('../errors/notFound');
const BadRequestErr = require('../errors/badRequest');
// const ConflictErr = require('../errors/conflict');
// const ForbiddenErr = require('../errors/forbidden');

// ********************************************************
// *** getProjectSections - вернуть все разделы проекта ***
// ********************************************************
function getProjectSections(req, res, next) {
  ProjectSection.find({})
    .then((projectSections) => {
      if ((!projectSections) || (projectSections.length === 0)) {
        throw new NotFoundErr(errMes.notProjectSections);
      }
      return res.status(200).send(projectSections);
    })
    .catch(next);
}

// ***********************************************************
// *** createProjectSection - создать новый раздел проекта ***
// ***********************************************************
function createProjectSection(req, res, next) {
  // записываю id авторизованного пользователя в body.owner
  // req.body.owner = req.user._id;

  ProjectSection.create(req.body)
    .then((createdProjectSection) => {
      res.status(201).send({ data: createdProjectSection });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr(errMes.incorrectData));
      }
      next(err);
    })
    .catch(next);
}

// ***********************************************************
// *** deleteProjectSection - удалить раздел проекта по id ***
// ***********************************************************
function deleteProjectSection(req, res, next) {
  ProjectSection.findById(req.params.id)
    .then((foundProjectSection) => {
      // запись не найдена
      if (!foundProjectSection) {
        throw new NotFoundErr(errMes.notClient);
      }
      ProjectSection.deleteOne(foundProjectSection)
        .then(() => res.status(200).send({ data: { message: message.delClient } }))
        .catch(next);

      // на будущее
      // перед уделанием выполнить проверку
      // что данный раздел не изпользуется в projectWork
    })
    .catch(next);
}

// *****************************************************************
// *** patchProjectSection - изменяет данные в "разделы проекта" ***
// *****************************************************************
function patchProjectSection(req, res, next) {
  const { name, fullName, comment } = req.body;

  // если данные не переданы выдать ошибку
  if (!name && !fullName && !comment) {
    throw new BadRequestErr(errMes.incorrectData);
  }

  // ищем запись по id
  ProjectSection.findById(req.params.id)
    .then((foundProjectSection) => {
      // запись не найдена выдать ошибку
      if (!foundProjectSection) {
        throw new NotFoundErr(errMes.notProjectSectionId);
      }
      // если переданные и существующие данны равны выбросить ошибку
      if (name === foundProjectSection.name
        || fullName === foundProjectSection.fullName
        || comment === foundProjectSection.comment
      ) next(new BadRequestErr(errMes.valuesNotChanged));
      else {
        // иначе изменить данные
        ProjectSection.findByIdAndUpdate(req.params.id, req.body,
          { new: true, runValidators: true })
          .then((updatedProjectSection) => res.status(201).send(updatedProjectSection))
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
  getProjectSections,
  createProjectSection,
  deleteProjectSection,
  patchProjectSection,
};
