// projectSections.js контроллер, клиенты (заказчики) +++

const Client = require('../models/client');
const { errMes, message } = require('../utils/constants');
const NotFoundErr = require('../errors/notFound');
const BadRequestErr = require('../errors/badRequest');

// ******************************************
// *** getClients - вернуть всех клиентов ***
// ******************************************
function getClients(req, res, next) {
  Client.find({})
    .then((сlients) => {
      if ((!сlients) || (сlients.length === 0)) {
        throw new NotFoundErr(errMes.notClients);
      }
      return res.status(200).send(сlients);
    })
    .catch(next);
}

// ******************************************
// *** getClientId - искомого клиента     ***
// ******************************************

function getClientId(req, res, next) {
  Client.findById(req.params.id)
    .then((foundClient) => {
      // если запись не найдена, выдать ошибку
      if (!foundClient) {
        throw new NotFoundErr(errMes.notClientId);
      }
      return res.status(200).send(foundClient)
    })
    .catch(next);
}

// *********************************************
// *** createClient - создать нового клиента ***
// *********************************************
function createClient(req, res, next) {
  // записываю id авторизованного пользователя в body.owner
  // req.body.owner = req.user._id;

  Client.create(req.body)
    .then((createdClient) => {
      res.status(201).send({ data: createdClient });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr(errMes.incorrectData));
      }
      next(err);
    })
    .catch(next);
}

// ********************************************
// *** deleteClient - удалить клиента по id ***
// ********************************************
function deleteClient(req, res, next) {
  Client.findById(req.params.id)
    .then((foundClient) => {
      // если запись не найдена, выдать ошибку
      if (!foundClient) {
        throw new NotFoundErr(errMes.notClientId);
      }
      Client.deleteOne(foundClient)
        .then(() => res.status(200).send({ data: { message: message.delClient } }))
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

// *********************************************
// *** patchClient - изменяет данные клиента ***
// *********************************************
function patchClient(req, res, next) {
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
  Client.findById(req.params.id)
    .then((foundClient) => {
      // запись не найдена выдать ошибку
      if (!foundClient) {
        throw new BadRequestErr(errMes.notClientId);
      }
      // если переданные и существующие данны равны, выбросить ошибку
      if (name === foundClient.name
        || fullName === foundClient.fullName
        || users === foundClient.users
        || comment === foundClient.comment
      ) next(new BadRequestErr(errMes.valuesNotChanged));
      else {
        // иначе изменить данные
        Client.findByIdAndUpdate(req.params.id, req.body,
          { new: true, runValidators: true })
          .then((updatedClient) => res.status(201).send(updatedClient))
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
  getClients,
  createClient,
  deleteClient,
  patchClient,
  getClientId,
};
