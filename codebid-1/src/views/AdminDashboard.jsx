import React from 'react';
import { useAuction } from '../context/AuctionContext';
import { api } from '../api';
import ProblemManager from '../components/ProblemManager';

const AdminDashboard = ({ onBack }) => {
    const { state, adminStartAuction, startCoding, endEvent, broadcastTick } = useAuction();
    const { appStatus, auction } = state;
    const [teams, setTeams] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [currentView, setCurrentView] = React.useState('dashboard'); // 'dashboard' or 'problems'
    const [auctionTimer, setAuctionTimer] = React.useState(60); // Default 60 seconds per problem
    const [removingTeamId, setRemovingTeamId] = React.useState(null);

    // Fetch registered teams
    const fetchTeams = async () => {
        try {
            setLoading(true);
            console.log('Fetching teams...');
            const teamsData = await api('/admin/teams');
            console.log('Teams fetched:', teamsData);
            setTeams(Array.isArray(teamsData) ? teamsData : []);
        } catch (error) {
            console.error('Failed to fetch teams:', error);
            alert(`❌ Failed to fetch teams: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Remove team
    const handleRemoveTeam = async (teamId, teamName) => {
        console.log('Attempting to remove team:', teamId, teamName);
        
        if (!window.confirm(`Are you sure you want to remove team "${teamName}" from the auction?`)) {
            return;
        }

        try {
            setRemovingTeamId(teamId);
            console.log('Making DELETE request to:', `/admin/teams/${teamId}`);
            
            // Check if we have a valid token
            const token = localStorage.getItem('token');
            console.log('Auth token exists:', !!token);
            
            const response = await api(`/admin/teams/${teamId}`, { method: 'DELETE' });
            console.log('Remove team response:', response);
            
            // Update local state
            setTeams(teams.filter(t => t.id !== teamId));
            
            // Refresh teams from server to ensure consistency
            await fetchTeams();
            
            alert(`✅ Team "${teamName}" removed successfully`);
        } catch (error) {
            console.error('Failed to remove team - Full error:', error);
            
            // More detailed error handling
            if (error.message.includes('404')) {
                alert(`❌ Team not found. It may have already been removed.`);
            } else if (error.message.includes('403')) {
                alert(`❌ Cannot remove admin team or insufficient permissions.`);
            } else if (error.message.includes('401')) {
                alert(`❌ Authentication failed. Please log in again.`);
            } else if (error.message.includes('Failed to fetch')) {
                alert(`❌ Cannot connect to server. Please check if the backend is running.`);
            } else {
                alert(`❌ Failed to remove team: ${error.message}`);
            }
        } finally {
            setRemovingTeamId(null);
        }
    };

    React.useEffect(() => {
        fetchTeams();
    }, []);

    React.useEffect(() => {
        if (currentView === 'dashboard') {
            fetchTeams();
        }
    }, [currentView]);

    // Auto-refresh teams every 5 seconds
    React.useEffect(() => {
        const interval = setInterval(() => {
            if (currentView === 'dashboard') {
                fetchTeams();
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [currentView]);

    // Show Problem Manager
    if (currentView === 'problems') {
        return <ProblemManager onBack={() => setCurrentView('dashboard')} />;
    }

    // Admin drives the timer to ensure sync across tabs
    React.useEffect(() => {
        let interval;
        if ((appStatus === 'AUCTION' && auction.timeLeft > 0) ||
            (appStatus === 'CODING' && auction.codingTimer > 0)) {
            interval = setInterval(() => {
                broadcastTick();
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [appStatus, auction.timeLeft, auction.codingTimer, broadcastTick]);

    return (
        <div className="container" style={{ padding: '2rem', minHeight: '100vh' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 className="text-hero" style={{ fontSize: '2.5rem' }}>ADMIN DASHBOARD</h1>
                <button onClick={onBack} style={{ background: 'transparent', color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>LOGOUT</button>
            </header>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem', letterSpacing: '0.1em' }}>GAME STATUS: <span style={{ color: 'var(--color-primary)' }}>{appStatus}</span></h2>

                {appStatus === 'AUCTION' && (
                    <div style={{ marginTop: '1.5rem' }}>
                        {/* Current Problem Info */}
                        <div style={{
                            background: 'rgba(0, 240, 255, 0.1)',
                            border: '2px solid var(--color-primary)',
                            borderRadius: 'var(--radius-md)',
                            padding: '1.5rem',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>
                                CURRENT PROBLEM
                            </div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
                                {auction.currentProblem?.title || 'Loading...'}
                            </div>
                            <div style={{
                                display: 'inline-block',
                                padding: '0.25rem 0.75rem',
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.8rem',
                                textTransform: 'uppercase'
                            }}>
                                {auction.currentProblem?.difficulty || 'medium'}
                            </div>
                        </div>

                        {/* Live Auction Timer Display */}
                        <div style={{
                            background: auction.timeLeft < 10 ? 'rgba(255, 77, 77, 0.2)' : 'rgba(0, 240, 255, 0.1)',
                            border: `2px solid ${auction.timeLeft < 10 ? 'var(--color-primary)' : 'var(--color-primary)'}`,
                            borderRadius: 'var(--radius-md)',
                            padding: '2rem',
                            textAlign: 'center',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>
                                AUCTION TIME REMAINING
                            </div>
                            <div style={{
                                fontSize: '4rem',
                                fontWeight: 'bold',
                                color: auction.timeLeft < 10 ? 'var(--color-primary)' : 'var(--color-success)',
                                animation: auction.timeLeft < 10 ? 'pulse 1s infinite' : 'none'
                            }}>
                                {auction.timeLeft || 0}s
                            </div>
                            {auction.timeLeft < 10 && auction.timeLeft > 0 && (
                                <div style={{ 
                                    marginTop: '0.5rem', 
                                    fontSize: '0.9rem', 
                                    color: 'var(--color-primary)',
                                    fontWeight: 'bold'
                                }}>
                                    ⚠️ AUCTION ENDING SOON!
                                </div>
                            )}
                        </div>

                        {/* Live Bidding Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            {/* Highest Bid */}
                            <div style={{
                                background: 'rgba(0, 255, 157, 0.1)',
                                border: '1px solid var(--color-success)',
                                borderRadius: 'var(--radius-md)',
                                padding: '1rem',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                                    HIGHEST BID
                                </div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-success)' }}>
                                    {auction.highestBid || 0}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>coins</div>
                            </div>

                            {/* Leading Team */}
                            <div style={{
                                background: 'rgba(255, 77, 77, 0.1)',
                                border: '1px solid var(--color-primary)',
                                borderRadius: 'var(--radius-md)',
                                padding: '1rem',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                                    LEADING TEAM
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                                    {auction.highestBidderName || '—'}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                    {auction.highestBid > 0 ? '👑 Current Leader' : 'No bids yet'}
                                </div>
                            </div>

                            {/* Time Left */}
                            <div style={{
                                background: auction.timeLeft < 10 ? 'rgba(255, 77, 77, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                border: `1px solid ${auction.timeLeft < 10 ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                borderRadius: 'var(--radius-md)',
                                padding: '1rem',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                                    TIME LEFT
                                </div>
                                <div style={{
                                    fontSize: '2.5rem',
                                    fontWeight: 'bold',
                                    color: auction.timeLeft < 10 ? 'var(--color-primary)' : 'white'
                                }}>
                                    {auction.timeLeft || '--'}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>seconds</div>
                            </div>
                        </div>
                    </div>
                )}

                {appStatus === 'CODING' && (
                    <div style={{ marginBottom: '1rem' }}>
                        <div>Coding Timer: {auction?.codingTimer || 0}s</div>
                    </div>
                )}

                {appStatus === 'WAITING' && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        background: teams.filter(t => !t.is_admin).length < 2 ? 'rgba(255, 77, 77, 0.1)' : 'rgba(0, 255, 157, 0.1)',
                        border: `1px solid ${teams.filter(t => !t.is_admin).length < 2 ? 'var(--color-primary)' : 'var(--color-success)'}`,
                        borderRadius: 'var(--radius-sm)',
                        textAlign: 'center'
                    }}>
                        {teams.filter(t => !t.is_admin).length < 2 ? (
                            <span style={{ color: 'var(--color-primary)' }}>
                                ⚠️ Need at least 2 teams to start auction ({teams.filter(t => !t.is_admin).length}/2 registered)
                            </span>
                        ) : (
                            <span style={{ color: 'var(--color-success)' }}>
                                ✅ Ready to start! ({teams.filter(t => !t.is_admin).length} teams registered)
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Leaderboard Section */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🏆 ALL TEAMS
                        <span style={{ fontSize: '0.9em', color: 'var(--color-text-muted)', fontWeight: 'normal' }}>
                            ({Array.isArray(teams) ? teams.length : 0} total, {Array.isArray(teams) ? teams.filter(t => !t.is_admin).length : 0} players)
                        </span>
                    </h3>
                    <button
                        onClick={fetchTeams}
                        disabled={loading}
                        style={{
                            background: 'transparent',
                            color: 'var(--color-primary)',
                            border: '1px solid var(--color-primary)',
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            marginRight: '1rem'
                        }}
                    >
                        {loading ? 'REFRESHING...' : 'REFRESH'}
                    </button>
                    
                    <button
                        onClick={() => {
                            console.log('Current teams:', teams);
                            console.log('Auth token:', localStorage.getItem('token'));
                            console.log('API Base:', import.meta.env.VITE_API_BASE || "http://localhost:4000");
                        }}
                        style={{
                            background: 'transparent',
                            color: 'var(--color-success)',
                            border: '1px solid var(--color-success)',
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer'
                        }}
                    >
                        DEBUG INFO
                    </button>
                    
                    <button
                        onClick={async () => {
                            try {
                                console.log('Testing API connectivity...');
                                const response = await api('/health');
                                console.log('Health check response:', response);
                                alert('✅ Backend is running and accessible');
                            } catch (error) {
                                console.error('Health check failed:', error);
                                alert(`❌ Backend connection failed: ${error.message}`);
                            }
                        }}
                        style={{
                            background: 'transparent',
                            color: 'var(--color-text-muted)',
                            border: '1px solid var(--color-text-muted)',
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            marginLeft: '1rem'
                        }}
                    >
                        TEST API
                    </button>
                </div>

                {/* Leaderboard Header */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 100px 100px 120px',
                    gap: '1rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(0, 240, 255, 0.1)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '0.5rem',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    letterSpacing: '0.05em',
                    color: 'var(--color-primary)'
                }}>
                    <div>RANK</div>
                    <div>TEAM</div>
                    <div style={{ textAlign: 'right' }}>SCORE</div>
                    <div style={{ textAlign: 'right' }}>COINS</div>
                    <div style={{ textAlign: 'center' }}>ACTION</div>
                </div>

                {teams.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                        No teams registered yet
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {teams
                            .sort((a, b) => (b.score || 0) - (a.score || 0) || (b.coins || 0) - (a.coins || 0))
                            .map((team, index) => (
                                <div
                                    key={team.id}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '60px 1fr 100px 100px 120px',
                                        gap: '1rem',
                                        alignItems: 'center',
                                        padding: '1rem',
                                        background: team.is_admin ? 'rgba(255, 215, 0, 0.1)' :
                                            index === 0 ? 'rgba(255, 215, 0, 0.1)' :
                                                index === 1 ? 'rgba(192, 192, 192, 0.1)' :
                                                    index === 2 ? 'rgba(205, 127, 50, 0.1)' :
                                                        'rgba(255, 255, 255, 0.03)',
                                        borderRadius: 'var(--radius-sm)',
                                        border: team.is_admin ? '2px solid gold' :
                                            index < 3 ? `1px solid ${index === 0 ? 'gold' : index === 1 ? 'silver' : '#cd7f32'}` : '1px solid var(--color-border)'
                                    }}
                                >
                                    <div style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        color: team.is_admin ? 'gold' :
                                            index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? '#cd7f32' : 'var(--color-text-muted)'
                                    }}>
                                        {team.is_admin ? '👑' : 
                                         index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                            {team.name} {team.is_admin && '(ADMIN)'}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                            Joined {new Date(team.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div style={{
                                        textAlign: 'right',
                                        fontWeight: 'bold',
                                        fontSize: '1.2rem',
                                        color: 'var(--color-primary)'
                                    }}>
                                        {team.score || 0}
                                    </div>
                                    <div style={{
                                        textAlign: 'right',
                                        color: 'var(--color-success)',
                                        fontWeight: 'bold'
                                    }}>
                                        {team.coins || 0}
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        {team.is_admin ? (
                                            <div style={{ 
                                                fontSize: '0.8rem', 
                                                color: 'var(--color-text-muted)',
                                                fontStyle: 'italic'
                                            }}>
                                                Protected
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleRemoveTeam(team.id, team.name)}
                                                disabled={removingTeamId === team.id}
                                                style={{
                                                    padding: '0.5rem 0.75rem',
                                                    background: 'rgba(255, 77, 77, 0.2)',
                                                    border: '1px solid var(--color-primary)',
                                                    color: 'var(--color-primary)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    cursor: removingTeamId === team.id ? 'not-allowed' : 'pointer',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 'bold',
                                                    opacity: removingTeamId === team.id ? 0.5 : 1
                                                }}
                                            >
                                                {removingTeamId === team.id ? 'REMOVING...' : '❌ REMOVE'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gap: '1rem', maxWidth: '600px', margin: '0 auto' }}>
                {/* Problem Management Button */}
                <button
                    onClick={() => setCurrentView('problems')}
                    style={{
                        padding: '1rem 2rem',
                        background: 'rgba(0, 240, 255, 0.1)',
                        border: '1px solid var(--color-primary)',
                        color: 'var(--color-primary)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        letterSpacing: '0.1em'
                    }}
                >
                    📝 MANAGE PROBLEMS
                </button>

                {appStatus === 'WAITING' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Timer Setting */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>⏱️ AUCTION TIMER</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                    Time for each problem auction
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <button
                                    onClick={() => setAuctionTimer(Math.max(10, auctionTimer - 10))}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        background: 'rgba(255, 77, 77, 0.2)',
                                        border: '1px solid var(--color-primary)',
                                        color: 'var(--color-primary)',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold'
                                    }}
                                >−</button>
                                <div style={{
                                    width: '80px',
                                    textAlign: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: 'var(--color-primary)'
                                }}>
                                    {auctionTimer}s
                                </div>
                                <button
                                    onClick={() => setAuctionTimer(Math.min(300, auctionTimer + 10))}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        background: 'rgba(0, 255, 157, 0.2)',
                                        border: '1px solid var(--color-success)',
                                        color: 'var(--color-success)',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold'
                                    }}
                                >+</button>
                            </div>
                        </div>

                        {/* Start Button */}
                        <button
                            onClick={() => adminStartAuction(auctionTimer)}
                            className="hero-btn"
                            style={{
                                padding: '1.5rem',
                                fontSize: '1.2rem',
                                width: '100%',
                                opacity: teams.filter(t => !t.is_admin).length < 2 ? 0.5 : 1,
                                cursor: teams.filter(t => !t.is_admin).length < 2 ? 'not-allowed' : 'pointer'
                            }}
                            disabled={teams.filter(t => !t.is_admin).length < 2}
                        >
                            {teams.filter(t => !t.is_admin).length < 2
                                ? `WAITING FOR TEAMS (${teams.filter(t => !t.is_admin).length}/2)`
                                : `START AUCTION (${auctionTimer}s per problem)`}
                        </button>
                    </div>
                )}

                {appStatus === 'COMPLETED' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{
                            background: 'rgba(0, 255, 157, 0.1)',
                            border: '2px solid var(--color-success)',
                            borderRadius: 'var(--radius-md)',
                            padding: '1.5rem',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-success)', marginBottom: '0.5rem' }}>
                                ✅ AUCTION COMPLETED
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                {auction.highestBidderName ? (
                                    <>
                                        🏆 {auction.highestBidderName} won "{auction.currentProblem?.title}" for {auction.highestBid} coins
                                    </>
                                ) : (
                                    <>No bids were placed for this problem</>
                                )}
                            </div>
                        </div>

                        <button 
                            onClick={() => adminStartAuction(auctionTimer)}
                            className="hero-btn" 
                            style={{ padding: '1.5rem', fontSize: '1.2rem', width: '100%' }}
                        >
                            ➡️ NEXT PROBLEM ({auctionTimer}s)
                        </button>

                        <button 
                            onClick={startCoding} 
                            style={{
                                padding: '1.5rem',
                                fontSize: '1.2rem',
                                width: '100%',
                                background: 'rgba(0, 240, 255, 0.1)',
                                border: '1px solid var(--color-primary)',
                                color: 'var(--color-primary)',
                                borderRadius: 'var(--radius-lg)',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            ⏭️ SKIP TO CODING PHASE
                        </button>
                    </div>
                )}

                {appStatus === 'CODING' && (
                    <button onClick={endEvent} style={{
                        padding: '1.5rem',
                        fontSize: '1.5rem',
                        background: 'rgba(255, 77, 77, 0.2)',
                        border: '1px solid var(--color-primary)',
                        color: 'var(--color-primary)',
                        borderRadius: 'var(--radius-lg)',
                        cursor: 'pointer',
                        width: '100%'
                    }}>
                        END EVENT
                    </button>
                )}

                {appStatus === 'FINISHED' && (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem', fontSize: '1.5rem', color: 'var(--color-success)' }}>
                        EVENT FINISHED. LEADERBOARD IS LIVE.
                    </div>
                )}

                {['READY', 'AUCTION'].includes(appStatus) && (
                    <div style={{ padding: '2rem', border: '1px dashed var(--color-border)', textAlign: 'center', color: 'var(--color-text-muted)', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
                        Auction in progress... Monitor via Student View or Live Feed.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
