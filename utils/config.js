const MONGO_URL_DEV = 'mongodb://127.0.0.1:27017/bitfilmsdb';
const JWT_SECRET_DEV = 'secret - key';

module.exports = {
    MONGO_URL_DEV,
    JWT_SECRET_DEV,
};

// const { JWT_SECRET, NODE_ENV, MONGO_URL } = process.env;
// module.exports = { JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : 'JWT_SECRET', MONGO_URL: NODE_ENV === 'production' ? MONGO_URL : 'mongodb://127.0.0.1:27017/bitfilmsdb' };
