const { prisma } = require("../../models");
const { AuthService } = require("../../services/AuthService");

const create = async () => {
    try {
        const roleAdmin = await prisma.role.create({
            data: {
                name: "admin",
            },
        });

        await prisma.user.create({
            data: {
                name: "Faiz",
                role_users: {
                    create: {
                        role: {
                            connect: { id: roleAdmin.id },
                        },
                    },
                },

                auths: {
                    create: {
                        provider: "local",
                        password: await AuthService.hashPassword("asafafaa"),
                    },
                },
            },
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    } finally {
        prisma.$disconnect();
    }
};

create();
