import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.pendingParcel.deleteMany({}); // clear existing
    const parcels = [];
    const branches = [
        "Al Olaya Branch",
        "Al Malaz Branch",
        "King Abdullah Road Branch",
        "Al Sulaymaniyah Branch",
        "Digital City Branch"
    ];

    for (let i = 0; i < 100; i++) {
        const branch = branches[Math.floor(Math.random() * branches.length)];

        parcels.push({
            trackingNumber: `SPL-${Math.floor(100000000 + Math.random() * 900000000)}`,
            status: "ready_for_pickup",
            branch: branch,
            phone: "+9665" + Math.floor(10000000 + Math.random() * 90000000).toString(),
        });
    }

    await prisma.pendingParcel.createMany({
        data: parcels,
    });

    console.log("Database seeded successfully with 100 fake pending parcels in Postgres!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
