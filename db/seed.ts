// Seed the ZELIO database with the demo company.
// Run: npm run db:seed
import bcrypt from "bcryptjs";
import { db } from "../lib/db";

const AGENTS = [
  { name: "Strategy", color: "#FFB020", status: "working" as const, currentTask: "Refining Q4 go-to-market plan", progress: 62 },
  { name: "Research", color: "#25E6DA", status: "working" as const, currentTask: "Analyzing competitors", progress: 45 },
  { name: "Product", color: "#B642FF", status: "working" as const, currentTask: "Speccing onboarding flow", progress: 30 },
  { name: "Development", color: "#258BFF", status: "working" as const, currentTask: "Building landing page", progress: 78 },
  { name: "Marketing", color: "#FF3E9D", status: "waiting" as const, currentTask: "Launch campaign", progress: 0 },
  { name: "Sales", color: "#FF7657", status: "working" as const, currentTask: "Drafting outreach sequences", progress: 12 },
];

const TASKS = [
  "Review Marketing's launch campaign",
  "Approve pricing page copy",
  "Share the founder story draft",
  "Schedule the investor update",
];

const ACTIVITY = [
  { agentName: "Research", color: "#25E6DA", text: "shared 3 competitor insights with Strategy" },
  { agentName: "Development", color: "#258BFF", text: "pushed 4 files to the landing page" },
  { agentName: "Strategy", color: "#FFB020", text: "updated the Q4 go-to-market plan" },
  { agentName: "Product", color: "#B642FF", text: "finished the onboarding spec draft" },
  { agentName: "Sales", color: "#FF7657", text: "queued 18 prospects for outreach" },
];

async function main() {
  db.init();

  // Demo user: alex@zelio.ai / zelio123
  if (!db.getUserByEmail("alex@zelio.ai")) {
    const passwordHash = await bcrypt.hash("zelio123", 10);
    db.createUser("Alex", "alex@zelio.ai", passwordHash);
  }

  for (const a of AGENTS) {
    db.upsertAgent(a);
  }

  if (db.countTasks() === 0) {
    for (const title of TASKS) {
      db.createTask(title);
    }
  }

  if (db.countActivity() === 0) {
    for (const e of ACTIVITY) {
      db.addActivity(e.text, e.agentName, e.color);
    }
  }

  console.log("Seed complete: demo user alex@zelio.ai / zelio123");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
