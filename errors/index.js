const { NotFoundError } = require("./NotFoundError");
const { ValidationError } = require("joi/lib/errors");

exports.notFoundErrorHandler = (req, res, next) => {
    return next(new NotFoundError("Route not found"));
};
exports.errorHandler = (err, req, res, next) => {
    if (err?.error instanceof ValidationError) {
        return res.status(422).json({
            message: err?.error.message,
            details: err?.error.details,
        });
    }
    return res.status(err?.status || err?.statusCode || 500).json({
        message: err.message,
    });
};
