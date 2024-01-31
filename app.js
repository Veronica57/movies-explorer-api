require('dotenv').config(); 

const express = require('express'); 
const mongoose = require('mongoose'); 
const cookieParser = require('cookie-parser'); 
const { errors } = require('celebrate'); 
const helmet = require('helmet'); 
const errorHandler = require('./middlewares/errorHandler'); 
const limiter = require('./middlewares/limiter'); 
const { requestLogger, errorLogger } = require('./middlewares/logger'); 
const cors = require('./middlewares/cors'); 
const router = require('./routes/index'); 
const {
  PORT = 3000, MONGO_URL_DEV,
} = require('./utils/config');

const app = express(); 
mongoose.connect(MONGO_URL_DEV)
    .then(() => console.log('connected to Database'))
    .catch((error) => console.log(error));

app.use(requestLogger);

app.use(limiter); 
app.use(helmet()); 
app.use(cors);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use(router); 

app.use(errorLogger); 
app.use(errors()); 
app.use(errorHandler);

app.listen(PORT, () => { console.log(`App listen to PORT: ${PORT}`) }); 