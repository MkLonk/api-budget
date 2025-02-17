// projectSections.js контроллер, клиенты (заказчики) +++

const Client = require('../models/client');
const { errMes, message } = require('../utils/constants');
const NotFoundErr = require('../errors/notFound');
const BadRequestErr = require('../errors/badRequest');

// Универсальную функцию для обработки ошибок
function handleError(err, next) {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    return next(new BadRequestErr(errMes.incorrectData));
  }
  return next(err);
}

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

/* function getClientId(req, res, next) {
  Client.findById(req.params.id)
    .then((foundClient) => {
      // если запись не найдена, выдать ошибку
      if (!foundClient) {
        throw new NotFoundErr(errMes.notClientId);
      }
      return res.status(200).send(foundClient)
    })
    .catch(next);
} */

function getClientId(req, res, next) {
  Client.findById(req.params.id)
    .orFail(new NotFoundErr(errMes.notClientId)) // Используйте orFail()
    .then(client => res.status(200).send(client))
    .catch(next);
}


// *********************************************
// *** createClient - создать нового клиента ***
// *********************************************
/* function createClient(req, res, next) {
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
} */
function createClient(req, res, next) {
  Client.create(req.body)
    .then(createdClient => res.status(200).send({ data: createdClient }))
    .catch(err => handleError(err, next));
}

// ********************************************
// *** deleteClient - удалить клиента по id ***
// ********************************************
/* function deleteClient(req, res, next) {
  Client.findById(req.params.id)
    .then((foundClient) => {
      // если запись не найдена, выдать ошибку
      if (!foundClient) {
        throw new NotFoundErr(errMes.notClientId);
      }
      Client.deleteOne(foundClient)
        .then(() => res.status(200).send({ data: { message: message.delClient } }))
        .catch(next);
    })
    .catch(next);
}
 */

function deleteClient(req, res, next) {
  Client.findByIdAndDelete(req.params.id) // Используйте findByIdAndDelete()
    .orFail(new NotFoundErr(errMes.notClientId))
    .then(() => res.status(200).send({ data: { message: message.delClient } }))
    .catch(next);
}

// *********************************************
// *** patchClient - изменяет данные клиента ***
// *********************************************
/* function patchClient(req, res, next) {
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
 */
function patchClient(req, res, next) {
  const allowedFields = ['name', 'representative', 'phone', 'email'];
  const updateData = Object.keys(req.body).filter(key => allowedFields.includes(key)).reduce((obj, key) => {
    obj[key] = req.body[key];
    return obj;
  }, {});

  if (Object.keys(updateData).length === 0) {
    return next(new BadRequestErr(errMes.incorrectData));
  }

  Client.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  )
    .orFail(new NotFoundErr(errMes.notClientId))
    .then(updatedClient => res.status(200).send(updatedClient))
    .catch(err => handleError(err, next));
}




module.exports = {
  getClients,
  createClient,
  deleteClient,
  patchClient,
  getClientId,
};
