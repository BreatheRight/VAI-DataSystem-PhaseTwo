import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPageNew';
import Installation from './pages/InstallationPicker';
import Survey from './pages/Survey';
import ThankYou from './pages/ThankYou';
import LoginNew from './pages/LoginNew';
import Dashboard from './pages/Dashboard';
import TableView from './pages/TableView';
import EventManager from './pages/EventManager';
import Documentation from './pages/Documentation';
import Settings from './pages/Settings';
import SurveyBuilder from './pages/SurveyBuilder';
import Asterix from './pages/Asterix';
import Errors from './pages/Errors';
import './styles/global.css';
import API from './utils/apiClient';
import { AuthContext } from './utils/AuthContext';
import { SidebarLayout } from './ui/SidebarLayout';function App() {
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [surveyData, setSurveyData] = useState([]);
  const [loading, setLoading] = useState(true);

  // whenever a user logs into the application, we want to authenticate then and store all the necessaey info (survey data, token, user info)
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      API.get("/get-survey-responses")
        .then(res => {
          setSurveyData(res.data);
          setIsAuthenticated(true);
          const storedUser = JSON.parse(localStorage.getItem("user"));
          if (storedUser) setUser(storedUser);
        })
        .catch(err => {
          console.error("Session check failed:", err);
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }
  // using AuthContext so we can carry the state across multiple componenets
  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      isAuthenticated,
      setIsAuthenticated,
      surveyData,
      setSurveyData
    }}>
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/installation-selection' element={<Installation />} />
          <Route path='/survey' element={<Survey />} />
          <Route path='/:installationSlug' element={<Survey />} /> {/* Direct slug routing */}
          <Route path='/survey-complete' element={<ThankYou />} />
          {/* Dashboard routes wrapped in SidebarLayout */}
          <Route
            path='/dashboard'
            element={isAuthenticated ? <SidebarLayout /> : <Navigate to="/login" replace />}
          >
            <Route index element={<Dashboard />} />
            <Route path='table' element={<TableView />} />
            <Route path='events' element={<EventManager />} />
            <Route path='survey-builder' element={<SurveyBuilder />} />
            <Route path='docs' element={<Documentation />} />
            <Route path='asterix' element={<Asterix />} />
            <Route path='errors' element={<Errors />} />
            <Route path='settings' element={<Settings />} />
          </Route>
          <Route path='/login' element={<LoginNew />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
