import React from 'react';
import { useAuction } from '../context/AuctionContext';

const LoginView = () => {
    const { state, login } = useAuction();
    const [teamName, setTeamName] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!teamName.trim()) {
            setError("Please enter a team name");
            return;
        }

        try {
            setLoading(true);
            console.log("Attempting to register/login team:", teamName.trim());
            await login(teamName.trim());
            console.log("Login successful!");
        } catch (err) {
            console.error("Login error:", err);
            setError(err?.message || "Failed to connect to server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // If user is NOT logged in, show Registration/Login Form
    if (!state.user) {
        return (
            <div className="container flex-center" style={{ minHeight: '100vh', flexDirection: 'column' }}>
                <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '450px', textAlign: 'center' }}>
                    <h1 className="text-hero" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>CODEBID</h1>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', letterSpacing: '0.1em' }}>COMPETITIVE CODING AUCTION</p>
                    
                    {/* Registration Instructions */}
                    <div style={{ 
                        background: 'rgba(0, 240, 255, 0.1)', 
                        border: '1px solid var(--color-primary)', 
                        borderRadius: 'var(--radius-sm)', 
                        padding: '1rem', 
                        marginBottom: '2rem',
                        fontSize: '0.9rem',
                        color: 'var(--color-text-muted)'
                    }}>
                        <strong style={{ color: 'var(--color-primary)' }}>New to CodeBid?</strong><br/>
                        Just enter your team name below to register and join the auction!
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '0.5rem', 
                                fontSize: '0.9rem', 
                                color: 'var(--color-text-muted)',
                                textAlign: 'left'
                            }}>
                                Team Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your team name (e.g., Team Alpha, CodeNinjas)"
                                value={teamName}
                                onChange={(e) => {
                                    setTeamName(e.target.value);
                                    if (error) setError("");
                                }}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: error ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                                    fontSize: '1rem',
                                    color: 'white',
                                    borderRadius: 'var(--radius-sm)',
                                    textAlign: 'center'
                                }}
                                autoFocus
                                disabled={loading}
                            />
                        </div>
                        
                        {error && (
                            <div style={{ 
                                color: 'var(--color-primary)', 
                                fontSize: '0.9rem',
                                background: 'rgba(255, 77, 77, 0.1)',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--color-primary)'
                            }}>
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="hero-btn" 
                            style={{ width: "100%" }} 
                            disabled={loading}
                        >
                            {loading ? "REGISTERING..." : "REGISTER & JOIN AUCTION"}
                        </button>
                    </form>

                    <div style={{ 
                        marginTop: '2rem', 
                        fontSize: '0.8rem', 
                        color: 'var(--color-text-muted)',
                        lineHeight: 1.4
                    }}>
                        By registering, you'll get 1,000 coins to bid on coding problems.<br/>
                        Win problems by bidding the highest amount!
                    </div>
                </div>
            </div>
        );
    }

    // If logged in, show Waiting Dashboard
    return (
        <div className="container flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', maxWidth: '500px', width: '100%' }}>
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>CODEBID</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
                    Competitive Coding Auction Platform
                </p>

                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>STATUS</div>
                    <div className="animate-pulse-glow" style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: 'var(--color-primary)',
                        display: 'inline-block',
                        padding: '0.5rem 1.5rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(0, 240, 255, 0.1)',
                        marginTop: '0.5rem'
                    }}>
                        {state.appStatus === 'WAITING' ? 'WAITING FOR HOST' : state.appStatus}
                    </div>
                </div>

                <div className="user-info" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Registered as</p>
                    <h2 style={{ color: 'var(--color-text-main)', fontSize: '2rem', marginBottom: '1rem' }}>{state.user.name}</h2>
                    <div style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        background: 'rgba(0, 255, 157, 0.1)',
                        color: 'var(--color-success)',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 'bold'
                    }}>
                        Wallet: {state.user.wallet} Coins
                    </div>
                </div>

                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    Waiting for the admin to start the auction event...
                </p>
            </div>
        </div>
    );
};

export default LoginView;
