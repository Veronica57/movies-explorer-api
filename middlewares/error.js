const INTERNAL_SERVER_ERROR_CODE = require('../utils/codes');

module.exports = (err, req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Credentials', true);
    const { statusCode = INTERNAL_SERVER_ERROR_CODE, message } = err;

    res.status(statusCode).send({
        message:
            statusCode === INTERNAL_SERVER_ERROR_CODE ? 'Internal Server Error' : message,
    });
    next();
};
