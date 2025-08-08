
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import WelcomePage from './pages/WelcomePage';
import NicknamePage from './pages/NicknamePage';
import RoomsPage from './pages/RoomsPage';
import CreateRoomPage from './pages/CreateRoomPage';
import ChatRoomPage from './pages/ChatRoomPage';
import JoinPrivateRoomPage from './pages/JoinPrivateRoomPage';

function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  return (
    <div className="min-h-screen gradient-bg">
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route 
            path="/nickname" 
            element={<NicknamePage setCurrentUser={setCurrentUser} />} 
          />
          <Route 
            path="/rooms" 
            element={
              currentUser ? <RoomsPage currentUser={currentUser} /> : <Navigate to="/" />
            } 
          />
          <Route 
            path="/create-room" 
            element={
              currentUser ? <CreateRoomPage currentUser={currentUser} /> : <Navigate to="/" />
            } 
          />
          <Route 
            path="/join-private" 
            element={
              currentUser ? <JoinPrivateRoomPage currentUser={currentUser} /> : <Navigate to="/" />
            } 
          />
          <Route 
            path="/chat/:roomId" 
            element={
              currentUser ? <ChatRoomPage currentUser={currentUser} /> : <Navigate to="/" />
            } 
          />
        </Routes>
      </Router>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(30, 41, 59, 0.9)',
            color: 'white',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            fontFamily: 'Malgun Gothic, Noto Sans KR, sans-serif',
          },
        }}
      />
    </div>
  );
}

export default App;
