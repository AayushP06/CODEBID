import React, { useEffect, useState } from 'react';
import { useAuction } from '../context/AuctionContext';

const LeaderboardView = () => {
    const { state } = useAuction();
    const { user } = state;
    const [leaderboard, setLeaderboard] = useState([]);

    if (!user) return <div className="flex-center" style={{ height: '100vh' }}>Loading Results...</div>;

    useEffect(() => {
        // Mock Leaderboard Data
        // Ideally this comes from backend. We mix current user with fake teams.
        const mockTeams = [
            { id: 'team_beta', name: 'Team Beta', score: 280, wallet: 10 },
            { id: 'team_gamma', name: 'Team Gamma', score: 150, wallet: 45 },
            { id: 'team_delta', name: 'Team Delta', score: 320, wallet: 0 },
            { id: 'team_zeta', name: 'Code Ninjas', score: 210, wallet: 80 }
        ];

        // Add current user
        const allTeams = [
            ...mockTeams,
            { id: user.id || 'current', name: user.name, score: user.score || 0, wallet: user.wallet }
        ];

        // Sort by Score Descending
        const sorted = allTeams.sort((a, b) => b.score - a.score);
        setLeaderboard(sorted);
    }, [user]);

    const getRankStyle = (index) => {
        if (index === 0) return { fontSize: '1.5rem', color: '#ffd700', textShadow: '0 0 10px #ffd700' }; // Gold
        if (index === 1) return { fontSize: '1.3rem', color: '#c0c0c0' }; // Silver
        if (index === 2) return { fontSize: '1.2rem', color: '#cd7f32' }; // Bronze
        return { color: 'var(--color-text-muted)' };
    };

    return (
        <div className="container flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '2rem' }}>
            <h1 className="text-hero" style={{ fontSize: '5rem', marginBottom: '0.5rem' }}>FINAL RESULTS</h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '3rem', letterSpacing: '0.1em' }}>THE AUCTION HAS ENDED. HERE ARE THE CHAMPIONS.</p>

            <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ padding: '1.5rem', color: 'var(--color-text-muted)' }}>RANK</th>
                            <th style={{ padding: '1.5rem', color: 'var(--color-text-muted)' }}>TEAM</th>
                            <th style={{ padding: '1.5rem', color: 'var(--color-text-muted)' }}>WALLET LEFT</th>
                            <th style={{ padding: '1.5rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>SCORE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((team, index) => {
                            const isCurrentUser = team.name === user.name;
                            return (
                                <tr key={team.id} style={{
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    background: isCurrentUser ? 'rgba(0, 240, 255, 0.1)' : 'transparent'
                                }}>
                                    <td style={{ padding: '1.5rem', fontWeight: 'bold', ...getRankStyle(index) }}>
                                        #{index + 1} {index === 0 ? '👑' : ''}
                                    </td>
                                    <td style={{ padding: '1.5rem', fontSize: '1.2rem', fontWeight: isCurrentUser ? 'bold' : 'normal' }}>
                                        {team.name}
                                        {isCurrentUser && <span style={{ marginLeft: '10px', fontSize: '0.8rem', background: 'var(--color-primary)', color: '#000', padding: '2px 6px', borderRadius: '4px' }}>YOU</span>}
                                    </td>
                                    <td style={{ padding: '1.5rem', fontFamily: 'var(--font-mono)' }}>{team.wallet}</td>
                                    <td style={{ padding: '1.5rem', textAlign: 'right', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-success)' }}>
                                        {team.score}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center', opacity: 0.7 }}>
                <p>Thank you for participating in CodeBid!</p>
            </div>
        </div>
    );
};

export default LeaderboardView;
