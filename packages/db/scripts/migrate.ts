import { SQL } from "bun";

const source = new SQL("postgresql://postgres:twyvg1sf7syeymyt@51.75.76.107:5440/postgres");
const target = new SQL("postgresql://postgres:0e4ncibzguhymeud@51.75.76.107:54602/postgres");
async function main() {
  const items = await source`SELECT * FROM users`;

  console.log(items); // {title: "..."}

  const mappedItems = items.map((item: any) => ({}));

  console.log(mappedItems);

  /* const created = await target`INSERT INTO "Post" ${target(mappedItems)} RETURNING *`;

  console.log(`Created ${created.count} items in Prisma.`); */
}

main()
  .then(() => {
    console.log("Migration completed.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
