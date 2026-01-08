import React, { useState } from 'react';
import { AuctionProvider, useAuction } from './context/AuctionContext';

// Components
import LoginView from './views/LoginView';
import AuctionView from './views/AuctionView';
import CodingView from './views/CodingView';
import LeaderboardView from './views/LeaderboardView';
import LandingView from './views/LandingView';
import AdminDashboard from './views/AdminDashboard';
import RulesView from './views/RulesView';

function AppContent({ viewMode, setViewMode }) {
  const { state } = useAuction();

  if (viewMode === 'LANDING') {
    return <LandingView onSelectRole={setViewMode} />;
  }

  if (viewMode === 'RULES') {
    return <RulesView onBack={() => setViewMode('LANDING')} />;
  }

  if (viewMode === 'ADMIN') {
    return <AdminDashboard onBack={() => setViewMode('LANDING')} />;
  }

  // STUDENT VIEW ROUTER
  const renderStudentView = () => {
    switch (state.appStatus) {
      case 'WAITING':
        return <LoginView />;
      case 'READY':
        return <div className="flex-center" style={{ height: '100vh' }}><h1>Auction Starting Soon...</h1></div>;
      case 'AUCTION':
        return <AuctionView />;
      case 'COMPLETED':
        return <div className="flex-center" style={{ height: '100vh', flexDirection: 'column' }}>
          <h1>Auction Complete!</h1>
          <p>Waiting for Admin to start Coding Phase...</p>
        </div>;
      case 'CODING':
        return <CodingView />;
      case 'FINISHED':
        return <LeaderboardView />;
      default:
        return <LoginView />;
    }
  };

  return (
    <div className="app-container">
      {renderStudentView()}
      <button
        onClick={() => setViewMode('LANDING')}
        style={{ position: 'fixed', bottom: '10px', left: '10px', opacity: 0.3, background: 'transparent', color: '#fff' }}
      >
        Exit
      </button>
    </div>
  );
}

import ErrorBoundary from './ErrorBoundary';

function App() {
  const [viewMode, setViewMode] = useState('LANDING'); // LANDING, STUDENT, ADMIN

  return (
    <ErrorBoundary>
      <AuctionProvider>
        <AppContent viewMode={viewMode} setViewMode={setViewMode} />
      </AuctionProvider>
    </ErrorBoundary>
  );
}

export default App;
