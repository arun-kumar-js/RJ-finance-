import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserStats } from '../services/adminService';

const formatINR = (amount: number) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (id) {
          const res = await getUserStats(id);
          setData(res);
        }
      } catch (err) {
        console.error('Error fetching user stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [id]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading user details...</div>;
  }

  if (!data || !data.user) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#EF4444' }}>
        <h2>User not found or error loading data.</h2>
        <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginTop: '20px' }}>Go Back</button>
      </div>
    );
  }

  const { user, stats } = data;
  const isCollector = user.role === 'collector';

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px', maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ width: '36px', height: '36px', backgroundColor: '#F1F5F9', color: '#1E293B', borderRadius: '18px', border: 'none', fontSize: '24px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '4px' }}
        >
          ‹
        </button>
        <h1 style={{ color: '#1E293B', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{user.name}</h1>
      </div>

      {/* Profile Card */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '40px', backgroundColor: '#E2E8F0', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '32px', fontWeight: 'bold', color: '#64748B', marginBottom: '16px' }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#1E293B' }}>{user.name}</h2>
        <p style={{ margin: '0 0 16px 0', color: '#64748B', fontSize: '16px' }}>📞 {user.mobile}</p>
        <div style={{ backgroundColor: '#EEF2FF', padding: '6px 16px', borderRadius: '12px', color: '#6366F1', fontWeight: 'bold', fontSize: '12px' }}>
          {user.role.toUpperCase()}
        </div>
      </div>

      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1E293B', marginBottom: '16px' }}>Statistics</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {isCollector ? (
          <>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid var(--border)', borderLeft: '4px solid #6366F1' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>👥</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#6366F1', marginBottom: '4px' }}>{stats.customersCount || 0}</div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>Total Customers</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid var(--border)', borderLeft: '4px solid #10B981' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏦</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10B981', marginBottom: '4px' }}>{formatINR(stats.todayCollectionAmount)}</div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>Today's Collection</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid var(--border)', borderLeft: '4px solid #EF4444' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#EF4444', marginBottom: '4px' }}>{formatINR(stats.totalPendingAmount)}</div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>Pending in Lines</div>
            </div>
          </>
        ) : (
          <>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid var(--border)', borderLeft: '4px solid #6366F1' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>💳</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#6366F1', marginBottom: '4px' }}>{stats.activeLoansCount || 0}</div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>Active Loans</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid var(--border)', borderLeft: '4px solid #EAB308' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>💰</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#EAB308', marginBottom: '4px' }}>{formatINR(stats.totalGivenAmount)}</div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>Total Given</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid var(--border)', borderLeft: '4px solid #10B981' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>✔️</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10B981', marginBottom: '4px' }}>{formatINR(stats.totalCollectedAmount)}</div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>Total Collected</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid var(--border)', borderLeft: '4px solid #EF4444' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#EF4444', marginBottom: '4px' }}>{formatINR(stats.totalPendingAmount)}</div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>Total Pending</div>
            </div>
          </>
        )}
      </div>

      {isCollector && user.assignedLines && user.assignedLines.length > 0 && (
        <>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1E293B', marginBottom: '16px' }}>Assigned Lines</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {user.assignedLines.map((line: any) => (
              <div key={line._id} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid var(--border)', borderLeft: '4px solid #6366F1' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#1E293B' }}>{line.lineName}</h4>
                {line.description && <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>{line.description}</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserDetails;
