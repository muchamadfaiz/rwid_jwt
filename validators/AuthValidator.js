const joi = require("joi");
const validator = require("express-joi-validation");
const { Provider } = require("@prisma/client");

class AuthValidator {
    static login() {
        return validator.createValidator({ statusCode: 422 }).body(
            joi.object({
                name: joi.string().min(1).max(255),
                password: joi.string().min(4).max(255),
                provider: joi.string().valid(...Object.keys(Provider)),
            })
        );
    }
}

module.exports = { AuthValidator };
