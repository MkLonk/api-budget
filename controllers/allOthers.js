// при запросе не существующего ресурса
const NotFoundErr = require('../errors/notFound');

function allOthers(req, res, next) {
  Promise.reject(new NotFoundErr('Ой. Запрашиваемый ресурс не найден.'))
    .catch(next);
}

module.exports = { allOthers };
