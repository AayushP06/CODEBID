import React, { useState, useEffect } from 'react';
import { useAuction } from '../context/AuctionContext';
import { api } from '../api';

const LiveLeaderboard = () => {
  const { state } = useAuction();
  const { user } = state;
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await api('/admin/leaderboard');
      setLeaderboard(response);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Refresh leaderboard every 2 seconds during auction
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.appStatus === 'AUCTION') {
        fetchLeaderboard();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [state.appStatus]);

  if (loading && leaderboard.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
        Loading leaderboard...
      </div>
    );
  }

  const topTeams = leaderboard.slice(0, 5);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        padding: '0 0 1rem 0', 
        borderBottom: '1px solid var(--color-border)', 
        fontWeight: 'bold', 
        letterSpacing: '0.1em',
        marginBottom: '1rem'
      }}>
        🏆 TOP TEAMS
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
        {topTeams.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem 0' }}>
            No teams yet
          </div>
        ) : (
          topTeams.map((team, index) => {
            const isCurrentUser = user && team.name === user.name;
            const medalEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
            
            return (
              <div
                key={team.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: isCurrentUser ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255,255,255,0.02)',
                  border: isCurrentUser ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                  <span style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 'bold',
                    minWidth: '30px'
                  }}>
                    {medalEmoji}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontWeight: isCurrentUser ? 'bold' : 'normal',
                      fontSize: '0.95rem',
                      color: isCurrentUser ? 'var(--color-primary)' : 'white'
                    }}>
                      {team.name}
                      {isCurrentUser && (
                        <span style={{ 
                          marginLeft: '0.5rem', 
                          fontSize: '0.7rem', 
                          background: 'var(--color-primary)', 
                          color: '#000', 
                          padding: '2px 6px', 
                          borderRadius: '3px',
                          fontWeight: 'bold'
                        }}>
                          YOU
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ 
                  textAlign: 'right',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: 'var(--color-text-muted)',
                    fontWeight: 'bold'
                  }}>
                    {team.coins} coins
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--color-success)',
                    fontWeight: 'bold'
                  }}>
                    Score: {team.score || 0}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {leaderboard.length > 5 && (
        <div style={{ 
          marginTop: '1rem', 
          paddingTop: '1rem', 
          borderTop: '1px solid var(--color-border)',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)'
        }}>
          +{leaderboard.length - 5} more teams
        </div>
      )}
    </div>
  );
};

export default LiveLeaderboard;
