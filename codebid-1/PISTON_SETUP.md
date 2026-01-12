# Piston API Integration Guide

## Overview
This project now uses the **Piston API** for live code execution and testing. Piston is a free, open-source code execution engine that supports multiple programming languages.

## What is Piston API?
- **Free to use** - No API key required
- **Multiple languages** - JavaScript, Python, Java, C++, C#, Go, Rust, PHP, and more
- **Sandboxed execution** - Safe code execution environment
- **Public endpoint** - `https://api.piston.rocks/execute`

## Supported Languages
The following languages are currently supported:

| Language   | Code    | File Extension |
|-----------|---------|-----------------|
| JavaScript | `javascript` | `.js` |
| Python    | `python` | `.py` |
| Java      | `java` | `.java` |
| C++       | `cpp` | `.cpp` |
| C#        | `csharp` | `.cs` |
| Go        | `go` | `.go` |
| Rust      | `rust` | `.rs` |
| PHP       | `php` | `.php` |

## How It Works

### Frontend Flow
1. User writes code in the Monaco Editor
2. User clicks "Run Code" or "Submit Solution"
3. Code is sent to backend API endpoint (`/api/code/run` or `/api/code/submit`)
4. Backend executes code via Piston API
5. Results are returned and displayed in the output panel

### Backend Flow
1. Request arrives at `/api/code/run` or `/api/code/submit`
2. `CodeExecutor` service processes the request
3. Code is sent to Piston API with test cases as stdin
4. Piston executes the code and returns output
5. Output is compared against expected test case outputs
6. Results are formatted and returned to frontend

## Test Case Format

Test cases should be structured as follows:

```javascript
{
  input: "5\n3",      // Input to pass to the program (stdin)
  output: "8"         // Expected output (stdout)
}
```

### Example: Sum Two Numbers
```javascript
const testCases = [
  { input: "5\n3", output: "8" },
  { input: "10\n20", output: "30" },
  { input: "0\n0", output: "0" }
];
```

### Example: Python Problem
```javascript
const testCases = [
  { input: "hello", output: "HELLO" },
  { input: "world", output: "WORLD" }
];
```

## Code Examples

### JavaScript
```javascript
// Read input
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let lines = [];
rl.on('line', (line) => {
  lines.push(line);
  if (lines.length === 2) {
    const a = parseInt(lines[0]);
    const b = parseInt(lines[1]);
    console.log(a + b);
    rl.close();
  }
});
```

### Python
```python
a = int(input())
b = int(input())
print(a + b)
```

### Java
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

### C++
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

## API Response Format

### Success Response
```json
{
  "success": true,
  "output": "Test Results: 3/3 passed\n\nTest 1: ✅ PASSED\nTest 2: ✅ PASSED\nTest 3: ✅ PASSED",
  "testResults": {
    "passed": 3,
    "total": 3,
    "details": [
      {
        "testNumber": 1,
        "passed": true,
        "input": "5\n3",
        "expectedOutput": "8",
        "actualOutput": "8"
      }
    ]
  }
}
```

### Error Response
```json
{
  "error": "Compilation error: Unexpected token"
}
```

## Timeout Settings

The Piston API has the following timeout limits:
- **Compilation timeout**: 10 seconds
- **Execution timeout**: 5 seconds
- **Memory limit**: Unlimited (default)

These can be adjusted in `codeExecutor.js` if needed.

## Limitations

1. **No file I/O** - Code cannot read/write files
2. **No network access** - Code cannot make HTTP requests
3. **Memory constraints** - Limited memory available
4. **Execution time** - 5-second timeout per test case
5. **Output size** - Large outputs may be truncated

## Troubleshooting

### "Unsupported language" Error
- Check that the language code matches the `LANGUAGE_MAP` in `codeExecutor.js`
- Ensure the language is in the supported list above

### "Compilation error"
- Check the code syntax for the selected language
- Verify the code follows the language's requirements

### "Runtime error"
- Check for null pointer exceptions, array out of bounds, etc.
- Verify input format matches what the code expects

### "Wrong Answer"
- Compare expected output with actual output in test results
- Check for whitespace differences (trailing spaces, newlines)
- Verify the algorithm logic

### Timeout Error
- Code is taking too long to execute
- Optimize the algorithm for better performance
- Check for infinite loops

## Future Enhancements

1. Add support for more languages
2. Implement code caching for faster execution
3. Add memory and CPU usage tracking
4. Support for custom test case creation
5. Code submission history and analytics
6. Plagiarism detection

## References

- [Piston API Documentation](https://github.com/engineer-man/piston)
- [Piston API GitHub](https://github.com/engineer-man/piston)
- [Supported Languages](https://github.com/engineer-man/piston/blob/master/README.md)
