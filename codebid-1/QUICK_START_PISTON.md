# Quick Start - Piston API Integration

## 30-Second Overview

Your code editor now executes real code using **Piston API**. No setup needed - it just works!

## Try It Now

### Step 1: Create a Test Problem
Go to Admin Dashboard → Manage Problems → Add New Problem

**Example:**
- **Title:** Sum Two Numbers
- **Difficulty:** Easy
- **Description:** Read two integers and print their sum
- **Test Cases:**
```javascript
[
  { input: "5\n3", output: "8" },
  { input: "10\n20", output: "30" }
]
```

### Step 2: Start Auction & Purchase
1. Click "START EVENT (AUCTION)"
2. Bid on the problem
3. Win the auction

### Step 3: Open Code Editor
1. Go to Coding Phase
2. Click "OPEN EDITOR" on your problem

### Step 4: Write & Test
**Python Solution:**
```python
a = int(input())
b = int(input())
print(a + b)
```

1. Paste the code
2. Click "▶ Run Code"
3. See results: ✅ 2/2 tests passed

### Step 5: Submit
Click "✓ Submit Solution" to finalize

## Supported Languages

```
javascript  →  JavaScript
python      →  Python
java        →  Java
cpp         →  C++
csharp      →  C#
go          →  Go
rust        →  Rust
php         →  PHP
```

## Test Case Format

```javascript
{
  input: "what the program receives",
  output: "what it should output"
}
```

**Multi-line example:**
```javascript
{
  input: "3\n1 2 3",      // Line 1: 3, Line 2: 1 2 3
  output: "6"              // Output: 6
}
```

## Common Solutions

### JavaScript - Sum
```javascript
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
let lines = [];
rl.on('line', (line) => {
  lines.push(line);
  if (lines.length === 2) {
    console.log(parseInt(lines[0]) + parseInt(lines[1]));
    rl.close();
  }
});
```

### Python - Sum
```python
a = int(input())
b = int(input())
print(a + b)
```

### Java - Sum
```java
import java.util.Scanner;
public class Solution {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int a = sc.nextInt();
    int b = sc.nextInt();
    System.out.println(a + b);
  }
}
```

### C++ - Sum
```cpp
#include <iostream>
using namespace std;
int main() {
  int a, b;
  cin >> a >> b;
  cout << a + b << endl;
  return 0;
}
```

## What Happens When You Run Code

1. **Code sent to Piston API** ✈️
2. **Code compiled** 🔨
3. **Each test case executed** ⚙️
4. **Output compared** 🔍
5. **Results shown** 📊

## Error Messages

| Error | Meaning |
|-------|---------|
| Compilation error | Syntax error in code |
| Runtime error | Code crashed during execution |
| Wrong Answer | Output doesn't match expected |
| Timeout | Code took too long (>5 seconds) |

## Tips

✅ **DO:**
- Test with simple problems first
- Check input/output format carefully
- Include edge cases in test cases
- Use clear variable names

❌ **DON'T:**
- Try file I/O (not supported)
- Make network requests (not supported)
- Use very large inputs (>1MB)
- Expect specific system behavior

## Example Problems

See `EXAMPLE_PROBLEMS.md` for 8 ready-to-use problems:
1. Sum Two Numbers (Easy)
2. String Reversal (Easy)
3. Factorial (Medium)
4. Palindrome Check (Medium)
5. Array Sum (Medium)
6. FizzBuzz (Medium)
7. Fibonacci (Hard)
8. Prime Check (Hard)

## Troubleshooting

**"Unsupported language"**
- Check language dropdown - use exact names

**"Compilation error"**
- Check code syntax
- Verify language-specific requirements

**"Wrong Answer"**
- Check expected output in test cases
- Look for whitespace differences
- Verify algorithm logic

**"Timeout"**
- Optimize algorithm
- Check for infinite loops

## Full Documentation

- `PISTON_SETUP.md` - Technical details
- `TEST_CASES_GUIDE.md` - How to write test cases
- `EXAMPLE_PROBLEMS.md` - Ready-to-use problems
- `PISTON_INTEGRATION_SUMMARY.md` - Complete overview

## That's It! 🎉

You're ready to use the live code editor with real code execution. Start creating problems and testing solutions!

---

**Questions?** Check the documentation files or test with EXAMPLE_PROBLEMS.md
