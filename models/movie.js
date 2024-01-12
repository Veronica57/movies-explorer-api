const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Поле "страна" должно быть заполнено'],
  },
  director: {
    type: String,
    required: [true, 'Поле "режиссер" должно быть заполнено'],
  },
  duration: {
    type: Number,
    required: [true, 'Поле "продолжительность фильма" должно быть заполнено'],
  },
  year: {
    type: String,
    required: [true, 'Поле "год фильма" должно быть заполнено'],
  },
  description: {
    type: String,
    required: [true, 'Поле "описание фильма" должно быть заполнено'],
  },
  image: {
    type: String,
    required: [true, 'Поле "постер фильма" должно быть заполнено'],
    validate: {
      validator: (v) => isURL(v),
      message: 'Некорректный URL',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Поле "трейлер фильма" должно быть заполнено'],
    validate: {
      validator: (v) => isURL(v),
      message: 'Некорректный URL',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Поле "миниатюрное изображение фильма" должно быть заполнено'],
    validate: {
      validator: (v) => isURL(v),
      message: 'Некорректный URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'user',
    required: [true, 'Поле "id пользователя" должно быть заполнено'],
  },
  movieId: {
    type: Number,
    required: [true, 'Поле "id фильма" должно быть заполнено'],
  },
  nameRU: {
    type: String,
    required: [true, 'Поле "название фильма на русском" должно быть заполнено'],
  },
  nameEN: {
    type: String,
    required: [true, 'Поле "название фильма на английском" должно быть заполнено'],
  },
});

module.exports = mongoose.model('movie', movieSchema);
