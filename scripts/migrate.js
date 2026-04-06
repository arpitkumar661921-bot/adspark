import { execSync } from "child_process";

try {
  console.log("Pushing Prisma schema to database...");
  execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
  console.log("Database schema pushed successfully!");
} catch (error) {
  console.error("Failed to push schema:", error.message);
  process.exit(1);
}
