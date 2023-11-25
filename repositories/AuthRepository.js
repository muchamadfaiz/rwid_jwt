const { NotFoundError } = require("../errors/NotFoundError");
const { prisma } = require("../models");

/**
 * @typedef {{name:string; password:string;provider:string;}} Credential
 * @typedef {import('@prisma/client').User & {auths:import('@prisma/client').Auth[]}} User
 */
class AuthRepository {
    /**
     *
     * @param {Credential} credential
     */
    static async login(credential) {
        const user = await prisma.user.findFirst({
            where: { name: credential.name },
            include: { auths: true },
        });

        if (!user) {
            throw new NotFoundError("User not found!");
        }

        return user;
    }
}

module.exports = { AuthRepository };
