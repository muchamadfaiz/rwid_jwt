const { prisma } = require("../../models");

const create = async () => {
    try {
        await prisma.role.create({
            data: {
                name: "admin",
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
