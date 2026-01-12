// In-memory event storage (fallback when PostgreSQL is not available)

let currentEvent = {
    id: 1,
    state: 'WAITING', // WAITING, AUCTION, COMPLETED, CODING, FINISHED
    current_problem_id: null,
    highest_bid: 0,
    highest_bidder_id: null,
    highest_bidder_name: null,
    auction_start_time: null,
    auction_timer: 60, // seconds for auction
    coding_start_time: null,
    created_at: new Date(),
    updated_at: new Date()
};

// Store problems in memory
let problems = [
    {
        id: 1,
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        difficulty: "easy",
        test_cases: JSON.stringify([
            { input: "[2,7,11,15], 9", expected: "[0,1]" },
            { input: "[3,2,4], 6", expected: "[1,2]" }
        ]),
        base_points: 100,
        created_at: new Date()
    },
    {
        id: 2,
        title: "Reverse Linked List",
        description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
        difficulty: "medium",
        test_cases: JSON.stringify([
            { input: "[1,2,3,4,5]", expected: "[5,4,3,2,1]" }
        ]),
        base_points: 200,
        created_at: new Date()
    },
    {
        id: 3,
        title: "Binary Tree Maximum Path Sum",
        description: "Find the maximum path sum in a binary tree. The path may start and end at any node.",
        difficulty: "hard",
        test_cases: JSON.stringify([
            { input: "[1,2,3]", expected: "6" }
        ]),
        base_points: 300,
        created_at: new Date()
    }
];

export class EventMemory {
    static async getCurrentEvent() {
        const problem = problems.find(p => p.id === currentEvent.current_problem_id);
        return {
            ...currentEvent,
            endsIn: currentEvent.auction_timer,
            problem_title: problem?.title,
            problem_description: problem?.description,
            problem_difficulty: problem?.difficulty,
            problem_test_cases: problem?.test_cases,
            currentProblem: problem ? {
                id: problem.id,
                title: problem.title,
                description: problem.description,
                difficulty: problem.difficulty,
                basePoints: problem.base_points
            } : null
        };
    }

    static async updateState(state, problemId = null) {
        currentEvent.state = state;
        currentEvent.current_problem_id = problemId;
        currentEvent.updated_at = new Date();

        // Reset bid info when changing state
        if (state === 'WAITING') {
            currentEvent.highest_bid = 0;
            currentEvent.highest_bidder_id = null;
            currentEvent.highest_bidder_name = null;
        }

        return currentEvent;
    }

    static async updateHighestBid(eventId, teamId, amount) {
        currentEvent.highest_bid = amount;
        currentEvent.highest_bidder_id = teamId;
        currentEvent.updated_at = new Date();
        return currentEvent;
    }

    static async setHighestBidderName(name) {
        currentEvent.highest_bidder_name = name;
    }

    static async startAuction(problemId, timer = 60) {
        currentEvent.state = 'AUCTION';
        currentEvent.current_problem_id = problemId;
        currentEvent.auction_start_time = new Date();
        currentEvent.auction_timer = timer;
        currentEvent.highest_bid = 0;
        currentEvent.highest_bidder_id = null;
        currentEvent.highest_bidder_name = null;
        currentEvent.updated_at = new Date();
        return currentEvent;
    }

    static async startCoding() {
        currentEvent.state = 'CODING';
        currentEvent.coding_start_time = new Date();
        currentEvent.updated_at = new Date();
        return currentEvent;
    }

    static async endEvent() {
        currentEvent.state = 'FINISHED';
        currentEvent.updated_at = new Date();
        return currentEvent;
    }

    static getProblems() {
        return problems;
    }

    static getProblemById(id) {
        return problems.find(p => p.id === id);
    }
}
