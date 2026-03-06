const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const mapping = {
    "Al Malaz Branch": "فرع الملز",
    "King Fahd Branch": "فرع الملك فهد",
    "Al Murabba Branch": "فرع المربع",
    "Al Mursalat Branch": "فرع المرسلات",
    "Al Nuzhah Branch": "فرع النزهة",
    "Al Nakheel Branch": "فرع النخيل",
    "Al Yarmouk Branch": "فرع اليرموك"
};

async function updateRemainingBranches() {
    try {
        console.log("Checking PendingParcels again...");
        const parcels = await prisma.pendingParcel.findMany({ select: { id: true, branch: true } });
        for (const p of parcels) {
            let newBranch = p.branch;
            for (const [eng, ar] of Object.entries(mapping)) {
                if (newBranch && newBranch.toLowerCase().includes(eng.toLowerCase())) {
                    newBranch = ar;
                }
            }
            if (newBranch !== p.branch) {
                await prisma.pendingParcel.update({
                    where: { id: p.id },
                    data: { branch: newBranch }
                });
                console.log(`Updated PendingParcel ${p.id} from "${p.branch}" to "${newBranch}"`);
            }
        }

        console.log("Checking Appointments again...");
        const appointments = await prisma.appointment.findMany({ select: { id: true, branch: true } });
        for (const a of appointments) {
            if (!a.branch) continue;
            let newBranch = a.branch;
            for (const [eng, ar] of Object.entries(mapping)) {
                if (newBranch && newBranch.toLowerCase().includes(eng.toLowerCase())) {
                    newBranch = ar;
                }
            }
            if (newBranch !== a.branch) {
                await prisma.appointment.update({
                    where: { id: a.id },
                    data: { branch: newBranch }
                });
                console.log(`Updated Appointment ${a.id} from "${a.branch}" to "${newBranch}"`);
            }
        }
        console.log("Done updating remaining branches.");
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

updateRemainingBranches();
