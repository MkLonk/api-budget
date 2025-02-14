const { Joi } = require('celebrate');
const validator = require('validator');

const metodIsURL = (value) => {
  if (validator.isURL(value)) {
    return value;
  }
  throw new Error('URL validation err');
};

const metodIsEmail = (value) => {
  if (validator.isEmail(value)) {
    return value;
  }
  throw new Error('email validation err');
};

// сет валидации запросов CreateUser и Login
const validSetCreateUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(30),
    name: Joi.string().min(2).max(30),
  }),
};

// сет валидации запросов PatchUser
const validSetPatchUser = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().min(2).custom(metodIsEmail),
  }),
};

// сет валидации запросов CreateMovies
const validSetCreateMovies = {
  body: Joi.object().keys({
    country: Joi.string().required().max(255),
    director: Joi.string().required().min(2).max(255),
    duration: Joi.number().required(),
    year: Joi.string().required().min(2).max(12),
    description: Joi.string().required().min(2).max(2048),
    image: Joi.string().required().custom(metodIsURL),
    trailer: Joi.string().required().custom(metodIsURL),
    thumbnail: Joi.string().required().custom(metodIsURL),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().min(2).max(255),
    nameEN: Joi.string().required().min(2).max(255),
  }),
};

// сет валидации запросов DelMovies
const validSetDelMovies = {
  params: Joi.object().keys({ id: Joi.string().length(24).hex() }),
};

module.exports = {
  validSetCreateUser,
  validSetPatchUser,
  validSetCreateMovies,
  validSetDelMovies,
};
