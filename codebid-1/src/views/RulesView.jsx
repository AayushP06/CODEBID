import React from 'react';

const RulesView = ({ onBack }) => {
    return (
        <div className="container flex-center" style={{ minHeight: '100vh', flexDirection: 'column', position: 'relative' }}>
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '800px' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 className="text-hero" style={{ fontSize: '3rem' }}>GAME RULES</h1>
                    <button
                        onClick={onBack}
                        style={{
                            background: 'transparent',
                            color: 'var(--color-text-muted)',
                            letterSpacing: '0.1em',
                            cursor: 'pointer'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = 'white'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                    >
                        BACK TO HOME
                    </button>
                </header>

                <div style={{ display: 'grid', gap: '2rem' }}>

                    {/* Phase 1: Auction */}
                    <div style={{ padding: '1.5rem', borderLeft: '3px solid var(--color-primary)', background: 'rgba(255,255,255,0.02)' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>PHASE 1: THE AUCTION</h2>
                        <ul style={{ listStyle: 'none', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
                            <li style={{ marginBottom: '0.5rem' }}>• Every team starts with <strong>100 Coins</strong> in their wallet.</li>
                            <li style={{ marginBottom: '0.5rem' }}>• Algorithm problems are auctioned one by one.</li>
                            <li style={{ marginBottom: '0.5rem' }}>• Problems have different difficulty levels (Easy, Medium, Hard) and point values.</li>
                            <li>• Bid strategically to secure the best problems for your team.</li>
                        </ul>
                    </div>

                    {/* Phase 2: Coding */}
                    <div style={{ padding: '1.5rem', borderLeft: '3px solid var(--color-secondary)', background: 'rgba(255,255,255,0.02)' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-secondary)' }}>PHASE 2: CODING</h2>
                        <ul style={{ listStyle: 'none', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
                            <li style={{ marginBottom: '0.5rem' }}>• Once the auction ends, the <strong>Coding Phase</strong> begins.</li>
                            <li style={{ marginBottom: '0.5rem' }}>• You can ONLY solve the problems you purchased.</li>
                            <li style={{ marginBottom: '0.5rem' }}>• Solve problems to earn points and climb the leaderboard.</li>
                            <li>• Speed matters! Complex problems yield higher rewards.</li>
                        </ul>
                    </div>

                    {/* Winning */}
                    <div style={{ padding: '1.5rem', borderLeft: '3px solid var(--color-accent)', background: 'rgba(255,255,255,0.02)' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-accent)' }}>VICTORY CONDITIONS</h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
                            The team with the highest total score at the end of the event wins.
                            Wallet balance is used as a tie-breaker.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RulesView;
