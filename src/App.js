import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './layout/Home';
import CreateProject from './pages/CreateProject';
import InnovatorProject from './pages/InnovatorProject';
import ActiveProject from './pages/ActiveProject';
import DonorProject from './pages/DonorProject';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    setIsLoggedIn(false); 
    setUserId(null);
    setUserRole(null);
    localStorage.removeItem('userId'); 
    localStorage.removeItem('userRole'); 
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUserId && storedUserRole) {
      setUserId(storedUserId);
      setUserRole(storedUserRole);
      setIsLoggedIn(true);
    }
    setLoading(false); // Ensure this is set to false after checking
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <Router>
      <AppRoutes 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
        setUserId={setUserId}
        setUserRole={setUserRole}
        userRole={userRole} 
        handleLogout={handleLogout}
      />
    </Router>
  );
}

function AppRoutes({ isLoggedIn, setIsLoggedIn, setUserId, setUserRole, userRole, handleLogout }) {
  const location = useLocation();

  return (
    <div className="App">
      {isLoggedIn && <Home handleLogout={handleLogout} />}
      <Routes>
        <Route 
          path="/" 
          element={
            isLoggedIn 
              ? <Navigate to={location.pathname !== '/login' ? location.pathname : (userRole === 'INNOVATOR' ? '/innovator/projects' : '/donor/projects')} />
              : <Navigate to="/login" />
          } 
        />
        <Route path="/login" element={<Login setUserId={setUserId} setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
        <Route path="/register" element={<Register />} />
        {isLoggedIn && (
          <>
            {userRole === 'INNOVATOR' && (
              <>
                <Route path="/innovator/create" element={<CreateProject />} />
                <Route path="/innovator/projects" element={<InnovatorProject />} />
              </>
            )}
            {userRole === 'DONOR' && (
              <>
              <Route path="/donor/projects" element={<ActiveProject />} />
              <Route path="/donor/:donorId/projects" element={<DonorProject />} /> 
              </>
            )}
          </>
        )}
        <Route path="*" element={isLoggedIn ? <Navigate to={location.pathname} /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;