const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/unauthorized");
const { JWT_SECRET_DEV } = require("../utils/constants");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer")) {
        throw new UnauthorizedError("Authorization is required");
    }

    const token = authorization.replace("Bearer ", "");
    let payload;

    try {
        payload = jwt.verify(
            token,
            NODE_ENV === "production" ? JWT_SECRET : JWT_SECRET_DEV
        );
    } catch (err) {
        return next(new UnauthorizedError("Authorization is required"));
    }

    req.user = payload;

    return next();
};
