const INTERNAL_SERVER_ERROR_CODE = require("../utils/codes");

module.exports = (err, req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Credentials", true);
    if (err.statusCode) {
        res.status(err.statusCode).send({ message: err.message });
    } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({
            message: "Internal Server Error",
        });
    }
    next();
};
