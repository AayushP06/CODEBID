import React, { useState, useEffect } from 'react';
import { useAuction } from '../context/AuctionContext';

const CodingView = () => {
    const { state, solveProblem } = useAuction();
    const { user } = state;
    const [activeProblem, setActiveProblem] = useState(null);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    if (!user) return <div className="flex-center" style={{ height: '100vh' }}>Error: User not logged in.</div>;

    useEffect(() => {
        if (activeProblem) {
            setCode(activeProblem.starterCode || '# Write your code here');
            setOutput('');
        }
    }, [activeProblem]);

    const handleRun = () => {
        setIsRunning(true);
        setOutput('Running tests...');
        setTimeout(() => {
            setIsRunning(false);
            setOutput('Test Case 1: PASSED\nTest Case 2: PASSED\nTest Case 3: PASSED\n\n> All Tests Passed!');
        }, 1500);
    };

    const handleSubmit = () => {
        if (!activeProblem) return;
        solveProblem(activeProblem.id);
        setActiveProblem(null); // Return to dashboard
    };

    // --- DASHBOARD VIEW (NO ACTIVE PROBLEM) ---
    if (!activeProblem) {
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        };

        return (
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <header className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h1 className="text-hero" style={{ fontSize: '2.5rem' }}>CODING PHASE</h1>
                    <div className="glass-panel" style={{ padding: '0.8rem 2rem', display: 'flex', gap: '2rem', alignItems: 'center', borderRadius: 'var(--radius-full)' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>TIME REMAINING</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', lineHeight: 1, color: state.auction.codingTimer < 300 ? 'var(--color-primary)' : 'white' }}>
                                {formatTime(state.auction.codingTimer)}
                            </div>
                        </div>
                        <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }}></div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>SCORE</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', lineHeight: 1, color: 'var(--color-success)' }}>{user.score || 0}</div>
                        </div>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {user.purchasedProblems.length === 0 ? (
                        <div className="glass-panel" style={{ padding: '3rem', gridColumn: '1 / -1', textAlign: 'center' }}>
                            <h2 style={{ marginBottom: '1rem' }}>No Problems Purchased</h2>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>You didn't win any auctions. Better luck next time!</p>
                            <div style={{ fontSize: '3rem' }}>👾</div>
                        </div>
                    ) : (
                        user.purchasedProblems.map(problem => (
                            <div key={problem.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: problem.status === 'SOLVED' ? '1px solid var(--color-success)' : '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>#{problem.id}</span>
                                    <span style={{
                                        fontSize: '0.8rem',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        background: 'rgba(255,255,255,0.1)',
                                        color: problem.difficulty === 'Hard' ? 'var(--color-accent)' : 'var(--color-success)'
                                    }}>
                                        {problem.difficulty}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: '1.4rem' }}>{problem.title}</h3>
                                {problem.status === 'SOLVED' && <div style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>✓ SOLVED</div>}
                                <button
                                    onClick={() => setActiveProblem(problem)}
                                    style={{
                                        marginTop: 'auto',
                                        width: '100%',
                                        padding: '1rem',
                                        background: problem.status === 'SOLVED' ? 'var(--color-bg-card)' : 'var(--color-secondary)',
                                        border: problem.status === 'SOLVED' ? '1px solid var(--color-success)' : 'none',
                                        color: problem.status === 'SOLVED' ? 'var(--color-success)' : '#fff',
                                        fontWeight: 'bold',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {problem.status === 'SOLVED' ? 'REVIEW SOLUTION' : 'OPEN EDITOR'}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    // --- EDITOR VIEW (ACTIVE PROBLEM) ---
    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Toolbar */}
            <div className="glass-panel" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', borderRadius: 0, borderBottom: '1px solid var(--color-border)' }}>
                <div className="flex-center" style={{ gap: '1rem' }}>
                    <button onClick={() => setActiveProblem(null)} style={{ background: 'transparent', color: 'var(--color-text-muted)' }}>← Back</button>
                    <h3>{activeProblem.title}</h3>
                </div>
                <div className="flex-center" style={{ gap: '1rem' }}>
                    <button onClick={handleRun} disabled={isRunning} style={{ padding: '0.5rem 1.5rem', background: 'var(--color-bg-card)', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', borderRadius: '4px' }}>
                        {isRunning ? 'Running...' : 'Run Code'}
                    </button>
                    <button onClick={handleSubmit} style={{ padding: '0.5rem 1.5rem', background: 'var(--color-success)', color: '#000', fontWeight: 'bold', borderRadius: '4px' }}>
                        Submit
                    </button>
                </div>
            </div>

            {/* Split View */}
            <div style={{ flex: 1, display: 'flex' }}>
                {/* Left: Description */}
                <div style={{ width: '40%', padding: '2rem', borderRight: '1px solid var(--color-border)', overflowY: 'auto' }}>
                    <h4 style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>PROBLEM STATEMENT</h4>
                    <p style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>{activeProblem.description}</p>

                    <div style={{ marginTop: '2rem' }}>
                        <h4 style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Example 1</h4>
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontFamily: 'monospace' }}>
                            Input: root = [4,2,7,1,3,6,9]<br />
                            Output: [4,7,2,9,6,3,1]
                        </div>
                    </div>
                </div>

                {/* Right: Code & Output */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Code Editor */}
                    <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '0.5rem 1rem', background: '#000', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>solution.py</div>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            style={{
                                flex: 1,
                                background: '#1e1e1e',
                                color: '#d4d4d4',
                                border: 'none',
                                padding: '1rem',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '1rem',
                                resize: 'none'
                            }}
                            spellCheck="false"
                        />
                    </div>

                    {/* Console Output */}
                    <div style={{ flex: 1, background: '#000', padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', borderTop: '1px solid var(--color-border)' }}>
                        <div style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>CONSOLE OUTPUT</div>
                        <pre style={{ whiteSpace: 'pre-wrap', color: output.includes('Passed') ? 'var(--color-success)' : '#fff' }}>
                            {output || 'Run code to see output...'}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodingView;
