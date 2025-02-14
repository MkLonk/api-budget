// group.js контроллер

const Group = require('../models/group');
const { errMes } = require('../utils/constants');
const NotFoundErr = require('../errors/notFound');
const BadRequestErr = require('../errors/badRequest');
// const ConflictErr = require('../errors/conflict');
// const ForbiddenErr = require('../errors/forbidden');

// найти все группы
function getGroups(req, res, next) {
  Group.find({})
    .then((groups) => {
      if ((!groups) || (groups.length === 0)) {
        throw new NotFoundErr(errMes.notClients);
      }
      return res.status(200).send(groups);
    })
    .catch(next);
}

// добавить новую группу
function createGroup(req, res, next) {
  req.body.owner = req.user._id; // записываю id авторизованного пользователя в body.owner
  req.body.users = req.user._id; // записываю id авторизованного пользователя в body.owner

  Group.create(req.body)
    .then((addGroup) => {
      res.status(201).send({ data: addGroup });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr(errMes.incorrectData));
      }
      next(err);
    })
    .catch(next);
}

// добавить пользователей в группу
function addListUser(req, res, next) {
  Group.findById(req.params.id)
    .then((group) => {
      if (group) {
        Group.findByIdAndUpdate(
          req.params.id,
          { $addToSet: { users: req.users } },
          { new: true },
        )
          .populate(['users'])
          .then((modifiedGroup) => res.status(201).send(modifiedGroup))
          .catch((err) => {
            if (err.name === 'ValidationError') { // если ошибка валидации
              return next(new BadRequestErr(errMes.incorrectData));
            }
            return next(err);
          });
      }
    });
}

// удалить пользователей из группы
function delListUser(req, res, next) {
  Group.findById(req.params.id)
    .then((group) => {
      if (group) {
        Group.findByIdAndUpdate(
          req.params.id,
          { $pull: { users: req.users } },
          { new: true },
        )
          .populate(['users'])
          .then((modifiedGroup) => res.status(201).send(modifiedGroup))
          .catch((err) => {
            if (err.name === 'ValidationError') { // если ошибка валидации
              return next(new BadRequestErr(errMes.incorrectData));
            }
            return next(err);
          });
      }
    });
}

module.exports = {
  getGroups,
  createGroup,
  addListUser,
  delListUser,
};
