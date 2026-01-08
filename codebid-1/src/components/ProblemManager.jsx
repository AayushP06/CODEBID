import React, { useState, useEffect } from 'react';
import { api } from '../api';

const ProblemManager = ({ onBack }) => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProblem, setNewProblem] = useState({
        title: '',
        description: '',
        difficulty: 'medium',
        testCases: '',
        solution: ''
    });

    const fetchProblems = async () => {
        try {
            setLoading(true);
            const data = await api('/admin/problems');
            setProblems(data);
        } catch (error) {
            console.error('Failed to fetch problems:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProblems();
    }, []);

    const handleAddProblem = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            // Parse test cases JSON
            let testCases = [];
            if (newProblem.testCases.trim()) {
                try {
                    testCases = JSON.parse(newProblem.testCases);
                } catch (err) {
                    alert('Invalid JSON format for test cases');
                    return;
                }
            }

            await api('/admin/problems', {
                method: 'POST',
                body: JSON.stringify({
                    ...newProblem,
                    testCases
                })
            });

            // Reset form and refresh list
            setNewProblem({
                title: '',
                description: '',
                difficulty: 'medium',
                testCases: '',
                solution: ''
            });
            setShowAddForm(false);
            await fetchProblems();
        } catch (error) {
            alert('Failed to add problem: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProblem = async (id) => {
        if (!confirm('Are you sure you want to delete this problem?')) return;
        
        try {
            await api(`/admin/problems/${id}`, { method: 'DELETE' });
            await fetchProblems();
        } catch (error) {
            alert('Failed to delete problem: ' + error.message);
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy': return '#00ff9d';
            case 'medium': return '#ffa500';
            case 'hard': return '#ff4d4d';
            default: return '#00f0ff';
        }
    };

    return (
        <div className="container" style={{ padding: '2rem', minHeight: '100vh' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 className="text-hero" style={{ fontSize: '2.5rem' }}>PROBLEM MANAGER</h1>
                <button onClick={onBack} style={{ background: 'transparent', color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>
                    ← BACK TO DASHBOARD
                </button>
            </header>

            {/* Add Problem Button */}
            <div style={{ marginBottom: '2rem' }}>
                <button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="hero-btn"
                    style={{ padding: '1rem 2rem' }}
                >
                    {showAddForm ? 'CANCEL' : '+ ADD NEW PROBLEM'}
                </button>
            </div>

            {/* Add Problem Form */}
            {showAddForm && (
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Add New Problem</h3>
                    <form onSubmit={handleAddProblem} style={{ display: 'grid', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
                                Problem Title *
                            </label>
                            <input
                                type="text"
                                value={newProblem.title}
                                onChange={(e) => setNewProblem({...newProblem, title: e.target.value})}
                                placeholder="e.g., Two Sum, Valid Parentheses"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white',
                                    borderRadius: 'var(--radius-sm)'
                                }}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
                                Difficulty
                            </label>
                            <select
                                value={newProblem.difficulty}
                                onChange={(e) => setNewProblem({...newProblem, difficulty: e.target.value})}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white',
                                    borderRadius: 'var(--radius-sm)'
                                }}
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
                                Problem Description *
                            </label>
                            <textarea
                                value={newProblem.description}
                                onChange={(e) => setNewProblem({...newProblem, description: e.target.value})}
                                placeholder="Describe the problem clearly..."
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white',
                                    borderRadius: 'var(--radius-sm)',
                                    resize: 'vertical'
                                }}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
                                Test Cases (JSON format)
                            </label>
                            <textarea
                                value={newProblem.testCases}
                                onChange={(e) => setNewProblem({...newProblem, testCases: e.target.value})}
                                placeholder='[{"input": {"nums": [2,7,11,15], "target": 9}, "output": [0,1]}]'
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white',
                                    borderRadius: 'var(--radius-sm)',
                                    fontFamily: 'monospace',
                                    fontSize: '0.9rem',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
                                Solution (Optional)
                            </label>
                            <textarea
                                value={newProblem.solution}
                                onChange={(e) => setNewProblem({...newProblem, solution: e.target.value})}
                                placeholder="function solution() { ... }"
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white',
                                    borderRadius: 'var(--radius-sm)',
                                    fontFamily: 'monospace',
                                    fontSize: '0.9rem',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="hero-btn" 
                            disabled={loading}
                            style={{ padding: '1rem 2rem' }}
                        >
                            {loading ? 'ADDING...' : 'ADD PROBLEM'}
                        </button>
                    </form>
                </div>
            )}

            {/* Problems List */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ letterSpacing: '0.1em' }}>PROBLEMS ({problems.length})</h3>
                    <button 
                        onClick={fetchProblems} 
                        disabled={loading}
                        style={{ 
                            background: 'transparent', 
                            color: 'var(--color-primary)', 
                            border: '1px solid var(--color-primary)',
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer'
                        }}
                    >
                        {loading ? 'LOADING...' : 'REFRESH'}
                    </button>
                </div>

                {problems.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                        No problems added yet
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {problems.map((problem) => (
                            <div 
                                key={problem.id}
                                style={{
                                    padding: '1.5rem',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--color-border)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{problem.title}</h4>
                                        <span 
                                            style={{ 
                                                color: getDifficultyColor(problem.difficulty),
                                                fontSize: '0.9rem',
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase'
                                            }}
                                        >
                                            {problem.difficulty}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteProblem(problem.id)}
                                        style={{
                                            background: 'rgba(255, 77, 77, 0.2)',
                                            border: '1px solid #ff4d4d',
                                            color: '#ff4d4d',
                                            padding: '0.5rem 1rem',
                                            borderRadius: 'var(--radius-sm)',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        DELETE
                                    </button>
                                </div>
                                
                                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                                    {problem.description}
                                </p>
                                
                                {problem.test_cases && problem.test_cases.length > 0 && (
                                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                        <strong>Test Cases:</strong> {problem.test_cases.length} examples
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProblemManager;