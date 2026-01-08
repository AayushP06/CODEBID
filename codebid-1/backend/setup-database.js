import readline from "readline";
import fs from "fs";
import { execSync } from "child_process";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupDatabase() {
  console.log("🚀 CodeBid Database Setup\n");
  
  console.log("Choose your database setup option:");
  console.log("1. Use Docker (Recommended - will start PostgreSQL in container)");
  console.log("2. Use existing PostgreSQL installation");
  console.log("3. Skip database setup (use in-memory storage)");
  
  const choice = await question("\nEnter your choice (1-3): ");
  
  switch (choice) {
    case "1":
      await setupDocker();
      break;
    case "2":
      await setupExistingPostgres();
      break;
    case "3":
      await setupInMemory();
      break;
    default:
      console.log("Invalid choice. Exiting...");
      process.exit(1);
  }
  
  rl.close();
}

async function setupDocker() {
  try {
    console.log("\n🐳 Setting up Docker PostgreSQL...");
    
    // Check if Docker is running
    try {
      execSync("docker --version", { stdio: "ignore" });
    } catch (error) {
      console.log("❌ Docker not found. Please install Docker Desktop first.");
      process.exit(1);
    }
    
    // Start Docker Compose
    console.log("Starting PostgreSQL container...");
    execSync("docker-compose up -d", { stdio: "inherit" });
    
    // Wait a moment for container to start
    console.log("Waiting for database to be ready...");
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Run migrations
    console.log("Running database migrations...");
    execSync("npm run db:migrate", { stdio: "inherit" });
    
    console.log("✅ Database setup complete!");
    console.log("🔗 PostgreSQL running on localhost:5432");
    
  } catch (error) {
    console.error("❌ Docker setup failed:", error.message);
    console.log("Try option 2 for existing PostgreSQL installation.");
  }
}

async function setupExistingPostgres() {
  console.log("\n🗄️  Setting up with existing PostgreSQL...");
  
  const host = await question("Database host (localhost): ") || "localhost";
  const port = await question("Database port (5432): ") || "5432";
  const user = await question("Database user (postgres): ") || "postgres";
  const password = await question("Database password: ");
  const database = await question("Database name (codebid): ") || "codebid";
  
  // Update .env file
  const envContent = `PORT=4000
FRONTEND_ORIGIN=http://localhost:5173
JWT_SECRET=your-secret-key-change-in-production

# Database Configuration
DB_HOST=${host}
DB_PORT=${port}
DB_NAME=${database}
DB_USER=${user}
DB_PASSWORD=${password}
`;
  
  fs.writeFileSync(".env", envContent);
  console.log("✅ Updated .env file");
  
  try {
    // Test connection and run migrations
    console.log("Testing connection and running migrations...");
    execSync("npm run db:migrate", { stdio: "inherit" });
    console.log("✅ Database setup complete!");
  } catch (error) {
    console.error("❌ Database setup failed:", error.message);
    console.log("Please check your database credentials and try again.");
  }
}

async function setupInMemory() {
  console.log("\n💾 Setting up in-memory storage...");
  console.log("⚠️  Note: Data will be lost when server restarts");
  
  // Create a flag file to indicate in-memory mode
  fs.writeFileSync(".use-memory", "true");
  console.log("✅ In-memory storage configured");
  console.log("You can switch to database later by running this setup again.");
}

setupDatabase().catch(console.error);