import pg from "pg";

const { Client } = pg;

async function testPostgresConnection() {
  console.log("🔍 Testing PostgreSQL connection...\n");

  // Common default configurations to try
  const configs = [
    { user: "postgres", password: "", host: "localhost", port: 5432 },
    { user: "postgres", password: "postgres", host: "localhost", port: 5432 },
    { user: "postgres", password: "admin", host: "localhost", port: 5432 },
    { user: "postgres", password: "password", host: "localhost", port: 5432 },
  ];

  for (let i = 0; i < configs.length; i++) {
    const config = configs[i];
    console.log(`Trying config ${i + 1}: user=${config.user}, password=${config.password || '(empty)'}`);
    
    try {
      const client = new Client(config);
      await client.connect();
      
      const result = await client.query("SELECT version()");
      console.log("✅ Connection successful!");
      console.log("📋 PostgreSQL version:", result.rows[0].version);
      
      // Try to create database
      try {
        await client.query("CREATE DATABASE codebid");
        console.log("✅ Database 'codebid' created successfully!");
      } catch (dbError) {
        if (dbError.code === '42P04') {
          console.log("ℹ️  Database 'codebid' already exists");
        } else {
          console.log("⚠️  Could not create database:", dbError.message);
        }
      }
      
      await client.end();
      
      // Save working config to .env
      const envContent = `PORT=4000
FRONTEND_ORIGIN=http://localhost:5173
JWT_SECRET=your-secret-key-change-in-production

# Database Configuration
DB_HOST=${config.host}
DB_PORT=${config.port}
DB_NAME=codebid
DB_USER=${config.user}
DB_PASSWORD=${config.password}
`;
      
      const fs = await import("fs");
      fs.writeFileSync(".env", envContent);
      console.log("✅ Updated .env file with working configuration");
      
      return config;
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}\n`);
    }
  }
  
  console.log("❌ Could not connect with any default configuration.");
  console.log("\n💡 Manual setup required:");
  console.log("1. Make sure PostgreSQL is running");
  console.log("2. Check your PostgreSQL installation password");
  console.log("3. You might need to start PostgreSQL as administrator");
  
  return null;
}

testPostgresConnection().catch(console.error);