import { prisma } from "../src";

async function main() {
  // make admin
  await prisma.user.updateMany({
    where: { email: "aydinhalil980@gmail.com" },
    data: { roles: { push: "ADMIN" } },
  });
}

try {
  await main();
  console.log("Seed script completed successfully.");
} catch (error) {
  console.error(error);
} finally {
  await prisma.$disconnect();
}
