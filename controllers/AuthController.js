const { AuthRepository } = require("../repositories/AuthRepository");
const { AuthService } = require("../services/AuthService");
class AuthController {
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    static async login(req, res, next) {
        try {
            const credential = {
                name: req.body.name,
                password: req.body.password,
                provider: req.body.provider,
            };
            const user = await AuthRepository.login(credential);

            const isMatched = await AuthService.validateCredential(
                credential,
                user
            );

            if (!isMatched) {
                return res.status(401).json({ message: "password not match" });
            }

            const accessToken = AuthService.createToken(user);

            return res.json({ message: "success", accessToken });
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = { AuthController };
