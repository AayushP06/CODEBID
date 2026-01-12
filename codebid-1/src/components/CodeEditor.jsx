import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ problem, onSubmit, loading }) => {
  const [code, setCode] = useState(`// Solve: ${problem?.title || 'Problem'}\n// Write your solution here\n\nfunction solution() {\n  // Your code here\n}\n`);
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleRunCode = async () => {
    try {
      setIsRunning(true);
      setOutput('Running code...');
      setTestResults(null);
      
      // Send code to backend for execution
      const response = await fetch('/api/code/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          code,
          language,
          problemId: problem?.id,
          testCases: problem?.testCases || []
        })
      });

      const result = await response.json();
      
      if (result.error) {
        setOutput(`❌ Error: ${result.error}`);
      } else {
        setOutput(result.output || 'Code executed successfully');
      }
      
      setTestResults(result.testResults);
    } catch (error) {
      setOutput(`❌ Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      code,
      language,
      problemId: problem?.id
    });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', height: '100vh', padding: '2rem' }}>
      {/* Left: Problem Statement */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'auto' }}>
        <div className="glass-panel" style={{ padding: '2rem', flex: 1 }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>
            {problem?.title}
          </h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <span style={{
              background: problem?.difficulty === 'easy' ? 'rgba(0, 255, 157, 0.2)' : 
                         problem?.difficulty === 'medium' ? 'rgba(255, 165, 0, 0.2)' : 
                         'rgba(255, 77, 77, 0.2)',
              color: problem?.difficulty === 'easy' ? 'var(--color-success)' : 
                    problem?.difficulty === 'medium' ? '#ffa500' : 
                    'var(--color-primary)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}>
              {problem?.difficulty}
            </span>
          </div>

          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
            {problem?.description}
          </p>

          {problem?.testCases && problem.testCases.length > 0 && (
            <div>
              <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Test Cases:</h4>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {problem.testCases.map((testCase, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                    fontFamily: 'monospace'
                  }}>
                    <div style={{ color: 'var(--color-success)', marginBottom: '0.5rem' }}>
                      Input: {JSON.stringify(testCase.input)}
                    </div>
                    <div style={{ color: 'var(--color-primary)' }}>
                      Output: {JSON.stringify(testCase.output)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Code Editor */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Language Selector */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ color: 'var(--color-text-muted)' }}>Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--color-border)',
              color: 'white',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer'
            }}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="csharp">C#</option>
          </select>
        </div>

        {/* Editor */}
        <div style={{ 
          flex: 1, 
          border: '1px solid var(--color-border)', 
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden'
        }}>
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true
            }}
          />
        </div>

        {/* Output */}
        <div className="glass-panel" style={{ padding: '1rem', maxHeight: '200px', overflow: 'auto' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
            Output:
          </div>
          <pre style={{
            color: 'var(--color-success)',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}>
            {output || 'Run code to see output...'}
          </pre>

          {testResults && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ color: 'var(--color-primary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Test Results: {testResults.passed}/{testResults.total} passed
              </div>
              {testResults.details?.map((result, idx) => (
                <div key={idx} style={{
                  color: result.passed ? 'var(--color-success)' : 'var(--color-primary)',
                  fontSize: '0.8rem',
                  marginBottom: '0.25rem'
                }}>
                  Test {idx + 1}: {result.passed ? '✅ PASSED' : '❌ FAILED'}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={handleRunCode}
            disabled={isRunning || loading}
            style={{
              flex: 1,
              padding: '1rem',
              background: 'rgba(0, 255, 157, 0.1)',
              border: '1px solid var(--color-success)',
              color: 'var(--color-success)',
              borderRadius: 'var(--radius-sm)',
              cursor: isRunning || loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              opacity: isRunning || loading ? 0.6 : 1
            }}
          >
            {isRunning ? '⏳ Running...' : '▶ Run Code'}
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading || isRunning}
            className="hero-btn"
            style={{ flex: 1, padding: '1rem', opacity: loading || isRunning ? 0.6 : 1 }}
          >
            {loading ? '⏳ Submitting...' : '✓ Submit Solution'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
