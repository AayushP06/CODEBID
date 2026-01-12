// In-memory problem storage

let problems = [
    {
        id: 1,
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.",
        difficulty: "easy",
        test_cases: JSON.stringify([
            { input: "[2,7,11,15], 9", expected: "[0,1]" },
            { input: "[3,2,4], 6", expected: "[1,2]" }
        ]),
        base_points: 100,
        solution: "",
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
        solution: "",
        created_at: new Date()
    },
    {
        id: 3,
        title: "Binary Tree Maximum Path Sum",
        description: "A path in a binary tree is a sequence of nodes. Given the root of a binary tree, return the maximum path sum of any non-empty path.",
        difficulty: "hard",
        test_cases: JSON.stringify([
            { input: "[1,2,3]", expected: "6" }
        ]),
        base_points: 300,
        solution: "",
        created_at: new Date()
    }
];

let nextProblemId = 4;

export class ProblemMemory {
    static async getAll() {
        return problems;
    }

    static async findById(id) {
        return problems.find(p => p.id === id);
    }

    static async create(title, description, difficulty, testCases, solution) {
        const problem = {
            id: nextProblemId++,
            title,
            description,
            difficulty: difficulty || 'medium',
            test_cases: typeof testCases === 'string' ? testCases : JSON.stringify(testCases || []),
            solution: solution || '',
            base_points: difficulty === 'easy' ? 100 : difficulty === 'hard' ? 300 : 200,
            created_at: new Date()
        };
        problems.push(problem);
        return problem;
    }

    static async getRandomByDifficulty(difficulty = 'medium') {
        const filtered = problems.filter(p => p.difficulty === difficulty);
        if (filtered.length === 0) {
            // Fall back to any problem
            return problems[0] || null;
        }
        return filtered[Math.floor(Math.random() * filtered.length)];
    }

    static async delete(id) {
        problems = problems.filter(p => p.id !== id);
    }
}
