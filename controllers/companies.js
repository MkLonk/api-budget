// /controllers/companies.js

const Company = require('../models/company');
const NotFoundErr = require('../errors/notFound');
const BadRequestErr = require('../errors/badRequest');
const ForbiddenErr = require('../errors/forbidden');
const { errMes } = require('../utils/constants');
// const { log } = require('winston');

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
    .populate({
      path: 'owner', // Подгружаем данные о владельце
      select: 'email', // Выбираем только поле email
    })
    .orFail(() => new NotFoundErr('Компании с указанным ИНН не найдены'))
    // .orFail(() => res.status(200).send('Компании с указанным ИНН не найдены'))
    // .then((companies) => res.status(200).send(companies))
    .then((companies) => {
      // Форматируем результат, оставляя только нужные поля
      const formattedCompanies = companies.map((company) => ({
        _id: company._id,
        name: company.name,
        ownerEmail: company.owner.email, // Email владельца
      }));

      res.status(200).send(formattedCompanies); // Отправляем отформатированный список компаний
    })
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
  // Предполагается, что ID пользователя передается через middleware аутентификации
  const { userId } = req.user;
  const { companyId } = req.params;

  Company.findById(companyId)
    .orFail(() => new NotFoundErr('Компания не найдена'))
    .then((company) => {
      // Проверяем, является ли текущий пользователь владельцем компании
      if (company.owner.toString() !== userId) {
        // Используем Promise.reject для передачи ошибки в .catch
        return Promise.reject(new ForbiddenErr(errMes.notEnoughRights));
      }

      // Если пользователь является владельцем, выполняем удаление
      return Company.findByIdAndDelete(companyId);
    })
    .then(() => {
      res.status(200).send({ message: 'Компания успешно удалена' });
    })
    // Передаем ошибку в middleware обработки ошибок
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
      // Проверяем, есть ли пользователь с указанным ID среди участников
      const userExists = existingCompany.members.some(
        (member) => member.user_id.toString() === userId,
      );

      // Если пользователя нет, возвращаем ошибку
      if (!userExists) {
        return next(new BadRequestErr('Пользователь не является участником компании'));
      }

      // Создаем копию объекта company, чтобы избежать мутации
      const updatedCompany = {
        ...existingCompany.toObject(), // Преобразуем Mongoose документ в обычный объект
        members: existingCompany.members.filter(
          (member) => member.user_id.toString() !== userId,
        ),
      };

      // Сохраняем изменения
      await Company.findByIdAndUpdate(companyId, updatedCompany, { new: true });

      // Возвращаем успешный ответ
      return res.status(200).send({ message: 'Пользователь успешно удален из компании' });
    })
    .catch(next);
}

// Возвращает все компании, в которых состоит пользователь, и его роль в каждой компании
function getCompaniesByUser(req, res, next) {
  const userId = req.user._id; // ID текущего пользователя

  Company.find({ 'members.user_id': userId }) // Ищем компании, где пользователь есть в массиве members
    .populate('owner members.user_id') // Подгружаем данные о владельце и участниках
    .then((companies) => {
      // Фильтруем и форматируем результаты, добавляя роль пользователя
      const userCompanies = companies
        .map((company) => {
          // Находим роль пользователя в текущей компании

          const userRoleMember = company
            .members.find((member) => member.user_id._id.toString() === userId);

          if (!userRoleMember) {
            return null; // Пропускаем компанию, если пользователь не найден
          }

          return {
            _id: company._id,
            name: company.name,
            inn: company.inn,
            role: userRoleMember.role, // Роль пользователя в компании
          };
        })
        .filter(Boolean); // Удаляем null из результата

      res.status(200).send(userCompanies); // Отправляем отформатированный список компаний
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestErr('Некорректный формат ID пользователя'));
      }
      return next(err);
    });
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
  getCompaniesByUser,
};
