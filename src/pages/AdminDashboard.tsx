import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import { getDashboard } from '../services/dashboardService';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAppSelector(state => state.auth);
  const [cards, setCards] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getDashboard();
      setCards(data.cards);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Quick Actions Section */}
      <h2 style={{ color: 'var(--text-main)', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        
        {(user?.role === 'admin' || user?.role === 'superadmin') && (
          <button onClick={() => navigate('/financiers')} className="glass-panel" style={{ padding: '16px 8px', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'white' }}>
            <span style={{ fontSize: '28px' }}>💼</span>
            <span style={{ color: '#4B5563', fontSize: '12px', fontWeight: '600' }}>Financiers</span>
          </button>
        )}

        <button onClick={() => navigate('/customers')} className="glass-panel" style={{ padding: '16px 8px', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'white' }}>
          <span style={{ fontSize: '28px', color: '#3B82F6' }}>👥</span>
          <span style={{ color: '#4B5563', fontSize: '12px', fontWeight: '600' }}>Customers</span>
        </button>

        {user?.role !== 'collector' && (
          <>
            <button onClick={() => navigate('/loans')} className="glass-panel" style={{ padding: '16px 8px', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'white' }}>
              <span style={{ fontSize: '28px' }}>💳</span>
              <span style={{ color: '#4B5563', fontSize: '12px', fontWeight: '600' }}>Loans</span>
            </button>
            
            <button onClick={() => navigate('/lines')} className="glass-panel" style={{ padding: '16px 8px', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'white' }}>
              <span style={{ fontSize: '28px' }}>📍</span>
              <span style={{ color: '#4B5563', fontSize: '12px', fontWeight: '600' }}>Lines</span>
            </button>

            <button onClick={() => navigate('/expenses')} className="glass-panel" style={{ padding: '16px 8px', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'white' }}>
              <span style={{ fontSize: '28px' }}>🏢</span>
              <span style={{ color: '#4B5563', fontSize: '12px', fontWeight: '600' }}>Office Expenses</span>
            </button>
          </>
        )}

        {(user?.role === 'admin' || user?.role === 'superadmin') && (
          <>
            <button onClick={() => navigate('/users?role=collector')} className="glass-panel" style={{ padding: '16px 8px', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'white' }}>
              <span style={{ fontSize: '28px' }}>🧑‍💼</span>
              <span style={{ color: '#4B5563', fontSize: '12px', fontWeight: '600' }}>Collection Agent</span>
            </button>
            <button onClick={() => navigate('/users')} className="glass-panel" style={{ padding: '16px 8px', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'white' }}>
              <span style={{ fontSize: '28px', color: '#3B82F6' }}>👤</span>
              <span style={{ color: '#4B5563', fontSize: '12px', fontWeight: '600' }}>Employee Details</span>
            </button>
          </>
        )}

      </div>

      {/* Statistics Section - Hidden for Collection Agents */}
      {user?.role !== 'collector' && (
        <>
          <h2 style={{ color: 'var(--text-main)', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>Statistics</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            
            {/* --- PEOPLE --- */}
            <div onClick={() => navigate('/stat-details/total-customers')} className="glass-panel" style={{ cursor: 'pointer', padding: '16px', background: 'white', borderLeft: '4px solid #FFC107' }}>
              <span style={{ fontSize: '24px', color: '#60A5FA', display: 'block', marginBottom: '8px' }}>👥</span>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFC107', margin: '0 0 4px 0' }}>
                {cards?.totalCustomers?.toLocaleString() || 0}
              </p>
              <h3 style={{ color: '#6B7280', fontSize: '12px', fontWeight: '500', margin: 0 }}>Total Customers</h3>
            </div>

            <div onClick={() => navigate('/stat-details/total-collectors')} className="glass-panel" style={{ cursor: 'pointer', padding: '16px', background: 'white', borderLeft: '4px solid #FFC107' }}>
              <span style={{ fontSize: '24px', color: '#60A5FA', display: 'block', marginBottom: '8px' }}>👤</span>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFC107', margin: '0 0 4px 0' }}>
                {cards?.totalCollectors?.toLocaleString() || 0}
              </p>
              <h3 style={{ color: '#6B7280', fontSize: '12px', fontWeight: '500', margin: 0 }}>Total Collection Agents</h3>
            </div>

            {/* --- LOAN STATUS --- */}
            <div onClick={() => navigate('/stat-details/active-loans')} className="glass-panel" style={{ cursor: 'pointer', padding: '16px', background: 'white', borderLeft: '4px solid #FFC107' }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>💳</span>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFC107', margin: '0 0 4px 0' }}>
                {cards?.activeLoans?.toLocaleString() || 0}
              </p>
              <h3 style={{ color: '#6B7280', fontSize: '12px', fontWeight: '500', margin: 0 }}>Active Loans</h3>
            </div>

            <div onClick={() => navigate('/stat-details/closed-loans')} className="glass-panel" style={{ cursor: 'pointer', padding: '16px', background: 'white', borderLeft: '4px solid #FFC107' }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>✅</span>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFC107', margin: '0 0 4px 0' }}>
                {cards?.closedLoans?.toLocaleString() || 0}
              </p>
              <h3 style={{ color: '#6B7280', fontSize: '12px', fontWeight: '500', margin: 0 }}>Closed Loans</h3>
            </div>

            <div onClick={() => navigate('/stat-details/overdue-loans')} className="glass-panel" style={{ cursor: 'pointer', padding: '16px', background: 'white', borderLeft: '4px solid #EF4444' }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>⚠️</span>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#EF4444', margin: '0 0 4px 0' }}>
                {cards?.overdueLoans?.toLocaleString() || 0}
              </p>
              <h3 style={{ color: '#6B7280', fontSize: '12px', fontWeight: '500', margin: 0 }}>Overdue Loans</h3>
            </div>

            <div onClick={() => navigate('/stat-details/overdue-emis')} className="glass-panel" style={{ cursor: 'pointer', padding: '16px', background: 'white', borderLeft: '4px solid #EF4444' }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>🔴</span>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#EF4444', margin: '0 0 4px 0' }}>
                {cards?.overdueCount?.toLocaleString() || 0} EMIs
              </p>
              <h3 style={{ color: '#6B7280', fontSize: '12px', fontWeight: '500', margin: 0 }}>Overdue Count</h3>
            </div>

            {/* --- FINANCIAL OVERVIEW --- */}
            <div onClick={() => navigate('/stat-details/total-given')} className="glass-panel" style={{ cursor: 'pointer', padding: '16px', background: 'white', borderLeft: '4px solid #FFC107' }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>💰</span>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFC107', margin: '0 0 4px 0' }}>
                ₹{cards?.totalGiven?.toLocaleString() || 0}
              </p>
              <h3 style={{ color: '#6B7280', fontSize: '12px', fontWeight: '500', margin: 0 }}>Total Given</h3>
            </div>

            <div onClick={() => navigate('/stat-details/invested-amount')} className="glass-panel" style={{ cursor: 'pointer', padding: '16px', background: 'white', borderLeft: '4px solid #10B981' }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>💸</span>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981', margin: '0 0 4px 0' }}>
                ₹{cards?.totalInvested?.toLocaleString() || 0}
              </p>
              <h3 style={{ color: '#6B7280', fontSize: '12px', fontWeight: '500', margin: 0 }}>Invested Amount</h3>
            </div>

            <div onClick={() => navigate('/stat-details/total-pending')} className="glass-panel" style={{ cursor: 'pointer', padding: '16px', background: 'white', borderLeft: '4px solid #FFC107' }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>⏳</span>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFC107', margin: '0 0 4px 0' }}>
                ₹{cards?.totalPending?.toLocaleString() || 0}
              </p>
              <h3 style={{ color: '#6B7280', fontSize: '12px', fontWeight: '500', margin: 0 }}>Total Pending</h3>
            </div>

            {/* --- COLLECTIONS & CASH --- */}
            <div onClick={() => navigate('/stat-details/total-collected')} className="glass-panel" style={{ cursor: 'pointer', padding: '16px', background: 'white', borderLeft: '4px solid #FFC107' }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>✔️</span>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFC107', margin: '0 0 4px 0' }}>
                ₹{cards?.totalCollected?.toLocaleString() || 0}
              </p>
              <h3 style={{ color: '#6B7280', fontSize: '12px', fontWeight: '500', margin: 0 }}>Total Collected</h3>
            </div>

            <div onClick={() => navigate('/expenses')} className="glass-panel" style={{ cursor: 'pointer', padding: '16px', background: 'white', borderLeft: '4px solid #EF4444' }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>📉</span>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#EF4444', margin: '0 0 4px 0' }}>
                ₹{cards?.totalExpenses?.toLocaleString() || 0}
              </p>
              <h3 style={{ color: '#6B7280', fontSize: '12px', fontWeight: '500', margin: 0 }}>Total Expenses</h3>
            </div>

            <div onClick={() => navigate('/stat-details/in-hand-cash')} className="glass-panel" style={{ cursor: 'pointer', padding: '16px', background: 'white', borderLeft: '4px solid #10B981' }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>💵</span>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981', margin: '0 0 4px 0' }}>
                ₹{cards?.inHandCash?.toLocaleString() || 0}
              </p>
              <h3 style={{ color: '#6B7280', fontSize: '12px', fontWeight: '500', margin: 0 }}>In Hand Cash</h3>
            </div>

            <div onClick={() => navigate('/stat-details/weekly-collection')} className="glass-panel" style={{ cursor: 'pointer', padding: '16px', background: 'white', borderLeft: '4px solid #FFC107' }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>🏦</span>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFC107', margin: '0 0 4px 0' }}>
                ₹{cards?.weeklyCollection?.toLocaleString() || 0}
              </p>
              <h3 style={{ color: '#6B7280', fontSize: '12px', fontWeight: '500', margin: 0 }}>Weekly Collection</h3>
            </div>

            <div onClick={() => navigate('/stat-details/monthly-collection')} className="glass-panel" style={{ cursor: 'pointer', padding: '16px', background: 'white', borderLeft: '4px solid #FFC107' }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>📅</span>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFC107', margin: '0 0 4px 0' }}>
                ₹{cards?.monthlyCollection?.toLocaleString() || 0}
              </p>
              <h3 style={{ color: '#6B7280', fontSize: '12px', fontWeight: '500', margin: 0 }}>Monthly Collection</h3>
            </div>

            <div onClick={() => navigate('/stat-details/yearly-collection')} className="glass-panel" style={{ cursor: 'pointer', padding: '16px', background: 'white', borderLeft: '4px solid #FFC107' }}>
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>📊</span>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFC107', margin: '0 0 4px 0' }}>
                ₹{cards?.yearlyCollection?.toLocaleString() || 0}
              </p>
              <h3 style={{ color: '#6B7280', fontSize: '12px', fontWeight: '500', margin: 0 }}>Yearly Collection</h3>
            </div>

          </div>
        </>
      )}

    </div>
  );
};

export default AdminDashboard;
