import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.appointment.deleteMany({}); // clear existing
    const appointments = [];
    const branches = [
        "Al Olaya Branch",
        "Al Malaz Branch",
        "King Abdullah Road Branch",
        "Al Sulaymaniyah Branch",
        "Digital City Branch"
    ];
    const statuses = ["pending", "completed", "cancelled"];

    // Generate 150 pickup appointments (receiving a parcel from a specific branch)
    for (let i = 0; i < 150; i++) {
        const randomDays = Math.floor(Math.random() * 30); // within 30 days
        const date = new Date();
        date.setDate(date.getDate() + randomDays);
        const branch = branches[Math.floor(Math.random() * branches.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        appointments.push({
            type: "pickup",
            phone: "+9665" + Math.floor(10000000 + Math.random() * 90000000).toString(),
            branch: branch,
            status: status,
            date: date,
        });
    }

    // Generate 100 dropoff appointments (sending a parcel, "any suitable SPL branch")
    for (let i = 0; i < 100; i++) {
        const randomDays = Math.floor(Math.random() * 30); // within 30 days
        const date = new Date();
        date.setDate(date.getDate() + randomDays);
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        appointments.push({
            type: "dropoff",
            phone: "+9665" + Math.floor(10000000 + Math.random() * 90000000).toString(),
            branch: null, // Any suitable branch
            status: status,
            date: date,
        });
    }

    await prisma.appointment.createMany({
        data: appointments,
    });

    console.log("Database seeded successfully with 250 fake appointments in Postgres!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
