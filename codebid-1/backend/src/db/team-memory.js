// In-memory team storage (fallback when PostgreSQL is not available)
const teams = new Map();
let nextId = 1;

// Initialize with admin
teams.set("admin", {
  id: nextId++,
  name: "admin",
  coins: 10000,
  is_admin: true,
  created_at: new Date(),
  updated_at: new Date()
});

export class TeamMemory {
  static async findByName(name) {
    return teams.get(name);
  }

  static async findByRegistrationNumber(regNo) {
    for (const team of teams.values()) {
      if (team.registration_number === regNo) return team;
    }
    return null;
  }

  static async create(teamData) {
    const { 
      name, 
      fullName, 
      registrationNumber, 
      branch, 
      email, 
      phone, 
      yearOfStudy, 
      isAdmin = false 
    } = teamData;

    const id = nextId++;
    const team = {
      id,
      name,
      full_name: fullName,
      registration_number: registrationNumber,
      branch,
      email,
      phone,
      year_of_study: yearOfStudy,
      coins: 1000,
      is_admin: isAdmin,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    teams.set(name, team);
    return team;
  }

  static async findById(id) {
    for (const team of teams.values()) {
      if (team.id === id) return team;
    }
    return null;
  }

  static async updateCoins(id, coins) {
    for (const team of teams.values()) {
      if (team.id === id) {
        team.coins = coins;
        team.updated_at = new Date();
        return team;
      }
    }
    return null;
  }

  static async getLeaderboard() {
    return Array.from(teams.values())
      .filter(t => !t.is_admin)
      .sort((a, b) => b.coins - a.coins)
      .slice(0, 10);
  }

  static async getAllWithDetails() {
    return Array.from(teams.values());
  }

  static getAllTeams() {
    return Array.from(teams.values());
  }
}
