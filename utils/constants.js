const errMes = {
  resourceNotFound: 'Ой. Запрашиваемый ресурс не найден.',
  notUser: 'Нет пользователя с таким id',
  notLogin: 'Неправильная почта или пароль.',
  notAuth: 'Необходима авторизация!',
  conflictUser: 'Конфликт в БД! Данный email уже используется.',
  conflictMovie: 'Конфликт в БД! Данный фильм уже добавлен в Избранные.',
  incorrectData: 'Переданы некорректные данные.',
  //
  notEnoughRights: 'У Вас не достаточно прав для этого действия.',
  //
  notCompanyInn: 'Ошибка! Нет ИНН, или он введен не правильно',
  notCompanyId: 'Нет компинии с таким id', //+++
  notClients: 'Нет клиентов', //+++
  notClientId: 'Нет клиента с таким id', //+++
  valuesNotChanged: 'Ошибка! Переданные значения полей остались прежними (были не были изменены).',
  notDevelopers: 'Проектных бюро нет в базе, создайте их', //+++
  notDeveloperId: 'Нет подрядчика с таким id', //+++
  notContracts: 'Договоров нет в базе, создайте их', //+++
  notContractId: 'Нет договора с таким id', //+++
  // notDevelopers: 'В Базе нет созданых проектировщиков, создайте их', //+
  // notDeveloperId: 'Нет проектировщика с таким id', //+++
  notPayments: 'В Базе нет платежей по договорам, создайте их', //+++
  notPaymentId: 'Нет платежа с таким id', //+++
  notProjectSections: 'В Базе нет разделов проекта, создайте их',
  notProjectSectionId: 'Нет разделов проекта с таким id',
  notFoundProjectWorks: 'Проектные работы не найдены в базе', //
  notProjectWorksId: 'Нет проектной работы с таким id', //
  notFoundSalaries: 'Заработные платы не найдены', //
  notFoundId: 'запись я таким ID не найдена',
  //
};

const message = {
  delClient: 'Клиент удачно удален.', // +++
  delDeveloper: 'Подрядчик удачно удален.', // +++
  delContract: 'Договор удачно удален.', // +++
  // delDeveloper: 'Разработчик удачно удален.', // +++
  delPayment: 'Платеж удачно удален.', // +++
  delProjectSections: 'Раздел проекта удален', // +++
  delProjectWork: 'проектные работы уделены', // ++++
  delSalary: 'Заработная плата удалена', // +++
  // notCompanyInn: 'Нет компинии с таким ИНН',
};

module.exports = { errMes, message };
