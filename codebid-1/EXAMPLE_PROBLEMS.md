# Example Problems for Testing

Use these problems to test the Piston API integration with the live code editor.

## Problem 1: Sum Two Numbers (Easy)

**Title:** Sum Two Numbers  
**Difficulty:** Easy  
**Description:** Read two integers and print their sum.

**Test Cases:**
```javascript
[
  { input: "5\n3", output: "8" },
  { input: "10\n20", output: "30" },
  { input: "-5\n5", output: "0" },
  { input: "0\n0", output: "0" }
]
```

**Solution (JavaScript):**
```javascript
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

**Solution (Python):**
```python
a = int(input())
b = int(input())
print(a + b)
```

---

## Problem 2: String Reversal (Easy)

**Title:** Reverse a String  
**Difficulty:** Easy  
**Description:** Read a string and print it in reverse order.

**Test Cases:**
```javascript
[
  { input: "hello", output: "olleh" },
  { input: "world", output: "dlrow" },
  { input: "a", output: "a" },
  { input: "12345", output: "54321" }
]
```

**Solution (Python):**
```python
s = input()
print(s[::-1])
```

**Solution (JavaScript):**
```javascript
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (line) => {
  console.log(line.split('').reverse().join(''));
  rl.close();
});
```

---

## Problem 3: Factorial (Medium)

**Title:** Calculate Factorial  
**Difficulty:** Medium  
**Description:** Read an integer n and print its factorial (n!).

**Test Cases:**
```javascript
[
  { input: "5", output: "120" },
  { input: "0", output: "1" },
  { input: "1", output: "1" },
  { input: "10", output: "3628800" }
]
```

**Solution (Python):**
```python
n = int(input())
result = 1
for i in range(1, n + 1):
    result *= i
print(result)
```

**Solution (JavaScript):**
```javascript
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (line) => {
  const n = parseInt(line);
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i;
  }
  console.log(result);
  rl.close();
});
```

---

## Problem 4: Palindrome Check (Medium)

**Title:** Check if Palindrome  
**Difficulty:** Medium  
**Description:** Read a string and check if it's a palindrome. Print "true" or "false".

**Test Cases:**
```javascript
[
  { input: "racecar", output: "true" },
  { input: "hello", output: "false" },
  { input: "a", output: "true" },
  { input: "madam", output: "true" }
]
```

**Solution (Python):**
```python
s = input()
print(s == s[::-1])
```

**Solution (Java):**
```java
import java.util.Scanner;

public class Solution {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    String s = sc.nextLine();
    String rev = new StringBuilder(s).reverse().toString();
    System.out.println(s.equals(rev));
  }
}
```

---

## Problem 5: Array Sum (Medium)

**Title:** Sum Array Elements  
**Difficulty:** Medium  
**Description:** Read n integers and print their sum.

**Test Cases:**
```javascript
[
  { input: "3\n1 2 3", output: "6" },
  { input: "5\n10 20 30 40 50", output: "150" },
  { input: "1\n42", output: "42" },
  { input: "4\n-1 -2 -3 -4", output: "-10" }
]
```

**Solution (Python):**
```python
n = int(input())
arr = list(map(int, input().split()))
print(sum(arr))
```

**Solution (C++):**
```cpp
#include <iostream>
using namespace std;

int main() {
  int n;
  cin >> n;
  int sum = 0;
  for (int i = 0; i < n; i++) {
    int x;
    cin >> x;
    sum += x;
  }
  cout << sum << endl;
  return 0;
}
```

---

## Problem 6: FizzBuzz (Medium)

**Title:** FizzBuzz  
**Difficulty:** Medium  
**Description:** Print numbers 1 to n, but for multiples of 3 print "Fizz", for multiples of 5 print "Buzz", and for multiples of both print "FizzBuzz".

**Test Cases:**
```javascript
[
  { input: "15", output: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz" },
  { input: "5", output: "1\n2\nFizz\n4\nBuzz" }
]
```

**Solution (Python):**
```python
n = int(input())
for i in range(1, n + 1):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)
```

---

## Problem 7: Fibonacci (Hard)

**Title:** Fibonacci Sequence  
**Difficulty:** Hard  
**Description:** Print the first n Fibonacci numbers.

**Test Cases:**
```javascript
[
  { input: "5", output: "0\n1\n1\n2\n3" },
  { input: "8", output: "0\n1\n1\n2\n3\n5\n8\n13" },
  { input: "1", output: "0" }
]
```

**Solution (Python):**
```python
n = int(input())
a, b = 0, 1
for i in range(n):
    print(a)
    a, b = b, a + b
```

**Solution (JavaScript):**
```javascript
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (line) => {
  const n = parseInt(line);
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) {
    console.log(a);
    [a, b] = [b, a + b];
  }
  rl.close();
});
```

---

## Problem 8: Prime Number Check (Hard)

**Title:** Check if Prime  
**Difficulty:** Hard  
**Description:** Read a number and check if it's prime. Print "true" or "false".

**Test Cases:**
```javascript
[
  { input: "2", output: "true" },
  { input: "17", output: "true" },
  { input: "1", output: "false" },
  { input: "20", output: "false" },
  { input: "97", output: "true" }
]
```

**Solution (Python):**
```python
n = int(input())
if n < 2:
    print(False)
else:
    is_prime = True
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            is_prime = False
            break
    print(is_prime)
```

---

## How to Add These Problems

1. Go to Admin Dashboard
2. Click "📝 MANAGE PROBLEMS"
3. Click "Add New Problem"
4. Fill in the details:
   - **Title**: Problem title
   - **Description**: Problem description
   - **Difficulty**: easy/medium/hard
   - **Test Cases**: Copy the test cases array
   - **Solution**: (Optional) Store the solution for reference

5. Click "Create Problem"

## Testing the Integration

1. Create a problem with test cases
2. Start an auction and purchase the problem
3. Go to Coding Phase
4. Open the problem
5. Try different solutions:
   - **Correct solution**: Should pass all tests
   - **Incorrect solution**: Should fail some tests
   - **Syntax error**: Should show compilation error
   - **Timeout**: Should show timeout error

## Tips for Creating Problems

- Start with easy problems to test the system
- Use clear, simple test cases
- Include edge cases (0, negative, empty)
- Test your test cases locally first
- Provide multiple language solutions
- Document the expected input/output format
