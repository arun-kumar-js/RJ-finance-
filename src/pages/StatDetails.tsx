import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useTranslation } from '../hooks/useTranslation';
import CollectionSheetModal from '../components/CollectionSheetModal';

const StatDetails = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const [data, setData] = useState<any[]>([]);
  const [cashFlowMeta, setCashFlowMeta] = useState<any>(null);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [weekSearch, setWeekSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'completed' | 'all' | 'active'>('completed');
  const [loading, setLoading] = useState(true);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [selectedOverdueWeek, setSelectedOverdueWeek] = useState<string | null>(null);
  const [printModalLine, setPrintModalLine] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    setSelectedLineId(null);
    setSelectedOverdueWeek(null);
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
        } else if (type === 'weekly-cashflow') {
          const res = await API.get('/dashboard/weekly-cashflow-breakdown');
          setCashFlowMeta(res.data);
          setData(res.data.weeks || []);
          if (res.data.currentWeek) {
            setExpandedWeek(res.data.currentWeek);
          }
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {data.map((item, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '20px', background: 'white', borderLeft: '4px solid #10B981', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '32px', marginBottom: '8px' }}>📍</span>
              <h3 style={{ color: '#1E293B', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', textAlign: 'center' }}>{item.lineName}</h3>
              <p style={{ color: '#10B981', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{item.activeLoanCount}</p>
              <span style={{ color: '#6B7280', fontSize: '12px', marginBottom: '12px' }}>Active Loans</span>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPrintModalLine({ id: item.lineId, name: item.lineName });
                }}
                style={{
                  width: '100%',
                  backgroundColor: '#EEF2FF',
                  color: '#4F46E5',
                  border: '1px solid #C7D2FE',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#E0E7FF')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#EEF2FF')}
              >
                <span>🖨️</span> Print Sheet
              </button>
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

    if (type === 'weekly-cashflow') {
      const filteredWeeks = data.filter(item => {
        if (filterMode === 'completed' && !item.isCompleted) return false;
        if (filterMode === 'active' && !item.hasActivity) return false;
        if (weekSearch.trim()) {
          const q = weekSearch.trim().toLowerCase();
          return (
            item.weekNumber.toString().includes(q) ||
            item.label.toLowerCase().includes(q) ||
            item.dateRange.toLowerCase().includes(q)
          );
        }
        return true;
      });

      const formatCurrency = (val: number) => {
        const n = Number(val || 0);
        if (n < 0) return `- ₹${Math.abs(n).toLocaleString('en-IN')}`;
        return `₹${n.toLocaleString('en-IN')}`;
      };

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Executive Summary Banner */}
          {cashFlowMeta && (
            <div style={{ background: '#0F172A', padding: '24px 28px', borderRadius: '16px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38BDF8' }} />
                  <span style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                    {language === 'ta' ? `நிதியாண்டு ${cashFlowMeta.year} தணிக்கை` : `FY ${cashFlowMeta.year} AUDIT LEDGER`}
                  </span>
                </div>
                <div style={{ color: '#64748B', fontSize: '11px', fontWeight: '600', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                  {language === 'ta' ? 'தற்போதைய நிகர கையிருப்பு' : 'CURRENT NET HAND CASH'}
                </div>
                <h2 style={{ fontSize: '36px', fontWeight: '800', margin: '4px 0 6px 0', letterSpacing: '-0.5px', color: Number(cashFlowMeta.latestHandCash || 0) >= 0 ? '#34D399' : '#F87171' }}>
                  {formatCurrency(cashFlowMeta.latestHandCash)}
                </h2>
                <span style={{ color: '#94A3B8', fontSize: '13px' }}>
                  {language === 'ta' ? 'அனைத்து வரவு மற்றும் செலவுகளுக்குப் பிந்தைய தணிக்கைக் கணக்கு' : 'Audited closing balance carried across all lines'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ backgroundColor: '#1E293B', color: '#38BDF8', border: '1px solid #334155', padding: '8px 18px', borderRadius: '24px', fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px' }}>
                  {language === 'ta'
                    ? `${cashFlowMeta.completedWeeksCount || 0} வாரங்கள் முடிந்தது`
                    : `${cashFlowMeta.completedWeeksCount || 0} WEEKS COMPLETED`}
                </div>
              </div>
            </div>
          )}

          {/* Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <input
                type="text"
                placeholder={language === 'ta' ? 'வார எண் தேடுக (எ.கா: 32)...' : 'Search week (e.g. 32)...'}
                value={weekSearch}
                onChange={(e) => setWeekSearch(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', backgroundColor: 'white' }}
              />
              {weekSearch && (
                <button
                  onClick={() => setWeekSearch('')}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ✕
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setFilterMode('completed')}
                style={{ padding: '10px 16px', borderRadius: '10px', border: filterMode === 'completed' ? '1px solid #0F172A' : '1px solid #CBD5E1', backgroundColor: filterMode === 'completed' ? '#0F172A' : 'white', color: filterMode === 'completed' ? 'white' : '#475569', fontWeight: '700', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' }}
              >
                {language === 'ta' ? 'முடிந்த வாரங்கள்' : 'Completed Weeks'}
              </button>
              <button
                onClick={() => setFilterMode('all')}
                style={{ padding: '10px 16px', borderRadius: '10px', border: filterMode === 'all' ? '1px solid #0F172A' : '1px solid #CBD5E1', backgroundColor: filterMode === 'all' ? '#0F172A' : 'white', color: filterMode === 'all' ? 'white' : '#475569', fontWeight: '700', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' }}
              >
                {language === 'ta' ? 'நடப்பு வாரம் உட்பட' : 'Include Current'}
              </button>
              <button
                onClick={() => setFilterMode('active')}
                style={{ padding: '10px 16px', borderRadius: '10px', border: filterMode === 'active' ? '1px solid #0F172A' : '1px solid #CBD5E1', backgroundColor: filterMode === 'active' ? '#0F172A' : 'white', color: filterMode === 'active' ? 'white' : '#475569', fontWeight: '700', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' }}
              >
                {language === 'ta' ? 'செயல்பாடு மட்டும்' : 'Active Only'}
              </button>
            </div>
          </div>

          {/* Weeks Cards Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredWeeks.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: '#64748B', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                {language === 'ta' ? 'பொருந்தும் வாரங்கள் எதுவும் இல்லை' : 'No matching weeks found'}
              </div>
            ) : (
              filteredWeeks.map((item: any) => {
                const isExpanded = expandedWeek === item.weekNumber;
                const isPositive = Number(item.nowOverallHandCash || 0) >= 0;
                const totalOutflows = Number(item.loansGiven || 0) + Number(item.expenses || 0);

                return (
                  <div
                    key={item.weekNumber}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '14px',
                      border: item.isCurrentWeek ? '1px solid #93C5FD' : '1px solid #E2E8F0',
                      borderLeft: item.isCurrentWeek ? '4px solid #3B82F6' : item.hasActivity ? '4px solid #10B981' : '#CBD5E1',
                      boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
                      overflow: 'hidden',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div
                      onClick={() => setExpandedWeek(isExpanded ? null : item.weekNumber)}
                      style={{
                        padding: '16px 22px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        backgroundColor: item.isCurrentWeek ? '#F8FAFC' : 'white'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>{item.label}</span>
                          {item.isCurrentWeek && (
                            <span style={{ backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '700', letterSpacing: '0.4px' }}>
                              {language === 'ta' ? 'நடப்பு வாரம்' : 'CURRENT'}
                            </span>
                          )}
                          {item.isCompleted && (
                            <span style={{ backgroundColor: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '700', letterSpacing: '0.4px' }}>
                              {language === 'ta' ? 'முடிந்தது' : 'COMPLETED'}
                            </span>
                          )}
                          {item.hasActivity && !item.isCurrentWeek && (
                            <span style={{ backgroundColor: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '700', letterSpacing: '0.4px' }}>
                              {language === 'ta' ? 'செயல்பாடு' : 'ACTIVE'}
                            </span>
                          )}
                        </div>
                        <span style={{ color: '#64748B', fontSize: '12px', fontWeight: '500' }}>{item.dateRange}</span>
                      </div>

                      <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div>
                          <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                            {language === 'ta' ? 'நிகர இருப்பு' : 'NET CASH'}
                          </div>
                          <div style={{ fontSize: '18px', fontWeight: '800', color: isPositive ? '#059669' : '#DC2626', marginTop: '2px' }}>
                            {formatCurrency(item.nowOverallHandCash)}
                          </div>
                        </div>
                        <div style={{ width: '28px', height: '28px', borderRadius: '14px', backgroundColor: isExpanded ? '#0F172A' : '#F1F5F9', color: isExpanded ? 'white' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                          {isExpanded ? '⌃' : '⌄'}
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ backgroundColor: '#F8FAFC', padding: '20px 22px', borderTop: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#475569', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                            {language === 'ta' ? `${item.label} • ரொக்க அறிக்கை` : `${item.label.toUpperCase()} • FINANCIAL STATEMENT`}
                          </span>
                          <span style={{ fontSize: '12px', color: '#94A3B8' }}>{item.dateRange}</span>
                        </div>

                        {/* Statement Layout Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                          {/* Module 1: Inflows & Opening */}
                          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingBottom: '8px', borderBottom: '1px solid #F1F5F9' }}>
                              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669' }} />
                              <span style={{ fontSize: '11px', fontWeight: '700', color: '#0F172A', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                                {language === 'ta' ? 'வரவு மற்றும் தொடக்க இருப்பு' : 'CASH INFLOWS & OPENING'}
                              </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>
                                  {language === 'ta' ? 'முந்தைய தொடக்க கையிருப்பு' : 'Opening Cash in Hand'}
                                </div>
                                <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                                  {language === 'ta' ? 'முந்தைய வாரத்திலிருந்து வந்தது' : 'Brought forward from previous week'}
                                </div>
                              </div>
                              <span style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>
                                {formatCurrency(item.previousHandCash)}
                              </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>
                                  {language === 'ta' ? 'அந்த வார வசூல்' : 'Weekly Collections Received'}
                                </div>
                                <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                                  {language === 'ta' ? 'வாடிக்கையாளர் தவணை வசூல்' : 'Borrower repayments collected'}
                                </div>
                              </div>
                              <span style={{ fontSize: '14px', fontWeight: '700', color: '#059669' }}>
                                + ₹{Number(item.collectedCash || 0).toLocaleString('en-IN')}
                              </span>
                            </div>

                            {item.investments > 0 && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>
                                    {language === 'ta' ? 'முதலீடு / கூடுதல் பணம்' : 'Capital Added / Investment'}
                                  </div>
                                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                                    {language === 'ta' ? 'தொழிலில் சேர்க்கப்பட்ட தொகை' : 'Direct capital injection'}
                                  </div>
                                </div>
                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#2563EB' }}>
                                  + ₹{Number(item.investments || 0).toLocaleString('en-IN')}
                                </span>
                              </div>
                            )}

                            <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '8px 10px', borderRadius: '8px' }}>
                              <span style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>
                                {language === 'ta' ? 'மொத்த கிடைக்கும் ரொக்கம்' : 'Gross Available Cash'}
                              </span>
                              <span style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>
                                {formatCurrency(item.total)}
                              </span>
                            </div>
                          </div>

                          {/* Module 2: Outflows & Deductions */}
                          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingBottom: '8px', borderBottom: '1px solid #F1F5F9' }}>
                              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#E11D48' }} />
                              <span style={{ fontSize: '11px', fontWeight: '700', color: '#0F172A', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                                {language === 'ta' ? 'செலவு மற்றும் கடன் வழங்கல்' : 'CASH OUTFLOWS & DISBURSEMENTS'}
                              </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>
                                  {language === 'ta' ? 'புதிய கடன் வழங்கல்' : 'New Loans Disbursed'}
                                </div>
                                <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                                  {language === 'ta' ? 'வாடிக்கையாளருக்கு வழங்கிய தொகை' : 'Principal disbursed to clients'}
                                </div>
                              </div>
                              <span style={{ fontSize: '14px', fontWeight: '700', color: '#D97706' }}>
                                - ₹{Number(item.loansGiven || 0).toLocaleString('en-IN')}
                              </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>
                                  {language === 'ta' ? 'சம்பளம் மற்றும் அலுவலக செலவுகள்' : 'Expenses & Salaries'}
                                </div>
                                <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                                  {language === 'ta' ? 'ஊழியர் ஊதியம் மற்றும் பிற செலவு' : 'Staff payroll, petrol & operations'}
                                </div>
                              </div>
                              <span style={{ fontSize: '14px', fontWeight: '700', color: '#DC2626' }}>
                                - ₹{Number(item.expenses || 0).toLocaleString('en-IN')}
                              </span>
                            </div>

                            <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #FECDD3', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF1F2', padding: '8px 10px', borderRadius: '8px' }}>
                              <span style={{ fontSize: '12px', fontWeight: '700', color: '#9F1239' }}>
                                {language === 'ta' ? 'மொத்த வாரச் செலவுகள்' : 'Total Weekly Deductions'}
                              </span>
                              <span style={{ fontSize: '15px', fontWeight: '800', color: '#BE123C' }}>
                                - ₹{totalOutflows.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Module 3: Closing Position Hero Banner */}
                        <div style={{ marginTop: '14px', background: '#0F172A', borderRadius: '12px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', flexWrap: 'wrap', gap: '12px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                                {language === 'ta' ? 'நிகர இறுதி கையிருப்பு' : 'CLOSING CASH IN HAND'}
                              </span>
                              <span style={{ backgroundColor: isPositive ? 'rgba(52, 211, 153, 0.15)' : 'rgba(248, 113, 113, 0.15)', color: isPositive ? '#34D399' : '#F87171', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>
                                {isPositive ? (language === 'ta' ? 'கையிருப்பு' : 'SURPLUS') : (language === 'ta' ? 'பற்றாக்குறை' : 'DEFICIT')}
                              </span>
                            </div>
                            <span style={{ fontSize: '12px', color: '#64748B' }}>
                              {language === 'ta' ? 'அடுத்த வாரத்திற்கான தொடக்க இருப்பாக செல்லும்' : 'Carried forward as next week opening balance'}
                            </span>
                          </div>
                          <div style={{ fontSize: '24px', fontWeight: '800', color: isPositive ? '#34D399' : '#F87171', letterSpacing: '-0.3px' }}>
                            {formatCurrency(item.nowOverallHandCash)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      );
    }

    if (type === 'overdue-emis') {
      if (data.length === 0) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>No overdue EMIs found.</div>;
      }

      // Collect all overdue items based on line selection
      let lineFilteredItems: any[] = [];
      if (selectedLineId) {
        const line = data.find(item => item.lineId === selectedLineId);
        lineFilteredItems = line?.overdueDetails || [];
      } else {
        lineFilteredItems = data.flatMap(item => item.overdueDetails || []);
      }

      const totalOverdueCount = lineFilteredItems.length;
      const totalOverduePendingAmount = lineFilteredItems.reduce((sum, item) => sum + (item.pendingAmount || 0), 0);

      // Group into weeks
      const weekGroupsMap: Record<string, {
        key: string;
        weekNumber: number;
        year: number;
        ordinalLabel: string;
        dateRange: string;
        isThisWeek: boolean;
        totalPendingAmount: number;
        emis: any[];
      }> = {};

      lineFilteredItems.forEach(emi => {
        const d = new Date(emi.dueDate);
        const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        const dayNr = target.getUTCDay() || 7;
        target.setUTCDate(target.getUTCDate() + 4 - dayNr);
        const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((target.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
        const yr = target.getUTCFullYear();

        // Calculate Monday and Sunday for this ISO week
        const jan4 = new Date(Date.UTC(yr, 0, 4));
        const day = jan4.getUTCDay() || 7;
        const mondayWeek1 = new Date(jan4.getTime() - (day - 1) * 86400000);
        const monday = new Date(mondayWeek1.getTime() + (weekNo - 1) * 7 * 86400000);
        const sunday = new Date(monday.getTime() + 6 * 86400000);

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const startStr = `${String(monday.getUTCDate()).padStart(2, '0')} ${months[monday.getUTCMonth()]}`;
        const endStr = `${String(sunday.getUTCDate()).padStart(2, '0')} ${months[sunday.getUTCMonth()]} ${sunday.getUTCFullYear()}`;
        const dateRange = `${startStr} - ${endStr}`;

        // Current week calculation
        const now = new Date();
        const nowTarget = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
        const nowDayNr = nowTarget.getUTCDay() || 7;
        nowTarget.setUTCDate(nowTarget.getUTCDate() + 4 - nowDayNr);
        const nowYearStart = new Date(Date.UTC(nowTarget.getUTCFullYear(), 0, 1));
        const curWeekNo = Math.ceil((((nowTarget.getTime() - nowYearStart.getTime()) / 86400000) + 1) / 7);
        const curYear = nowTarget.getUTCFullYear();
        const isThisWeek = (yr === curYear && weekNo === curWeekNo);

        const getOrdinalSuffix = (n: number) => {
          const s = ['th', 'st', 'nd', 'rd'];
          const v = n % 100;
          return n + (s[(v - 20) % 10] || s[v] || s[0]);
        };

        const key = `${yr}-W${String(weekNo).padStart(2, '0')}`;
        if (!weekGroupsMap[key]) {
          weekGroupsMap[key] = {
            key,
            weekNumber: weekNo,
            year: yr,
            ordinalLabel: `${getOrdinalSuffix(weekNo)} Week`,
            dateRange,
            isThisWeek,
            totalPendingAmount: 0,
            emis: []
          };
        }

        weekGroupsMap[key].totalPendingAmount += (emi.pendingAmount || 0);
        weekGroupsMap[key].emis.push(emi);
      });

      // Sort weeks descending (most recent/current week first)
      const weekGroups = Object.values(weekGroupsMap).sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.weekNumber - a.weekNumber;
      });

      // If a specific week card is clicked, show ONLY that week's overdue EMI records
      if (selectedOverdueWeek) {
        const activeGroup = weekGroups.find(w => w.key === selectedOverdueWeek);
        if (!activeGroup || activeGroup.emis.length === 0) {
          return (
            <div style={{ padding: '24px', background: 'white', borderRadius: '12px' }}>
              <button 
                onClick={() => setSelectedOverdueWeek(null)} 
                style={{ marginBottom: '16px', background: '#F3F4F6', border: 'none', color: '#4B5563', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
              >
                ← Back to Weekly Breakdown
              </button>
              <div style={{ textAlign: 'center', color: '#6B7280', padding: '20px' }}>No overdue EMIs found for this week.</div>
            </div>
          );
        }

        return (
          <div className="glass-panel animate-fade-in" style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setSelectedOverdueWeek(null)} 
                style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#334155', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                ← Back to Weeks
              </button>
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                  🗓️ {activeGroup.ordinalLabel}
                  {activeGroup.isThisWeek && (
                    <span style={{ backgroundColor: '#FEE2E2', color: '#DC2626', fontSize: '12px', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
                      🔴 This Week
                    </span>
                  )}
                </h2>
                <span style={{ fontSize: '13px', color: '#64748B' }}>{activeGroup.dateRange}</span>
              </div>
            </div>

            {/* Week Summary Banner */}
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#991B1B', fontWeight: 'bold', textTransform: 'uppercase' }}>Overdue Installments</span>
                <div style={{ fontSize: '22px', fontWeight: '800', color: '#DC2626', marginTop: '2px' }}>
                  {activeGroup.emis.length} EMIs
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', color: '#991B1B', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Pending</span>
                <div style={{ fontSize: '22px', fontWeight: '800', color: '#DC2626', marginTop: '2px' }}>
                  ₹{activeGroup.totalPendingAmount.toLocaleString()}
                </div>
              </div>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '650px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 'bold', fontSize: '14px' }}>Customer</th>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 'bold', fontSize: '14px' }}>Line</th>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 'bold', fontSize: '14px' }}>Bond No.</th>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>Installment</th>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 'bold', fontSize: '14px' }}>Due Date</th>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 'bold', fontSize: '14px', textAlign: 'right' }}>Pending Amount</th>
                    <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeGroup.emis.map((emi: any, idx: number) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.15s' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div 
                          onClick={() => emi.loanId && navigate(`/loans/${emi.loanId}`)}
                          style={{ fontWeight: '600', color: '#3B82F6', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          {emi.customerName}
                        </div>
                        {emi.phone && <div style={{ fontSize: '12px', color: '#6B7280' }}>📞 {emi.phone}</div>}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {emi.lineName ? (
                          <span style={{ backgroundColor: '#EFF6FF', color: '#2563EB', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                            📍 {emi.lineName}
                          </span>
                        ) : '—'}
                      </td>
                      <td 
                        onClick={() => emi.loanId && navigate(`/loans/${emi.loanId}`)}
                        style={{ padding: '12px 16px', color: '#3B82F6', fontFamily: 'monospace', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        {emi.bondNumber || 'N/A'}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#4B5563', textAlign: 'center', fontWeight: '600' }}>
                        #{emi.installmentNumber}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#EF4444', fontWeight: '500' }}>
                        {new Date(emi.dueDate).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#EF4444', fontWeight: 'bold', textAlign: 'right', fontSize: '15px' }}>
                        ₹{emi.pendingAmount?.toLocaleString() || 0}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        {emi.phone ? (
                          <a href={`tel:${emi.phone}`} style={{ textDecoration: 'none', background: '#EF4444', color: 'white', padding: '6px 14px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
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

      // Default View: Weekly Breakdown Cards with Line Filter Chips
      return (
        <div>
          {/* Top Line Filter Bar */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setSelectedLineId(null); setSelectedOverdueWeek(null); }}
              style={{
                backgroundColor: selectedLineId === null ? '#1E3A5F' : '#FFF',
                color: selectedLineId === null ? '#FFF' : '#475569',
                border: selectedLineId === null ? '1px solid #1E3A5F' : '1px solid #CBD5E1',
                padding: '8px 16px',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>🌐 All Lines</span>
              <span style={{ backgroundColor: selectedLineId === null ? '#EF4444' : '#E2E8F0', color: selectedLineId === null ? '#FFF' : '#475569', padding: '1px 6px', borderRadius: '10px', fontSize: '11px' }}>
                {data.reduce((s, l) => s + (l.overdueEmiCount || 0), 0)}
              </span>
            </button>

            {data.map((line, idx) => (
              <button
                key={idx}
                onClick={() => { setSelectedLineId(line.lineId === selectedLineId ? null : line.lineId); setSelectedOverdueWeek(null); }}
                style={{
                  backgroundColor: selectedLineId === line.lineId ? '#1E3A5F' : '#FFF',
                  color: selectedLineId === line.lineId ? '#FFF' : '#475569',
                  border: selectedLineId === line.lineId ? '1px solid #1E3A5F' : '1px solid #CBD5E1',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>📍 {line.lineName}</span>
                <span style={{ backgroundColor: selectedLineId === line.lineId ? '#EF4444' : '#E2E8F0', color: selectedLineId === line.lineId ? '#FFF' : '#475569', padding: '1px 6px', borderRadius: '10px', fontSize: '11px' }}>
                  {line.overdueEmiCount || 0}
                </span>
              </button>
            ))}
          </div>

          {/* Overall Stats Card */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 'bold', textTransform: 'uppercase' }}>
                {selectedLineId ? data.find(l => l.lineId === selectedLineId)?.lineName : 'Total Overdue'}
              </span>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#EF4444', marginTop: '2px' }}>
                {totalOverdueCount} Overdue EMIs
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Pending Amount</span>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#1E293B', marginTop: '2px' }}>
                ₹{totalOverduePendingAmount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Weekly Breakdown Grid Cards */}
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#334155', marginBottom: '16px' }}>
            📅 Weekly Overdue Breakdown ({weekGroups.length} Weeks)
          </h3>

          {weekGroups.length === 0 ? (
            <div style={{ background: 'white', padding: '32px', borderRadius: '12px', textAlign: 'center', color: '#6B7280' }}>
              No overdue EMIs for this selection.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {weekGroups.map((group, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedOverdueWeek(group.key)}
                  className="glass-panel animate-fade-in"
                  style={{
                    padding: '20px',
                    background: 'white',
                    borderRadius: '14px',
                    borderLeft: `5px solid ${group.isThisWeek ? '#EF4444' : '#F59E0B'}`,
                    border: group.isThisWeek ? '1px solid #FECACA' : '1px solid #E2E8F0',
                    borderLeftWidth: '5px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <h4 style={{ color: '#1E293B', fontSize: '16px', fontWeight: '800', margin: 0 }}>
                            🗓️ {group.ordinalLabel}
                          </h4>
                          {group.isThisWeek && (
                            <span style={{ backgroundColor: '#FEF2F2', color: '#EF4444', border: '1px solid #EF4444', fontSize: '10px', padding: '1px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                              🔴 This Week
                            </span>
                          )}
                        </div>
                        <span style={{ color: '#64748B', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                          {group.dateRange}
                        </span>
                      </div>

                      <div style={{ backgroundColor: group.isThisWeek ? '#FEE2E2' : '#FEF3C7', padding: '6px 12px', borderRadius: '10px', textAlign: 'center' }}>
                        <div style={{ color: group.isThisWeek ? '#DC2626' : '#D97706', fontSize: '18px', fontWeight: '800', lineHeight: 1 }}>
                          {group.emis.length}
                        </div>
                        <div style={{ color: group.isThisWeek ? '#DC2626' : '#D97706', fontSize: '10px', fontWeight: 'bold', marginTop: '2px' }}>
                          EMIs
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: '#64748B' }}>
                        Pending: <strong style={{ color: '#EF4444' }}>₹{group.totalPendingAmount.toLocaleString()}</strong>
                      </span>
                      <span style={{ color: '#3B82F6', fontSize: '12px', fontWeight: 'bold' }}>
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
        {type === 'weekly-cashflow'
          ? (language === 'ta' ? 'வாராந்திர ரொக்க இருப்பு' : 'Weekly Hand Cash')
          : `${type?.replace(/-/g, ' ')} Details`}
      </h1>
      {renderContent()}
    </div>
  );
};
export default StatDetails;
