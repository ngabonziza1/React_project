import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import SparePart from './components/SparePart';
import Dashboard from './components/Dashboard';
import StockIn from './components/StockIn';
import StockOut from './components/StockOut';
import Reports from './components/Reports';

axios.defaults.withCredentials = true;
const API_URL = 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/session`)
      .then((res) => {
        if (res.data.loggedIn) setUser(res.data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="text-center mt-20 font-bold text-gray-600">
        Initializing SIMS Workspace...
      </div>
    );

  if (!user) {
    if (showRegister)
      return (
        <Register
          onCancel={() => setShowRegister(false)}
          onRegisterSuccess={() => {
            // Force user to go to Login screen after registration
            setShowRegister(false);
          }}
        />
      );

    return (
      <Login
        onShowRegister={() => setShowRegister(true)}
        onLoginSuccess={(userData) => {
          setUser(userData);
          setShowRegister(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setUser={setUser}
      />
      <div className="container mx-auto p-4 md:p-6">
        {currentPage === 'Dashboard' && <Dashboard />}
        {currentPage === 'SparePart' && <SparePart />}
        {currentPage === 'StockIn' && <StockIn />}
        {currentPage === 'StockOut' && <StockOut />}
        {currentPage === 'Reports' && <Reports />}
      </div>
    </div>
  );
}

export default App;
