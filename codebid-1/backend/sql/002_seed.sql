-- Insert admin team
INSERT INTO teams (name, coins, is_admin) 
VALUES ('admin', 10000, true)
ON CONFLICT (name) DO NOTHING;

-- Insert sample problems
INSERT INTO problems (title, description, difficulty, test_cases, solution) VALUES 
(
    'Two Sum',
    'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    'easy',
    '[
        {"input": {"nums": [2,7,11,15], "target": 9}, "output": [0,1]},
        {"input": {"nums": [3,2,4], "target": 6}, "output": [1,2]},
        {"input": {"nums": [3,3], "target": 6}, "output": [0,1]}
    ]'::jsonb,
    'function twoSum(nums, target) {
        const map = new Map();
        for (let i = 0; i < nums.length; i++) {
            const complement = target - nums[i];
            if (map.has(complement)) {
                return [map.get(complement), i];
            }
            map.set(nums[i], i);
        }
        return [];
    }'
),
(
    'Reverse String',
    'Write a function that reverses a string. The input string is given as an array of characters s.',
    'easy',
    '[
        {"input": {"s": ["h","e","l","l","o"]}, "output": ["o","l","l","e","h"]},
        {"input": {"s": ["H","a","n","n","a","h"]}, "output": ["h","a","n","n","a","H"]}
    ]'::jsonb,
    'function reverseString(s) {
        let left = 0;
        let right = s.length - 1;
        while (left < right) {
            [s[left], s[right]] = [s[right], s[left]];
            left++;
            right--;
        }
        return s;
    }'
),
(
    'Valid Parentheses',
    'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid.',
    'medium',
    '[
        {"input": {"s": "()"}, "output": true},
        {"input": {"s": "()[]{}"}, "output": true},
        {"input": {"s": "(]"}, "output": false},
        {"input": {"s": "([)]"}, "output": false}
    ]'::jsonb,
    'function isValid(s) {
        const stack = [];
        const map = { ")": "(", "}": "{", "]": "[" };
        for (let char of s) {
            if (char in map) {
                if (stack.pop() !== map[char]) return false;
            } else {
                stack.push(char);
            }
        }
        return stack.length === 0;
    }'
)
ON CONFLICT DO NOTHING;

-- Insert initial event
INSERT INTO events (state, current_problem_id) 
VALUES ('WAITING', NULL)
ON CONFLICT DO NOTHING;