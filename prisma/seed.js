require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({
    adapter
});

async function main() {
    const adminRole = await prisma.role.upsert({
        where: { roleid: 1 },
        update: {},
        create: {
            roleid: 1,
            rolename: 'ADMIN'
        }
    });

    const customerRole = await prisma.role.upsert({
        where: { roleid: 2 },
        update: {},
        create: {
            roleid: 2,
            rolename: 'CUSTOMER'
        }
    });

    const basicMembership = await prisma.membership.upsert({
        where: { mid: 1 },
        update: {},
        create: {
            mid: 1,
            mname: 'BASIC',
            score: 0
        }
    });

    console.log('Seed completed');
    console.log(adminRole);
    console.log(customerRole);
    console.log(basicMembership);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });