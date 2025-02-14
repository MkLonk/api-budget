// contracts.js контроллер, договора +++

const Contract = require('../models/contract');
const { errMes, message } = require('../utils/constants');
const NotFoundErr = require('../errors/notFound');
const BadRequestErr = require('../errors/badRequest');
// const ConflictErr = require('../errors/conflict');
// const ForbiddenErr = require('../errors/forbidden');

// *******************************************
// *** getContracts - вернуть все договора ***
// *******************************************
function getContracts(req, res, next) {
  Contract.find({})
    .then((foundContracts) => {
      if ((!foundContracts) || (foundContracts.length === 0)) {
        throw new NotFoundErr(errMes.notContracts);
      }
      return res.status(200).send(foundContracts);
    })
    .catch(next);
}

// **********************************************
// *** createContract - создать новый договор ***
// **********************************************
function createContract(req, res, next) {
  // записываю id авторизованного пользователя в body.owner
  // req.body.owner = req.user._id;
  Contract.create(req.body)
    .then((createdContract) => {
      res.status(201).send({ data: createdContract });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr(errMes.incorrectData));
      }
      next(err);
    })
    .catch(next);
}

// **********************************************
// *** deleteContract - удалить договор по id ***
// **********************************************
function deleteContract(req, res, next) {
  Contract.findById(req.params.id)
    .then((foundContract) => {
      // если запись не найдена, выдать ошибку
      if (!foundContract) {
        throw new NotFoundErr(errMes.notContractId);
      }
      Contract.deleteOne(foundContract)
        .then(() => res.status(200).send({ data: { message: message.delContract } }))
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
// *** patchContract - изменяет данные контракта ***
// *************************************************
function patchContract(req, res, next) {
  const {
    dateStart,
    dateFinish,
    code,
    name,
    client,
    developer,
    cost,
    comment,
  } = req.body;

  // если данные не переданы выдать ошибку
  if (
    !dateStart
    && !dateFinish
    && !code
    && !name
    && !client
    && !developer
    && !cost
    && !comment
  ) {
    throw new BadRequestErr(errMes.incorrectData);
  }

  // ищем запись по id
  Contract.findById(req.params.id)
    .then((foundContract) => {
      // запись не найдена выдать ошибку
      if (!foundContract) {
        throw new NotFoundErr(errMes.notContractId);
      }
      // если переданные и существующие данны равны выбросить ошибку
      if (dateStart === foundContract.dateStart
        || dateFinish === foundContract.dateFinish
        || code === foundContract.code
        || name === foundContract.name
        || client === foundContract.client
        || developer === foundContract.developer
        || cost === foundContract.cost
        || comment === foundContract.comment
      ) next(new BadRequestErr(errMes.valuesNotChanged));
      else {
        // иначе изменить данные
        Contract.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
          .then((updatedContract) => res.status(201).send(updatedContract))
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
  getContracts,
  createContract,
  deleteContract,
  patchContract,
};
