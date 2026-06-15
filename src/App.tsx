import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { setToken, setUser } from './redux/slices/authSlice';
import { setLanguage } from './redux/slices/languageSlice';

// Import Pages
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import CustomerList from './pages/CustomerList';
import AddCustomer from './pages/AddCustomer';
import AddLoan from './pages/AddLoan';
import CustomerDetails from './pages/CustomerDetails';
import Financiers from './pages/Financiers';
import Loans from './pages/Loans';
import LoanDetails from './pages/LoanDetails';
import Lines from './pages/Lines';
import Users from './pages/Users';
import UserDetails from './pages/UserDetails';
import Expenses from './pages/Expenses';
import StatDetails from './pages/StatDetails';

const PrivateRoute = ({ children, role }: { children: React.ReactNode, role?: string }) => {
  const { token, user } = useAppSelector(state => state.auth);
  
  if (!token) return <Navigate to="/login" />;
  if (role && role !== 'any') {
    if (role === 'admin' && (user?.role === 'admin' || user?.role === 'superadmin')) {
      // Allowed
    } else if (user?.role !== role) {
      return <Navigate to="/" />;
    }
  }
  
  return <>{children}</>;
};

function App() {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector(state => state.auth);
  const { language } = useAppSelector(state => state.language);

  useEffect(() => {
    // Check localStorage for token and user on web instead of AsyncStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      dispatch(setToken(storedToken));
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="app-container">
        {token && (
          <header style={{ 
            background: 'var(--bg-header)', 
            padding: '16px 24px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div>
              <h1 style={{ color: '#FFC107', fontSize: '20px', margin: '0 0 4px 0', fontWeight: 'bold' }}>
                Welcome back, {user?.name?.split(' ')[0]}!
              </h1>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                onClick={() => dispatch(setLanguage(language === 'en' ? 'ta' : 'en'))}
                style={{ 
                background: 'rgba(255,255,255,0.1)', 
                color: 'white', 
                border: 'none', 
                padding: '6px 12px', 
                borderRadius: '16px', 
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                {language === 'en' ? 'தமிழ்' : 'English'}
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  window.location.href = '/login';
                }}
                style={{ 
                  background: 'rgba(239, 68, 68, 0.2)', 
                  color: '#EF4444', 
                  border: 'none', 
                  width: '36px',
                  height: '36px',
                  borderRadius: '18px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ⏻
              </button>
            </div>
          </header>
        )}
        <main className="main-content">
          <Routes>
            <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
            
            <Route path="/" element={<PrivateRoute role="any"><AdminDashboard /></PrivateRoute>} />
            <Route path="/customers" element={<PrivateRoute><CustomerList /></PrivateRoute>} />
            <Route path="/add-customer" element={<PrivateRoute><AddCustomer /></PrivateRoute>} />
            <Route path="/add-loan/:customerId" element={<PrivateRoute><AddLoan /></PrivateRoute>} />
            <Route path="/customer/:id" element={<PrivateRoute><CustomerDetails /></PrivateRoute>} />
            <Route path="/financiers" element={<PrivateRoute role="admin"><Financiers /></PrivateRoute>} />
            <Route path="/loans" element={<PrivateRoute><Loans /></PrivateRoute>} />
            <Route path="/loans/:id" element={<PrivateRoute><LoanDetails /></PrivateRoute>} />
            <Route path="/lines" element={<PrivateRoute><Lines /></PrivateRoute>} />
            <Route path="/expenses" element={<PrivateRoute><Expenses /></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute role="admin"><Users /></PrivateRoute>} />
            <Route path="/users/:id" element={<PrivateRoute role="admin"><UserDetails /></PrivateRoute>} />
            <Route path="/stat-details/:type" element={<PrivateRoute role="any"><StatDetails /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
