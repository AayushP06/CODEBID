// Code execution service using Piston API
const PISTON_API = "https://api.piston.rocks/execute";

// Language mapping for Piston API
const LANGUAGE_MAP = {
  javascript: { language: "javascript", version: "*" },
  python: { language: "python", version: "*" },
  java: { language: "java", version: "*" },
  cpp: { language: "cpp", version: "*" },
  csharp: { language: "csharp", version: "*" },
  go: { language: "go", version: "*" },
  rust: { language: "rust", version: "*" },
  php: { language: "php", version: "*" }
};

export class CodeExecutor {
  static async executePiston(code, language, stdin = "") {
    try {
      const langConfig = LANGUAGE_MAP[language];
      if (!langConfig) {
        throw new Error(`Unsupported language: ${language}`);
      }

      const response = await fetch(PISTON_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          language: langConfig.language,
          version: langConfig.version,
          files: [
            {
              name: `solution.${this.getFileExtension(language)}`,
              content: code
            }
          ],
          stdin: stdin,
          compile_timeout: 10000,
          run_timeout: 5000,
          compile_memory_limit: -1,
          run_memory_limit: -1
        })
      });

      if (!response.ok) {
        throw new Error(`Piston API error: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Piston execution error:", error);
      throw error;
    }
  }

  static getFileExtension(language) {
    const extensions = {
      javascript: "js",
      python: "py",
      java: "java",
      cpp: "cpp",
      csharp: "cs",
      go: "go",
      rust: "rs",
      php: "php"
    };
    return extensions[language] || language;
  }

  static async runCode(code, language, testCases) {
    try {
      const results = {
        output: '',
        testResults: {
          passed: 0,
          total: testCases.length,
          details: []
        },
        error: null
      };

      if (testCases.length === 0) {
        // Run code without test cases
        const execution = await this.executePiston(code, language);
        
        if (execution.compile && execution.compile.code !== 0) {
          results.error = execution.compile.stderr || "Compilation error";
          return results;
        }

        if (execution.run && execution.run.code !== 0) {
          results.error = execution.run.stderr || "Runtime error";
          return results;
        }

        results.output = execution.run?.stdout || "No output";
        return results;
      }

      // Run code against each test case
      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        
        try {
          const execution = await this.executePiston(code, language, testCase.input);

          if (execution.compile && execution.compile.code !== 0) {
            results.testResults.details.push({
              testNumber: i + 1,
              passed: false,
              input: testCase.input,
              expectedOutput: testCase.output,
              actualOutput: execution.compile.stderr || "Compilation error"
            });
            continue;
          }

          if (execution.run && execution.run.code !== 0) {
            results.testResults.details.push({
              testNumber: i + 1,
              passed: false,
              input: testCase.input,
              expectedOutput: testCase.output,
              actualOutput: execution.run.stderr || "Runtime error"
            });
            continue;
          }

          const actualOutput = (execution.run?.stdout || "").trim();
          const expectedOutput = (testCase.output || "").trim();
          const passed = actualOutput === expectedOutput;

          results.testResults.details.push({
            testNumber: i + 1,
            passed,
            input: testCase.input,
            expectedOutput,
            actualOutput
          });

          if (passed) {
            results.testResults.passed++;
          }
        } catch (error) {
          results.testResults.details.push({
            testNumber: i + 1,
            passed: false,
            input: testCase.input,
            expectedOutput: testCase.output,
            actualOutput: `Error: ${error.message}`
          });
        }
      }

      results.output = `Test Results: ${results.testResults.passed}/${results.testResults.total} passed\n\n`;
      results.testResults.details.forEach((detail, idx) => {
        results.output += `Test ${idx + 1}: ${detail.passed ? '✅ PASSED' : '❌ FAILED'}\n`;
        if (!detail.passed) {
          results.output += `  Input: ${detail.input}\n`;
          results.output += `  Expected: ${detail.expectedOutput}\n`;
          results.output += `  Got: ${detail.actualOutput}\n`;
        }
      });

      return results;
    } catch (error) {
      return {
        output: '',
        testResults: null,
        error: error.message
      };
    }
  }

  static async submitCode(code, language, problemId, teamId, testCases) {
    try {
      // Run all tests
      const execution = await this.runCode(code, language, testCases);

      if (execution.error) {
        return {
          success: false,
          message: execution.error,
          score: 0
        };
      }

      // Calculate score based on test results
      const passPercentage = execution.testResults.total > 0 
        ? (execution.testResults.passed / execution.testResults.total) * 100 
        : 0;
      const score = Math.round(passPercentage);

      return {
        success: true,
        message: `Solution submitted! ${execution.testResults.passed}/${execution.testResults.total} tests passed`,
        score,
        testResults: execution.testResults,
        output: execution.output
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        score: 0
      };
    }
  }
}
