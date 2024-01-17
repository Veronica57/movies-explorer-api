require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');
const { MONGO_URL } = require('./utils/config');

const { PORT = 3000 } = process.env;
mongoose.connect(MONGO_URL)
    .then(() => console.log('connected to database bitfilmsdb'))
    .catch((error) => console.log(error));  
const app = express();

app.use(cors);
app.use(express.json());

app.use(requestLogger); // логгер запросов #1
app.use(helmet()); // Защита приложения Express

app.use(limiter);// Обработчик ограничений запросов
app.use(cookieParser);

app.use(router); // Обработчики роутов #2
app.use(errorLogger); // логгер ошибок #3
app.use(errors()); // обработчик ошибок celebrate #4
app.use(errorHandler); // server error централизованный обработчик ошибок #5

app.listen(PORT, () => { console.log(`Listen Port: ${PORT}`)});
