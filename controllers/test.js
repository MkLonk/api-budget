function getCompaniesByUser(req, res, next) {
  const userId = req.user._id; // ID текущего пользователя

  Company.find({ 'members.user_id': userId }) // Ищем компании, где пользователь есть в массиве members
    .populate('owner members.user_id') // Подгружаем данные о владельце и участниках
    .then(companies => {
      // Фильтруем и форматируем результаты, добавляя роль пользователя
      const userCompanies = companies
        .map(company => {
          // Находим роль пользователя в текущей компании
          const userRoleMember = company.members.find(member => member.user_id.toString() === userId);

          if (!userRoleMember) {
            return null; // Пропускаем компанию, если пользователь не найден
          }

          return {
            _id: company._id,
            name: company.name,
            inn: company.inn,
            role: userRoleMember.role, // Извлекаем только поле role
          };
        })
        .filter(Boolean); // Удаляем null из результата

      res.status(200).send(userCompanies); // Отправляем отформатированный список компаний
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return next(new BadRequestErr('Некорректный формат ID пользователя'));
      }
      return next(err);
    });
}
