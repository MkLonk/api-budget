// /controllers/companies.js

const Company = require('../models/company');
const NotFoundErr = require('../errors/notFound');
const BadRequestErr = require('../errors/badRequest');
const { errMes } = require('../utils/constants');

function handleError(err, next) {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    return next(new BadRequestErr(errMes.incorrectData));
  }
  return next(err);
}

// Проверка ИНН и получения компаний с таким ИНН
function checkInn(req, res, next) {
  const { inn } = req.params;

  if (!inn) {
    return next(new BadRequestErr(errMes.notCompanyInn));
  }

  return Company.find({ inn })
    .orFail(() => new NotFoundErr('Компании с указанным ИНН не найдены'))
    .then((companies) => res.status(200).send(companies))
    .catch(next);
}

// Получение всех данных о компании по ID
function getCompanyById(req, res, next) {
  const { companyId } = req.params;

  Company.findById(companyId)
    .populate('owner members.user_id')
    .orFail(() => new NotFoundErr('Компания не найдена'))
    .then((company) => res.status(200).send(company))
    .catch(next);
}

// Создание новой компании и назначение пользователя как owner
function createCompany(req, res, next) {
  // const allowedFields = ['name', 'inn', 'userId'];
  const { name, inn, userId } = req.body;

  if (!name || !userId) {
    return next(new BadRequestErr('Необходимо указать название и ID пользователя'));
  }

  const newCompany = new Company({
    name,
    inn,
    owner: userId,
    members: [
      {
        user_id: userId,
        role: 'owner',
        assigned_at: Date.now(),
        is_active: true,
      },
    ],
  });

  return newCompany
    .save()
    .then((savedCompany) => res.status(201).send(savedCompany))
    .catch((err) => handleError(err, next));
}

// Обновление данных компании
function updateCompany(req, res, next) {
  const allowedFields = ['name', 'inn'];
  const { companyId } = req.params;

  const updateData = Object.keys(req.body)
    .filter((key) => allowedFields.includes(key))
    .reduce((obj, key) => ({ ...obj, [key]: req.body[key] }), {});

  if (Object.keys(updateData).length === 0) {
    return next(new BadRequestErr('Не указаны данные для обновления'));
  }

  return Company.findByIdAndUpdate(
    companyId,
    updateData,
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundErr('Компания не найдена'))
    .then((updatedCompany) => res.status(200).send(updatedCompany))
    .catch((err) => handleError(err, next));
}

// Удаление компании
function deleteCompany(req, res, next) {
  const { companyId } = req.params;

  Company.findByIdAndDelete(companyId)
    .orFail(() => new NotFoundErr('Компания не найдена'))
    .then(() => res.status(200).send({ message: 'Компания успешно удалена' }))
    .catch(next);
}

// Вступление в компанию в роли гостя
function joinCompanyAsGuest(req, res, next) {
  const { companyId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return next(new BadRequestErr('Необходимо указать ID пользователя'));
  }

  return Company.findById(companyId)
    .orFail(() => new NotFoundErr('Компания не найдена'))
    .then(async (company) => {
      const isMember = company.members.some((member) => member.user_id.toString() === userId);

      if (isMember) {
        // Возвращаем ошибку, если пользователь уже является участником
        return next(new BadRequestErr('Пользователь уже является участником компании'));
      }

      company.members.push({
        user_id: userId,
        role: 'guest',
        assigned_at: Date.now(),
        is_active: true,
      });

      await company.save();
      return res.status(200).send({ message: 'Пользователь успешно присоединился к компании в роли гостя' });
    })
    .catch(next);
}

// Изменение роли пользователя
function updateUserRole(req, res, next) {
  const { companyId } = req.params;
  const { userId, newRole } = req.body;

  if (!newRole) {
    return next(new BadRequestErr('Необходимо указать новую роль'));
  }

  return Company.findById(companyId)
    .orFail(() => new NotFoundErr('Компания не найдена'))
    .then(async (existingCompany) => {
      // Создаем копию компании для безопасной работы
      const companyData = existingCompany.toObject();
      // Находим участника по userId
      const memberIndex = companyData.members.findIndex(
        (member) => member.user_id.toString() === userId,
      );

      if (memberIndex === -1) {
        return next(new BadRequestErr('Пользователь не является участником компании'));
      }

      // Обновляем роль пользователя
      companyData.members[memberIndex].role = newRole;
      // Сохраняем обновленные данные в базу
      await Company.findByIdAndUpdate(
        companyId,
        { members: companyData.members },
        { new: true },
      );

      return res.status(200).send({ message: 'Роль пользователя успешно обновлена' });
    })
    .catch(next);
}

// Удаление пользователя из компании
function removeUserFromCompany(req, res, next) {
  const { companyId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return next(new BadRequestErr('Необходимо указать ID пользователя'));
  }

  return Company.findById(companyId)
    .orFail(() => new NotFoundErr('Компания не найдена'))
    .then(async (existingCompany) => {
      // Создаем копию объекта company, чтобы избежать мутации
      const updatedCompany = {
        ...existingCompany.toObject(), // Преобразуем Mongoose документ в обычный объект
        members: existingCompany.members.filter(
          (member) => member.user_id.toString() !== userId,
        ),
      };

      // Сохраняем изменения
      await Company.findByIdAndUpdate(companyId, updatedCompany, { new: true });
      return res.status(200).send({ message: 'Пользователь успешно удален из компании' });
    })
    .catch(next);
}

module.exports = {
  checkInn,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  joinCompanyAsGuest,
  updateUserRole,
  removeUserFromCompany,
};
