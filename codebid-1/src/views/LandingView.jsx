import React from 'react';

const LandingView = ({ onSelectRole }) => {
    const [showAuth, setShowAuth] = React.useState(false);
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const handleAdminClick = () => {
        setShowAuth(true);
        setError('');
        setPassword('');
    };

    const handleAuthSubmit = (e) => {
        e.preventDefault();
        if (password === 'code@bid123') {
            onSelectRole('ADMIN');
        } else {
            setError('Incorrect Password');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Top Navigation */}
            <nav className="nav-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', background: 'var(--color-primary)', borderRadius: '50%' }}></div>
                    <span style={{ fontWeight: 700, letterSpacing: '0.1em' }}>CODEBID</span>
                </div>

                <div className="nav-links">
                    <span className="nav-item active">Destinations</span>
                    <span className="nav-item">Experiences</span>
                    <span className="nav-item">Key Information</span>
                </div>
            </nav>

            {/* Main Hero Content */}
            <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                {/* Auth Modal Overlay */}
                {showAuth && (
                    <div style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)'
                    }} onClick={() => setShowAuth(false)}>
                        <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
                            <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Admin Access</h2>
                            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <input
                                    type="password"
                                    placeholder="ENTER PASSWORD"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        textAlign: 'center',
                                        letterSpacing: '0.2rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--color-primary)',
                                        color: 'white',
                                        padding: '1rem'
                                    }}
                                    autoFocus
                                />
                                {error && <div style={{ color: 'var(--color-primary)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
                                <button type="submit" className="hero-btn" style={{ width: '100%' }}>LOGIN</button>
                            </form>
                        </div>
                    </div>
                )}

                <div style={{ maxWidth: '600px', marginBottom: 'auto', marginTop: '10vh' }}>
                    <div style={{
                        fontSize: '1rem',
                        letterSpacing: '0.2em',
                        color: 'var(--color-primary)',
                        marginBottom: '1rem',
                        fontWeight: 500
                    }}>
                        COMPETITIVE AUCTION
                    </div>
                    <h1 className="text-hero" style={{
                        fontSize: '8rem',
                        color: 'white',
                        marginBottom: '2rem',
                        textShadow: '0 0 30px rgba(0,0,0,0.5)'
                    }}>
                        CODE<br />BID
                    </h1>

                    <div style={{
                        borderLeft: '4px solid var(--color-primary)',
                        paddingLeft: '20px',
                        marginBottom: '3rem'
                    }}>
                        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, maxWidth: '400px' }}>
                            "The best coders don’t wait for problems — they bid for them."
                        </p>
                        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid white' }} />
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>SYSTEM ADMIN</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Platform Architect</div>
                            </div>
                        </div>
                    </div>


                </div>

                {/* Bottom Circular Selectors */}
                <div className="circle-selector-container">
                    <div className="circle-selector" onClick={() => onSelectRole('STUDENT')}>
                        <div className="icon">👨‍💻</div>
                        <h3>Student</h3>
                    </div>
                    <div className="circle-selector dashed" onClick={handleAdminClick}>
                        <div className="icon">⚡</div>
                        <h3>Admin</h3>
                    </div>
                    <div className="circle-selector dashed" onClick={() => onSelectRole('RULES')}>
                        <div className="icon">📜</div>
                        <h3>Rules</h3>
                    </div>
                </div>
            </div>

            {/* Ambient Background Glows */}
            <div style={{
                position: 'absolute', top: '-20%', right: '-10%',
                width: '60vw', height: '60vw',
                background: 'radial-gradient(circle, rgba(255,77,77,0.2) 0%, rgba(0,0,0,0) 70%)',
                zIndex: -1, pointerEvents: 'none'
            }}></div>
        </div>
    );
};

export default LandingView;
