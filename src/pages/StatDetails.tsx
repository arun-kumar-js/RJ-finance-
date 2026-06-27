import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const StatDetails = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedLineId(null);
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
        } else if (type === 'total-pending') {
          const res = await API.get('/dashboard/total-pending-by-line');
          setData(res.data);
        } else if (type === 'total-collected') {
          const res = await API.get('/dashboard/total-collected-by-line');
          setData(res.data);
        } else if (type === 'collection-cash') {
          const res = await API.get('/dashboard/collection-cash-by-line');
          setData(res.data);
        } else if (type === 'invested-amount') {
          const res = await API.get('/dashboard/total-invested-by-line');
          setData(res.data);
        } else if (type === 'overdue-emis') {
          const res = await API.get('/dashboard/overdue-emis-by-line');
          setData(res.data);
        } else if (type === 'overdue-loans') {
          const res = await API.get('/dashboard/overdue-loans-by-line');
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

    if (type === 'total-pending') {
      if (data.length === 0) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>No total pending data found per line.</div>;
      }
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {data.map((item, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '20px', background: 'white', borderLeft: '4px solid #FFC107', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '32px', marginBottom: '8px' }}>⏳</span>
              <h3 style={{ color: '#1E293B', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', textAlign: 'center' }}>{item.lineName}</h3>
              <p style={{ color: '#FFC107', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>₹{item.totalPending?.toLocaleString() || 0}</p>
              <span style={{ color: '#6B7280', fontSize: '12px' }}>Total Pending</span>
            </div>
          ))}
        </div>
      );
    }

    if (type === 'total-collected') {
      if (data.length === 0) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>No total collected data found per line.</div>;
      }
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {data.map((item, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '20px', background: 'white', borderLeft: '4px solid #FFC107', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '32px', marginBottom: '8px' }}>✔️</span>
              <h3 style={{ color: '#1E293B', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', textAlign: 'center' }}>{item.lineName}</h3>
              <p style={{ color: '#FFC107', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>₹{item.totalCollected?.toLocaleString() || 0}</p>
              <span style={{ color: '#6B7280', fontSize: '12px' }}>Total Collected</span>
            </div>
          ))}
        </div>
      );
    }

    if (type === 'collection-cash') {
      if (data.length === 0) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>No collection cash data found per line.</div>;
      }
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {data.map((item, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '20px', background: 'white', borderLeft: '4px solid #10B981', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '32px', marginBottom: '8px' }}>💵</span>
              <h3 style={{ color: '#1E293B', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', textAlign: 'center' }}>{item.lineName}</h3>
              <p style={{ color: '#10B981', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>₹{item.collectionCash?.toLocaleString() || 0}</p>
              <span style={{ color: '#6B7280', fontSize: '12px' }}>Collection Cash</span>
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

    if (type === 'overdue-emis') {
      if (data.length === 0) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>No overdue EMIs found.</div>;
      }

      if (selectedLineId) {
        const selectedLine = data.find(item => item.lineId === selectedLineId);
        if (!selectedLine || selectedLine.overdueDetails.length === 0) {
          return (
            <div style={{ padding: '24px', background: 'white', borderRadius: '12px' }}>
              <button onClick={() => setSelectedLineId(null)} style={{ marginBottom: '16px', background: '#F3F4F6', border: 'none', color: '#4B5563', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                ← Back to Lines
              </button>
              <div style={{ textAlign: 'center', color: '#6B7280', padding: '20px' }}>No overdue EMI details found for this line.</div>
            </div>
          );
        }

        return (
          <div className="glass-panel animate-fade-in" style={{ background: 'white', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1E293B', margin: 0 }}>
                📍 {selectedLine.lineName} - Overdue Details
              </h2>
              <button onClick={() => setSelectedLineId(null)} style={{ background: '#F3F4F6', border: 'none', color: '#4B5563', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                ← Back to Lines
              </button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 'bold', fontSize: '14px' }}>Customer</th>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 'bold', fontSize: '14px' }}>Bond No.</th>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>Installment</th>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 'bold', fontSize: '14px' }}>Due Date</th>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 'bold', fontSize: '14px', textAlign: 'right' }}>Pending Amount</th>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLine.overdueDetails.map((emi: any, idx: number) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div 
                          onClick={() => emi.loanId && navigate(`/loans/${emi.loanId}`)}
                          style={{ fontWeight: '600', color: '#3B82F6', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          {emi.customerName}
                        </div>
                        {emi.phone && <div style={{ fontSize: '12px', color: '#6B7280' }}>{emi.phone}</div>}
                      </td>
                      <td 
                        onClick={() => emi.loanId && navigate(`/loans/${emi.loanId}`)}
                        style={{ padding: '12px 16px', color: '#3B82F6', fontFamily: 'monospace', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        {emi.bondNumber || 'N/A'}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#4B5563', textAlign: 'center' }}>
                        #{emi.installmentNumber}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#EF4444', fontWeight: '500' }}>
                        {new Date(emi.dueDate).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#EF4444', fontWeight: 'bold', textAlign: 'right' }}>
                        ₹{emi.pendingAmount?.toLocaleString() || 0}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        {emi.phone ? (
                          <a href={`tel:${emi.phone}`} style={{ textDecoration: 'none', background: '#EF4444', color: 'white', padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            📞 Call
                          </a>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>No Phone</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {data.map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => item.overdueEmiCount > 0 && setSelectedLineId(item.lineId)} 
              className="glass-panel" 
              style={{ 
                padding: '20px', 
                background: 'white', 
                borderLeft: '4px solid #EF4444', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                cursor: item.overdueEmiCount > 0 ? 'pointer' : 'default',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              <span style={{ fontSize: '32px', marginBottom: '8px' }}>📍</span>
              <h3 style={{ color: '#1E293B', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', textAlign: 'center' }}>{item.lineName}</h3>
              <p style={{ color: '#EF4444', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{item.overdueEmiCount}</p>
              <span style={{ color: '#6B7280', fontSize: '12px', marginBottom: '8px' }}>Overdue EMIs</span>
              {item.overdueEmiCount > 0 && (
                <span style={{ color: '#3B82F6', fontSize: '12px', fontWeight: 'bold' }}>Click to view details →</span>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (type === 'overdue-loans') {
      if (data.length === 0) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>No overdue loans found (&gt;25 weeks).</div>;
      }

      if (selectedLineId) {
        const selectedLine = data.find(item => item.lineId === selectedLineId);
        if (!selectedLine || selectedLine.loans.length === 0) {
          return (
            <div style={{ padding: '24px', background: 'white', borderRadius: '12px' }}>
              <button onClick={() => setSelectedLineId(null)} style={{ marginBottom: '16px', background: '#F3F4F6', border: 'none', color: '#4B5563', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                ← Back to Lines
              </button>
              <div style={{ textAlign: 'center', color: '#6B7280', padding: '20px' }}>No overdue loan details found for this line.</div>
            </div>
          );
        }

        return (
          <div className="glass-panel animate-fade-in" style={{ background: 'white', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1E293B', margin: 0 }}>
                📍 {selectedLine.lineName} - Overdue Loans (&gt;25 Weeks)
              </h2>
              <button onClick={() => setSelectedLineId(null)} style={{ background: '#F3F4F6', border: 'none', color: '#4B5563', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                ← Back to Lines
              </button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 'bold', fontSize: '14px' }}>Customer</th>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 'bold', fontSize: '14px' }}>Bond No.</th>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>Weeks Elapsed</th>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 'bold', fontSize: '14px' }}>Start Date</th>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 'bold', fontSize: '14px', textAlign: 'right' }}>Loan Amount</th>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 'bold', fontSize: '14px', textAlign: 'right' }}>Pending Amount</th>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLine.loans.map((loan: any, idx: number) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div 
                          onClick={() => loan.loanId && navigate(`/loans/${loan.loanId}`)}
                          style={{ fontWeight: '600', color: '#3B82F6', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          {loan.customerName}
                        </div>
                        {loan.phone && <div style={{ fontSize: '12px', color: '#6B7280' }}>{loan.phone}</div>}
                      </td>
                      <td 
                        onClick={() => loan.loanId && navigate(`/loans/${loan.loanId}`)}
                        style={{ padding: '12px 16px', color: '#3B82F6', fontFamily: 'monospace', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        {loan.bondNumber || 'N/A'}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#EF4444', fontWeight: '600', textAlign: 'center' }}>
                        {loan.weeksElapsed} weeks
                      </td>
                      <td style={{ padding: '12px 16px', color: '#4B5563' }}>
                        {new Date(loan.startDate).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#1E293B', textAlign: 'right' }}>
                        ₹{loan.loanAmount?.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#EF4444', fontWeight: 'bold', textAlign: 'right' }}>
                        ₹{loan.totalPending?.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        {loan.phone ? (
                          <a href={`tel:${loan.phone}`} style={{ textDecoration: 'none', background: '#EF4444', color: 'white', padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            📞 Call
                          </a>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>No Phone</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {data.map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => item.overdueLoanCount > 0 && setSelectedLineId(item.lineId)} 
              className="glass-panel" 
              style={{ 
                padding: '20px', 
                background: 'white', 
                borderLeft: '4px solid #EF4444', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                cursor: item.overdueLoanCount > 0 ? 'pointer' : 'default',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              <span style={{ fontSize: '32px', marginBottom: '8px' }}>📍</span>
              <h3 style={{ color: '#1E293B', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', textAlign: 'center' }}>{item.lineName}</h3>
              <p style={{ color: '#EF4444', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{item.overdueLoanCount}</p>
              <span style={{ color: '#6B7280', fontSize: '12px', marginBottom: '8px' }}>Overdue Loans (&gt;25W)</span>
              {item.overdueLoanCount > 0 && (
                <span style={{ color: '#3B82F6', fontSize: '12px', fontWeight: 'bold' }}>Click to view details →</span>
              )}
            </div>
          ))}
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
