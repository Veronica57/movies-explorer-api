require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const limiter = require('./middlewares/limiter');
const router = require('./routes/index');
const error = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { MONGO_URL_DEV } = require('./utils/config');

const app = express();
const { PORT = 3000 } = process.env;
const { NODE_ENV, MONGO_URL } = process.env;

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : MONGO_URL_DEV)
    .then(() => console.log('connected to Database'))
    .catch((error) => console.log(error));
app.use(cors);
app.use(express.json());

app.use(requestLogger); // логгер запросов #1
app.use(helmet()); // Защита приложения Express

app.use(limiter); // Обработчик ограничений запросов
app.use(router); // Обработчики роутов #2
app.use(errorLogger); // логгер ошибок #3
app.use(errors()); // обработчик ошибок celebrate #4
app.use(error); // server error централизованный обработчик ошибок #5

app.listen(PORT, () => { console.log(`App listen to PORT: ${PORT}`) });