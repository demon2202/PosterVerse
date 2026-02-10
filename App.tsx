
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Profile } from './pages/Profile';
import { Analytics } from './components/Analytics';
import { Messages } from './pages/Messages';
import { Login } from './pages/Login';
import { BottomNav } from './components/BottomNav';
import { GlobalProvider } from './context/GlobalContext';
import { ProtectedRoute } from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <GlobalProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/explore" element={<Explore />} />
          
          {/* Protected Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/:userId" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/messages" 
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <BottomNav />
      </HashRouter>
    </GlobalProvider>
  );
};

export default App;
