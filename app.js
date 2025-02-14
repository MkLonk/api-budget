// Импрорты
// const helmet = require('helmet');
const express = require('express');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const cors = require('cors');

const { APP_PORT, DB_URL } = require('./utils/config');
const myErrors = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// const { corsOptions } = require('./middlewares/corsOptions'); // включить когда будет готов фронт
// const limiter = require('./middlewares/rateLimit');
const routes = require('./routes');

// создаем app на экспрессе
const app = express();

// подключаемся к серверу mongo раньше было mongoose.connect(DB_URL, DB_CONFIG);
mongoose.connect(DB_URL);
mongoose.set('returnOriginal', false); // Это эквивалентно useFindAndModify: false

// парсер для собирания JSON-формата
app.use(express.json());

// логгер запросов
app.use(requestLogger);

// CORS настройка | для всех - app.use(cors()) | для выбранных - app.use(cors(corsOptions));
app.use(cors()); // временное значение, изменить когда будет фронтенд

// защитные мидлвары
// app.use(helmet());
// app.use(limiter);

// роуты
app.use(routes);

// логгер ошибок
app.use(errorLogger);

// обработка ошибок celebrate
app.use(errors());

// обработка ошибок централизованным обработчиком
app.use(myErrors);

// слушаем порт
app.listen(APP_PORT, () => {
  console.log(`App listening on port ${APP_PORT}`);
});
