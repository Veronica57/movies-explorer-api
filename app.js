require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { allowedURLs } = require('./utils/codes');
const limiter = require('./middlewares/limiter');

const { MONGO_URL_DEV } = require('./utils/constants');

const { PORT = 3001, NODE_ENV, MONGO_URL } = process.env;
// const { NODE_ENV, MONGO_URL } = process.env;
mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : MONGO_URL_DEV);
// mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');
const app = express();
app.use(requestLogger); // логгер запросов #1

app.use(limiter);// Обработчик ограничений запросов
app.use(helmet()); // Защита приложения Express
app.use(cookieParser);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: allowedURLs, credentials: true }));
// app.use(express.json());

app.use(router); // Обработчики роутов #2
app.use(errorLogger); // логгер ошибок #3
app.use(errors()); // обработчик ошибок celebrate #4
app.use(errorHandler); // server error централизованный обработчик ошибок #5

app.listen(PORT, ()=>{});
