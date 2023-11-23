const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class AuthService {
    /**
     *
     * @param {import('../repositories/AuthRepository.js').Credential} credential
     * @param {import('../repositories/AuthRepository.js').User} user
     */
    static validateCredential(credential, user) {
        const auth = user.auths.find((auth) => {
            return auth.provider === credential.provider;
        });

        return bcrypt.compare(credential.password, auth.password);
    }

    /**
     *
     * @param {import('../repositories/AuthRepository.js').User} user
     */
    static createToken(user) {
        return jwt.sign({ sub: user.name }, process.env.JWT_SECRET);
    }

    /**
     *
     * @param {string} value
     */
    static hashPassword(value) {
        return bcrypt.hash(value, 10);
    }
}

module.exports = { AuthService };
