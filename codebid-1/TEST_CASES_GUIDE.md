# Test Cases Guide

## Quick Start

Test cases are used to validate user submissions. Each test case consists of:
- **input**: What the program receives (stdin)
- **output**: What the program should produce (stdout)

## Format

```javascript
{
  input: "input_data",
  output: "expected_output"
}
```

## Examples by Language

### JavaScript - Sum Two Numbers
```javascript
const testCases = [
  { input: "5\n3", output: "8" },
  { input: "10\n20", output: "30" },
  { input: "-5\n5", output: "0" }
];

// Expected code:
// const readline = require('readline');
// const rl = readline.createInterface({ input: process.stdin });
// let lines = [];
// rl.on('line', (line) => {
//   lines.push(line);
//   if (lines.length === 2) {
//     console.log(parseInt(lines[0]) + parseInt(lines[1]));
//     rl.close();
//   }
// });
```

### Python - String Reversal
```javascript
const testCases = [
  { input: "hello", output: "olleh" },
  { input: "world", output: "dlrow" },
  { input: "a", output: "a" }
];

// Expected code:
// s = input()
// print(s[::-1])
```

### Python - Factorial
```javascript
const testCases = [
  { input: "5", output: "120" },
  { input: "0", output: "1" },
  { input: "10", output: "3628800" }
];

// Expected code:
// n = int(input())
// result = 1
// for i in range(1, n + 1):
//     result *= i
// print(result)
```

### Java - Palindrome Check
```javascript
const testCases = [
  { input: "racecar", output: "true" },
  { input: "hello", output: "false" },
  { input: "a", output: "true" }
];

// Expected code:
// import java.util.Scanner;
// public class Solution {
//   public static void main(String[] args) {
//     Scanner sc = new Scanner(System.in);
//     String s = sc.nextLine();
//     String rev = new StringBuilder(s).reverse().toString();
//     System.out.println(s.equals(rev));
//   }
// }
```

### C++ - Array Sum
```javascript
const testCases = [
  { input: "3\n1 2 3", output: "6" },
  { input: "5\n10 20 30 40 50", output: "150" },
  { input: "1\n42", output: "42" }
];

// Expected code:
// #include <iostream>
// using namespace std;
// int main() {
//   int n;
//   cin >> n;
//   int sum = 0;
//   for (int i = 0; i < n; i++) {
//     int x;
//     cin >> x;
//     sum += x;
//   }
//   cout << sum << endl;
//   return 0;
// }
```

## Important Notes

### Input/Output Matching
- Output is **trimmed** (leading/trailing whitespace removed)
- Comparison is **exact** - "8" ≠ "8 " (with space)
- Newlines at the end are handled automatically

### Multi-line Input
Use `\n` to separate lines:
```javascript
{ input: "5\n3\n2", output: "10" }
```

### Multi-line Output
Use `\n` to separate output lines:
```javascript
{ input: "3", output: "1\n2\n3" }
```

### Special Characters
Escape special characters properly:
```javascript
{ input: "hello\\nworld", output: "hello\nworld" }
```

## Common Patterns

### Reading Multiple Integers
```python
# Input: "5 3 2"
a, b, c = map(int, input().split())
print(a + b + c)
```

Test case:
```javascript
{ input: "5 3 2", output: "10" }
```

### Reading Array
```python
# Input: "3\n1 2 3"
n = int(input())
arr = list(map(int, input().split()))
print(sum(arr))
```

Test case:
```javascript
{ input: "3\n1 2 3", output: "6" }
```

### Reading Until EOF
```python
# Input: "1\n2\n3"
import sys
total = 0
for line in sys.stdin:
    total += int(line.strip())
print(total)
```

Test case:
```javascript
{ input: "1\n2\n3", output: "6" }
```

## Testing Your Test Cases

1. Write the expected solution code
2. Test it locally with the test case inputs
3. Verify the outputs match exactly
4. Add to the problem definition

## Debugging Failed Tests

When a test fails, check:
1. **Input format** - Does the code expect the right input format?
2. **Output format** - Is there extra whitespace or newlines?
3. **Edge cases** - Test with 0, negative numbers, empty strings
4. **Data types** - Integer vs float, string vs number

## Best Practices

✅ **DO:**
- Include edge cases (0, negative, empty)
- Test boundary conditions
- Verify output format exactly
- Use clear, simple test cases first

❌ **DON'T:**
- Include file I/O operations
- Expect network access
- Use very large inputs (>1MB)
- Assume specific system behavior
