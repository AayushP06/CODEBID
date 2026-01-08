// In-memory store as fallback when database is not available
const teams = new Map();
const problems = new Map();
const events = new Map();
const bids = new Map();

// Initialize with sample data
let teamIdCounter = 1;
let problemIdCounter = 1;
let eventIdCounter = 1;
let bidIdCounter = 1;

// Add admin team
teams.set("admin", {
  id: teamIdCounter++,
  name: "admin",
  coins: 10000,
  is_admin: true,
  created_at: new Date(),
  updated_at: new Date()
});

// Add sample problems
problems.set(1, {
  id: problemIdCounter++,
  title: "Two Sum",
  description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
  difficulty: "easy",
  test_cases: [],
  created_at: new Date()
});

problems.set(2, {
  id: problemIdCounter++,
  title: "Reverse String",
  description: "Write a function that reverses a string.",
  difficulty: "easy",
  test_cases: [],
  created_at: new Date()
});

problems.set(3, {
  id: problemIdCounter++,
  title: "Valid Parentheses",
  description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
  difficulty: "medium",
  test_cases: [],
  created_at: new Date()
});

// Add initial event
events.set(1, {
  id: eventIdCounter++,
  state: "WAITING",
  current_problem_id: null,
  highest_bid: 0,
  highest_bidder_id: null,
  highest_bidder_name: null,
  auction_start_time: null,
  coding_start_time: null,
  coding_end_time: null,
  created_at: new Date(),
  updated_at: new Date()
});

export const memoryStore = {
  teams,
  problems,
  events,
  bids,
  teamIdCounter: () => teamIdCounter++,
  problemIdCounter: () => problemIdCounter++,
  eventIdCounter: () => eventIdCounter++,
  bidIdCounter: () => bidIdCounter++
};
