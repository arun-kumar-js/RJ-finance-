import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const StatDetails = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (type === 'active-loans') {
          const res = await API.get('/dashboard/active-loans-by-line');
          setData(res.data);
        } else if (type === 'closed-loans') {
          const res = await API.get('/dashboard/closed-loans-by-line');
          setData(res.data);
        } else if (type === 'total-given') {
          const res = await API.get('/dashboard/total-given-by-line');
          setData(res.data);
        } else if (type === 'invested-amount') {
          const res = await API.get('/dashboard/total-invested-by-line');
          setData(res.data);
        } else if (type === 'weekly-collection') {
          const res = await API.get('/dashboard/weekly-collections-breakdown');
          setData(res.data);
        } else if (type === 'monthly-collection') {
          const res = await API.get('/dashboard/monthly-collections-breakdown');
          setData(res.data);
        } else if (type === 'yearly-collection') {
          const res = await API.get('/dashboard/yearly-collections-breakdown');
          setData(res.data);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type]);

  const renderContent = () => {
    if (loading) {
      return <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Loading...</div>;
    }

    if (type === 'active-loans') {
      if (data.length === 0) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>No active loans found per line.</div>;
      }
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {data.map((item, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '20px', background: 'white', borderLeft: '4px solid #10B981', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '32px', marginBottom: '8px' }}>📍</span>
              <h3 style={{ color: '#1E293B', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', textAlign: 'center' }}>{item.lineName}</h3>
              <p style={{ color: '#10B981', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{item.activeLoanCount}</p>
              <span style={{ color: '#6B7280', fontSize: '12px' }}>Active Loans</span>
            </div>
          ))}
        </div>
      );
    }

    if (type === 'closed-loans') {
      if (data.length === 0) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>No closed loans found per line.</div>;
      }
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {data.map((item, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '20px', background: 'white', borderLeft: '4px solid #3B82F6', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '32px', marginBottom: '8px' }}>📍</span>
              <h3 style={{ color: '#1E293B', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', textAlign: 'center' }}>{item.lineName}</h3>
              <p style={{ color: '#3B82F6', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{item.closedLoanCount}</p>
              <span style={{ color: '#6B7280', fontSize: '12px' }}>Closed Loans</span>
            </div>
          ))}
        </div>
      );
    }

    if (type === 'total-given') {
      if (data.length === 0) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>No total given data found per line.</div>;
      }
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {data.map((item, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '20px', background: 'white', borderLeft: '4px solid #FFC107', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '32px', marginBottom: '8px' }}>💰</span>
              <h3 style={{ color: '#1E293B', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', textAlign: 'center' }}>{item.lineName}</h3>
              <p style={{ color: '#FFC107', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>₹{item.totalGiven?.toLocaleString() || 0}</p>
              <span style={{ color: '#6B7280', fontSize: '12px' }}>Total Given</span>
            </div>
          ))}
        </div>
      );
    }

    if (type === 'invested-amount') {
      if (data.length === 0) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>No total invested data found per line.</div>;
      }
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {data.map((item, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '20px', background: 'white', borderLeft: '4px solid #8B5CF6', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '32px', marginBottom: '8px' }}>🏦</span>
              <h3 style={{ color: '#1E293B', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', textAlign: 'center' }}>{item.lineName}</h3>
              <p style={{ color: '#8B5CF6', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>₹{item.totalInvested?.toLocaleString() || 0}</p>
              <span style={{ color: '#6B7280', fontSize: '12px', marginBottom: '12px' }}>Total Invested</span>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#10B981' }}>{item.activeLoanCount || 0}</span>
                  <span style={{ fontSize: '10px', color: '#6B7280' }}>Active</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#3B82F6' }}>{item.closedLoanCount || 0}</span>
                  <span style={{ fontSize: '10px', color: '#6B7280' }}>Closed</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (type === 'weekly-collection') {
      if (data.length === 0) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>No weekly collection data found.</div>;
      }
      return (
        <div className="glass-panel" style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 'bold', fontSize: '14px' }}>Week</th>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 'bold', fontSize: '14px', textAlign: 'right' }}>Total Collected</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '16px', color: '#1E293B', fontWeight: '500' }}>{item.label}</td>
                  <td style={{ padding: '16px', color: '#10B981', fontWeight: 'bold', textAlign: 'right' }}>₹{item.totalAmount?.toLocaleString() || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (type === 'monthly-collection' || type === 'yearly-collection') {
      const titleLabel = type === 'monthly-collection' ? 'Month' : 'Year';
      if (data.length === 0) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>No {titleLabel.toLowerCase()}ly collection data found.</div>;
      }
      return (
        <div className="glass-panel" style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 'bold', fontSize: '14px' }}>{titleLabel}</th>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 'bold', fontSize: '14px', textAlign: 'right' }}>Total Collected</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '16px', color: '#1E293B', fontWeight: '500' }}>{item.label}</td>
                  <td style={{ padding: '16px', color: '#10B981', fontWeight: 'bold', textAlign: 'right' }}>₹{item.totalAmount?.toLocaleString() || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Default fallback for other types
    return (
      <div className="glass-panel" style={{ padding: '24px', background: 'white' }}>
        <p style={{ color: '#6B7280' }}>Waiting for configuration on what to display for {type}.</p>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>←</span> Back
      </button>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '16px', textTransform: 'capitalize' }}>
        {type?.replace(/-/g, ' ')} Details
      </h1>
      {renderContent()}
    </div>
  );
};
export default StatDetails;
